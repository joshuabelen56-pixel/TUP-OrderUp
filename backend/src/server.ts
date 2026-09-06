import express, {
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";

import {
  MongoClient,
  Binary,
  ObjectId,
} from "mongodb";

import dotenv from "dotenv";
import multer from "multer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { createWorker } from "tesseract.js";

dotenv.config();

// =====================================================
// APP
// =====================================================

const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

// =====================================================
// ENV
// =====================================================

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const PORT = Number(process.env.PORT) || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || "CHANGE_THIS_JWT_SECRET";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// =====================================================
// ENV VALIDATION
// =====================================================

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is missing.");
  process.exit(1);
}

if (!DB_NAME) {
  console.error("ERROR: DB_NAME is missing.");
  process.exit(1);
}

// =====================================================
// MONGODB
// =====================================================

const client = new MongoClient(MONGODB_URI);

const db = client.db(DB_NAME);

const usersCollection = () => db.collection("users");

// =====================================================
// TYPES
// =====================================================

type AccountType =
  | "Client"
  | "Seller";

type TUPAffiliation =
  | "Student"
  | "Faculty"
  | "Staff"
  | "Others";

type AccountStatus =
  | "Approved"
  | "Pending"
  | "Rejected";

type PhotoSide =
  | "tupFront"
  | "tupBack"
  | "governmentFront"
  | "governmentBack";

// =====================================================
// GMAIL
// =====================================================

const mailTransporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      })
    : null;

// =====================================================
// HELPERS
// =====================================================

function calculateAge(
  birthday: string
): number {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}

// -----------------------------------------------------

function normalizePhone(
  phone: string
): string {
  return String(phone || "")
    .replace(/\s+/g, "")
    .trim();
}

// -----------------------------------------------------

function maskPhone(
  phone: string
): string {
  if (!phone) return "";

  if (phone.length < 4) {
    return "****";
  }

  return (
    phone.slice(0, 2) +
    "*****" +
    phone.slice(-2)
  );
}

// -----------------------------------------------------

function maskEmail(
  email: string
): string {
  if (!email) return "";

  const [name, domain] =
    email.split("@");

  if (!domain) {
    return "****";
  }

  if (name.length <= 2) {
    return (
      name.charAt(0) +
      "***@" +
      domain
    );
  }

  return (
    name.charAt(0) +
    "***" +
    name.charAt(name.length - 1) +
    "@" +
    domain
  );
}

// -----------------------------------------------------

function getUserEmail(
  user: any
): string {
  return (
    user?.gsfeEmail ||
    user?.gmailEmail ||
    user?.email ||
    ""
  );
}

// =====================================================
// OTP
// =====================================================

function generateOTP(): string {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

// -----------------------------------------------------

function hashOTP(
  otp: string
): string {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

// -----------------------------------------------------

async function sendOTPViaEmail(
  email: string,
  otp: string
): Promise<void> {

  if (!mailTransporter) {
    throw new Error(
      "Gmail transporter is not configured."
    );
  }

  await mailTransporter.sendMail({
    from: GMAIL_USER,
    to: email,
    subject:
      "TUP-OrderUp Verification Code",
    text:
      `Your TUP-OrderUp verification code is ${otp}. ` +
      `This code will expire in 10 minutes.`,
  });
}

// =====================================================
// JWT
// =====================================================

function createJWT(
  user: any
): string {

  return jwt.sign(
    {
      id: String(user._id),
      username: user.username,
      accountType: user.accountType,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// =====================================================
// SAFE USER
// =====================================================

function buildSafeUser(
  user: any
) {

  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    _id: String(user._id),

    firstName:
      user.firstName || "",

    lastName:
      user.lastName || "",

    username:
      user.username || "",

    contactNumber:
      user.contactNumber || "",

    email:
      getUserEmail(user),

    gsfeEmail:
      user.gsfeEmail || null,

    gmailEmail:
      user.gmailEmail || null,

    birthday:
      user.birthday || null,

    age:
      user.age ?? null,

    accountType:
      user.accountType || null,

    tupAffiliation:
      user.tupAffiliation || null,

    role:
      user.role || null,

    tupIdNumber:
      user.tupIdNumber || null,

    governmentIdType:
      user.governmentIdType || null,

    governmentIdNumber:
      user.governmentIdNumber || null,

    shopName:
      user.shopName || null,

    shopDescription:
      user.shopDescription || null,

    accountStatus:
      user.accountStatus || null,

    createdAt:
      user.createdAt || null,

    updatedAt:
      user.updatedAt || null,
  };
}

// =====================================================
// MULTER
// =====================================================

const upload = multer({

  storage:
    multer.memoryStorage(),

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {

    console.log(
      "UPLOAD MIME:",
      file.mimetype
    );

    console.log(
      "UPLOAD NAME:",
      file.originalname
    );

    if (
      file.mimetype &&
      file.mimetype.startsWith(
        "image/"
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed."
        )
      );
    }
  },
});

// =====================================================
// GOVERNMENT ID OCR
// =====================================================

async function extractTextFromImage(
  imageBuffer: Buffer
): Promise<string> {
  console.log("=================================");
  console.log("STARTING GOVERNMENT ID OCR...");
  console.log("=================================");

  const worker = await createWorker("eng");

  try {
    const result = await worker.recognize(imageBuffer);

    const text = result.data.text || "";

    console.log("=================================");
    console.log("OCR RESULT:");
    console.log(text);
    console.log("=================================");

    return text;
  } finally {
    await worker.terminate();
  }
}

// =====================================================
// GOVERNMENT ID NORMALIZATION
// =====================================================

function normalizeGovernmentText(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// GOVERNMENT ID NAME MATCH
// =====================================================

function nameExistsInOCR(
  name: string,
  ocrText: string
): boolean {
  const normalizedName =
    normalizeGovernmentText(name);

  const normalizedOCR =
    normalizeGovernmentText(ocrText);

  if (!normalizedName) {
    return false;
  }

  const nameParts =
    normalizedName.split(" ");

  const ocrWords =
    normalizedOCR.split(" ");

  return nameParts.every((part) =>
    ocrWords.includes(part)
  );
}

// =====================================================
// GOVERNMENT ID NUMBER NORMALIZATION
// =====================================================

function normalizeGovernmentIdNumber(
  value: string
): string {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

// =====================================================
// GOVERNMENT ID NUMBER MATCH
// =====================================================

function governmentIdNumberExistsInOCR(
  idNumber: string,
  ocrText: string
): boolean {
  const normalizedId =
    normalizeGovernmentIdNumber(idNumber);

  const normalizedOCR =
    normalizeGovernmentIdNumber(ocrText);

  if (!normalizedId) {
    return false;
  }

  return normalizedOCR.includes(normalizedId);
}

// =====================================================
// GOVERNMENT ID TYPE NORMALIZATION
// =====================================================

function normalizeGovernmentIdType(
  value: string
): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// GOVERNMENT ID TYPE MATCH
// =====================================================

function governmentIdTypeExistsInOCR(
  idType: string,
  ocrText: string
): boolean {

  const normalizedType =
    normalizeGovernmentIdType(idType);

  const normalizedOCR =
    normalizeGovernmentIdType(ocrText);

  if (!normalizedType || !normalizedOCR) {
    return false;
  }

  // -------------------------------------------------
  // COMMON GOVERNMENT ID ALIASES
  // -------------------------------------------------

  const aliases: Record<string, string[]> = {

    "NATIONAL ID": [
      "NATIONAL ID",
      "PHILIPPINE IDENTIFICATION CARD",
      "PHILSYS",
      "PHILIPPINE IDENTIFICATION"
    ],

    "DRIVER'S LICENSE": [
      "DRIVERS LICENSE",
      "DRIVER LICENSE",
      "DRIVING LICENSE",
      "LAND TRANSPORTATION OFFICE",
      "LTO"
    ],

    "PASSPORT": [
      "PASSPORT",
      "REPUBLIC OF THE PHILIPPINES"
    ],

    "UMID": [
      "UMID",
      "UNIFIED MULTI PURPOSE ID"
    ],

    "SSS ID": [
      "SSS",
      "SOCIAL SECURITY SYSTEM"
    ],

    "PHILHEALTH ID": [
      "PHILHEALTH",
      "PHILIPPINE HEALTH INSURANCE"
    ],

    "POSTAL ID": [
      "POSTAL ID",
      "PHILIPPINE POST"
    ],

    "PRC ID": [
      "PRC",
      "PROFESSIONAL REGULATION COMMISSION"
    ],

    "OTHER GOVERNMENT ID": [
      normalizedType
    ],
  };

  const possibleNames =
    aliases[normalizedType] || [
      normalizedType
    ];

  return possibleNames.some(
    (alias) =>
      normalizedOCR.includes(
        normalizeGovernmentIdType(alias)
      )
  );
}

// =====================================================
// FIND TUP ID IN OCR TEXT
// =====================================================

// =====================================================
// FIND TUP ID IN OCR
// TUPC-24-0498 → 240498
// =====================================================

function findTupIdInOCR(
  ocrText: string,
  enteredTupId: string
): boolean {

  const entered =
    String(enteredTupId || "")
      .replace(/\D/g, "");

  const text =
    String(ocrText || "")
      .toUpperCase();

  console.log("=================================");
  console.log("TUP ID OCR MATCHING");
  console.log("ENTERED TUP ID:", entered);
  console.log("OCR TEXT:");
  console.log(text);
  console.log("=================================");

  if (!entered) {
    return false;
  }

  // =================================================
  // EXPECTED FORMAT:
  //
  // TUPC-24-0498
  // TUPC 24 0498
  // TUPC-24 0498
  // TUPC 24-0498
  //
  // Result:
  // 240498
  // =================================================

  const tupIdPattern =
    /TUPC\s*[-:]?\s*(\d{2})\s*[-:]?\s*(\d{4})/i;

  const match = text.match(tupIdPattern);

  if (match) {

    const extractedTupId =
      `${match[1]}${match[2]}`;

    console.log(
      "OCR EXTRACTED TUP ID:",
      extractedTupId
    );

    console.log(
      "USER ENTERED TUP ID:",
      entered
    );

    if (extractedTupId === entered) {

      console.log(
        "✅ TUP ID MATCH SUCCESS"
      );

      return true;
    }

    console.log(
      "❌ TUP ID MATCH FAILED"
    );

    return false;
  }

  // =================================================
  // FALLBACK
  //
  // If OCR fails to recognize "TUPC",
  // look for 2 digits + 4 digits.
  //
  // Example:
  // 24-0498 → 240498
  // =================================================

  const fallbackPattern =
    /\b(\d{2})\s*[- ]\s*(\d{4})\b/;

  const fallbackMatch =
    text.match(fallbackPattern);

  if (fallbackMatch) {

    const extractedTupId =
      `${fallbackMatch[1]}${fallbackMatch[2]}`;

    console.log(
      "FALLBACK EXTRACTED TUP ID:",
      extractedTupId
    );

    console.log(
      "USER ENTERED TUP ID:",
      entered
    );

    if (extractedTupId === entered) {

      console.log(
        "✅ TUP ID FALLBACK MATCH SUCCESS"
      );

      return true;
    }
  }

  console.log(
    "❌ TUP ID NUMBER NOT FOUND IN OCR"
  );

  return false;
}

// =====================================================
// PHOTO HELPER
// =====================================================

function makePhotoObject(
  file: Express.Multer.File
) {

  return {
    data: new Binary(
      file.buffer
    ),

    contentType:
      file.mimetype,

    fileName:
      file.originalname,

    size:
      file.size,
  };
}

// =====================================================
// GET FILE FROM MULTER
// =====================================================

function getUploadedFile(
  files: {
    [fieldname: string]:
      Express.Multer.File[];
  } | undefined,
  fieldName: string
) {

  return files?.[fieldName]?.[0];
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/",
  (
    req: Request,
    res: Response
  ) => {

    res.json({
      message:
        "TUP-OrderUp API is running.",
      status: "OK",
    });
  }
);

// =====================================================
// API TEST
// =====================================================

app.get(
  "/api/test",
  (
    req: Request,
    res: Response
  ) => {

    res.json({
      message:
        "API connection successful.",
    });
  }
);

// =====================================================
// GET ALL USERS
// =====================================================

app.get(
  "/api/users",
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const users =
        await usersCollection()
          .find(
            {},
            {
              projection: {
                password: 0,
                otpHash: 0,

                "verificationPhoto.data": 0,

                "tupIdFrontPhoto.data": 0,
                "tupIdBackPhoto.data": 0,

                "governmentIdFrontPhoto.data": 0,
                "governmentIdBackPhoto.data": 0,
              },
            }
          )
          .sort({
            createdAt: -1,
          })
          .toArray();

      res.json(
        users.map(
          buildSafeUser
        )
      );

    } catch (error) {

      console.error(
        "GET USERS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch users.",
      });
    }
  }
);

// =====================================================
// GET USER BY ID
// =====================================================

app.get(
  "/api/users/:id",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await usersCollection()
          .findOne(
            {
              _id:
                new ObjectId(id),
            },
            {
              projection: {
                password: 0,
                otpHash: 0,

                "verificationPhoto.data": 0,

                "tupIdFrontPhoto.data": 0,
                "tupIdBackPhoto.data": 0,

                "governmentIdFrontPhoto.data": 0,
                "governmentIdBackPhoto.data": 0,
              },
            }
          );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.json(
        buildSafeUser(user)
      );

    } catch (error) {

      console.error(
        "GET USER ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch user.",
      });
    }
  }
);

// =====================================================
// UPDATE USER
// =====================================================

app.patch(
  "/api/users/:id",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const allowedFields = [
        "firstName",
        "lastName",
        "contactNumber",
        "birthday",
        "shopName",
        "shopDescription",
      ];

      const updateData: any = {};

      for (
        const field of allowedFields
      ) {

        if (
          req.body[field] !== undefined
        ) {

          updateData[field] =
            req.body[field];
        }
      }

      if (
        updateData.contactNumber
      ) {

        updateData.contactNumber =
          normalizePhone(
            updateData.contactNumber
          );
      }

      if (
        updateData.birthday
      ) {

        updateData.age =
          calculateAge(
            updateData.birthday
          );
      }

      updateData.updatedAt =
        new Date();

      const result =
        await usersCollection()
          .findOneAndUpdate(
            {
              _id:
                new ObjectId(id),
            },
            {
              $set:
                updateData,
            },
            {
              returnDocument:
                "after",
            }
          );

      if (!result) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.json({
        message:
          "User updated successfully.",
        user:
          buildSafeUser(result),
      });

    } catch (error) {

      console.error(
        "UPDATE USER ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update user.",
      });
    }
  }
);

// =====================================================
// UPDATE PASSWORD
// =====================================================

app.patch(
  "/api/users/:id/password",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      if (
        !currentPassword ||
        !newPassword
      ) {

        return res.status(400).json({
          message:
            "Current password and new password are required.",
        });
      }

      if (
        String(newPassword).length < 8
      ) {

        return res.status(400).json({
          message:
            "New password must be at least 8 characters.",
        });
      }

      const user =
        await usersCollection()
          .findOne({
            _id:
              new ObjectId(id),
          });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!passwordMatch) {

        return res.status(401).json({
          message:
            "Current password is incorrect.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          12
        );

      await usersCollection()
        .updateOne(
          {
            _id:
              new ObjectId(id),
          },
          {
            $set: {
              password:
                hashedPassword,
              updatedAt:
                new Date(),
            },
          }
        );

      return res.json({
        message:
          "Password updated successfully.",
      });

    } catch (error) {

      console.error(
        "PASSWORD UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update password.",
      });
    }
  }
);

// =====================================================
// REGISTER USER
// =====================================================
//
// IMPORTANT:
// This now accepts:
//
// STUDENT:
//   tupIdFrontPhoto
//   tupIdBackPhoto
//
// FACULTY / STAFF / OTHERS:
//   governmentIdFrontPhoto
//   governmentIdBackPhoto
//
// SELLER:
//   governmentIdFrontPhoto
//   governmentIdBackPhoto
//
// =====================================================

app.post(
  "/api/users",

  upload.fields([
    {
      name:
        "tupIdFrontPhoto",
      maxCount: 1,
    },
    {
      name:
        "tupIdBackPhoto",
      maxCount: 1,
    },
    {
      name:
        "governmentIdFrontPhoto",
      maxCount: 1,
    },
    {
      name:
        "governmentIdBackPhoto",
      maxCount: 1,
    },
  ]),

  async (
    req: Request,
    res: Response
  ) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "NEW REGISTRATION REQUEST"
      );

      console.log(
        "BODY:",
        req.body
      );

      const files =
        req.files as
          | {
              [fieldname: string]:
                Express.Multer.File[];
            }
          | undefined;

      // -------------------------------------------------
      // GET UPLOADED FILES
      // -------------------------------------------------

      const tupIdFrontFile =
        getUploadedFile(
          files,
          "tupIdFrontPhoto"
        );

      const tupIdBackFile =
        getUploadedFile(
          files,
          "tupIdBackPhoto"
        );

      const governmentIdFrontFile =
        getUploadedFile(
          files,
          "governmentIdFrontPhoto"
        );

      const governmentIdBackFile =
        getUploadedFile(
          files,
          "governmentIdBackPhoto"
        );

      // -------------------------------------------------
      // LOG FILES
      // -------------------------------------------------

      console.log(
        "TUP FRONT:",
        tupIdFrontFile
          ? `${tupIdFrontFile.originalname} (${tupIdFrontFile.size} bytes)`
          : "NONE"
      );

      console.log(
        "TUP BACK:",
        tupIdBackFile
          ? `${tupIdBackFile.originalname} (${tupIdBackFile.size} bytes)`
          : "NONE"
      );

      console.log(
        "GOV FRONT:",
        governmentIdFrontFile
          ? `${governmentIdFrontFile.originalname} (${governmentIdFrontFile.size} bytes)`
          : "NONE"
      );

      console.log(
        "GOV BACK:",
        governmentIdBackFile
          ? `${governmentIdBackFile.originalname} (${governmentIdBackFile.size} bytes)`
          : "NONE"
      );

      // -------------------------------------------------
      // BODY
      // -------------------------------------------------

      const {
        firstName,
        lastName,
        username,
        contactNumber,
        birthday,

        accountType,
        tupAffiliation,

        gsfeEmail,
        tupIdNumber,
        gmailEmail,

        governmentIdType,
        governmentIdNumber,

        shopName,
        shopDescription,

        password,
      } = req.body;

      // -------------------------------------------------
      // REQUIRED BASIC FIELDS
      // -------------------------------------------------

      if (
        !firstName ||
        !lastName ||
        !username ||
        !contactNumber ||
        !birthday ||
        !accountType ||
        !password
      ) {

        return res.status(400).json({
          message:
            "Please complete all required fields.",
        });
      }

      // -------------------------------------------------
      // ACCOUNT TYPE
      // -------------------------------------------------

      const cleanAccountType =
        String(accountType)
          .trim() as AccountType;

      if (
        !["Client", "Seller"].includes(
          cleanAccountType
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid account type.",
        });
      }

      // -------------------------------------------------
      // AFFILIATION
      // -------------------------------------------------

      let cleanAffiliation:
        TUPAffiliation | null =
        null;

      if (
        cleanAccountType === "Client"
      ) {

        if (
          ![
            "Student",
            "Faculty",
            "Staff",
            "Others",
          ].includes(
            String(tupAffiliation)
          )
        ) {

          return res.status(400).json({
            message:
              "Invalid TUP affiliation.",
          });
        }

        cleanAffiliation =
          String(
            tupAffiliation
          ) as TUPAffiliation;
      }

      // Seller does not need a TUP affiliation.
      if (
        cleanAccountType === "Seller"
      ) {
        cleanAffiliation = "Others";
      }

      // -------------------------------------------------
      // PHONE
      // -------------------------------------------------

      const cleanContactNumber =
        normalizePhone(
          contactNumber
        );

      if (
        !/^09\d{9}$/.test(
          cleanContactNumber
        )
      ) {

        return res.status(400).json({
          message:
            "Contact number must be a valid Philippine mobile number.",
        });
      }

      // -------------------------------------------------
      // USERNAME
      // -------------------------------------------------

      const cleanUsername =
        String(username)
          .trim();

      if (
        cleanUsername.length < 3 ||
        cleanUsername.length > 30
      ) {

        return res.status(400).json({
          message:
            "Username must be 3 to 30 characters.",
        });
      }

      if (
        !/^[a-zA-Z0-9._]+$/.test(
          cleanUsername
        )
      ) {

        return res.status(400).json({
          message:
            "Username can only contain letters, numbers, dots, and underscores.",
        });
      }

      // -------------------------------------------------
      // PASSWORD
      // -------------------------------------------------

      if (
        String(password).length < 8
      ) {

        return res.status(400).json({
          message:
            "Password must be at least 8 characters.",
        });
      }

      // -------------------------------------------------
      // BIRTHDAY
      // -------------------------------------------------

      const birthDate =
        new Date(birthday);

      if (
        Number.isNaN(
          birthDate.getTime()
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid birthday.",
        });
      }

      const today =
        new Date();

      if (
        birthDate > today
      ) {

        return res.status(400).json({
          message:
            "Birthday cannot be in the future.",
        });
      }

      const age =
        calculateAge(
          String(birthday)
        );

      if (age < 13) {

        return res.status(400).json({
          message:
            "User must be at least 13 years old.",
        });
      }

let cleanGsfeEmail: string | null = null;
let cleanGmailEmail: string | null = null;
let cleanTupId: string | null = null;

// =================================================
// FACULTY / STAFF / OTHERS GMAIL
// =================================================

if (
  cleanAccountType === "Client" &&
  cleanAffiliation !== "Student"
) {
  cleanGmailEmail = String(gmailEmail || "")
    .trim()
    .toLowerCase();

  if (!cleanGmailEmail) {
    return res.status(400).json({
      message:
        "Gmail address is required for Faculty, Staff, and Others.",
    });
  }

  if (
    !/^[^\s@]+@gmail\.com$/.test(
      cleanGmailEmail
    )
  ) {
    return res.status(400).json({
      message:
        "Please enter a valid Gmail address.",
    });
  }

  console.log(
    "GMAIL:",
    cleanGmailEmail
  );
}

// =================================================
// STUDENT VALIDATION
// =================================================

if (
  cleanAccountType === "Client" &&
  cleanAffiliation === "Student"
) {

  // -------------------------------------------------
  // GSFE EMAIL
  // -------------------------------------------------

  cleanGsfeEmail =
    String(gsfeEmail || "")
      .trim()
      .toLowerCase();

  if (!cleanGsfeEmail) {
    return res.status(400).json({
      message:
        "GSFE email is required for students.",
    });
  }

  if (
    !cleanGsfeEmail.includes("@") ||
    !cleanGsfeEmail.includes(".")
  ) {
    return res.status(400).json({
      message:
        "Please enter a valid GSFE email address.",
    });
  }

  // -------------------------------------------------
  // TUP ID NUMBER
  // -------------------------------------------------

  cleanTupId =
    String(tupIdNumber || "")
      .trim();

  if (!cleanTupId) {
    return res.status(400).json({
      message:
        "TUP ID number is required.",
    });
  }

  // -------------------------------------------------
  // TUP ID FRONT
  // -------------------------------------------------

  if (!tupIdFrontFile) {
    return res.status(400).json({
      message:
        "TUP ID front photo is required.",
    });
  }

  // -------------------------------------------------
  // TUP ID BACK
  // -------------------------------------------------

  if (!tupIdBackFile) {
    return res.status(400).json({
      message:
        "TUP ID back photo is required.",
    });
  }

  // =================================================
  // TUP ID OCR VERIFICATION
  // =================================================

  console.log("=================================");
  console.log("TUP ID OCR VERIFICATION");
  console.log("=================================");

  try {
    const ocrText =
      await extractTextFromImage(
        tupIdFrontFile.buffer
      );

    const tupIdMatched =
      findTupIdInOCR(
        ocrText,
        cleanTupId
      );

    if (!tupIdMatched) {
      console.log(
        "❌ TUP ID OCR MATCH FAILED"
      );

      return res.status(400).json({
        message:
          "TUP ID number does not match the uploaded TUP ID.",
        verification: {
          type: "TUP_ID_OCR",
          matched: false,
        },
      });
    }

    console.log(
      "✅ TUP ID OCR MATCH SUCCESS"
    );

  } catch (ocrError) {

    console.error(
      "TUP ID OCR ERROR:",
      ocrError
    );

    return res.status(500).json({
      message:
        "Unable to read the TUP ID. Please upload a clearer photo.",
      verification: {
        type: "TUP_ID_OCR",
        matched: false,
      },
    });
  }

  console.log("=================================");
  console.log("STUDENT VALIDATION + OCR: OK");
  console.log("GSFE EMAIL:", cleanGsfeEmail);
  console.log("TUP ID:", cleanTupId);
  console.log("TUP ID FRONT: OK");
  console.log("TUP ID BACK: OK");
  console.log("TUP ID OCR: MATCHED");
  console.log("=================================");
}


// =================================================
// GOVERNMENT ID VALIDATION
// =================================================

let cleanGovernmentIdType: string | null = null;

let cleanGovernmentIdNumber: string | null = null;

const needsGovernmentID =
  cleanAccountType === "Seller" ||
  (
    cleanAccountType === "Client" &&
    cleanAffiliation !== "Student"
  );

if (needsGovernmentID) {

  cleanGovernmentIdType =
    String(governmentIdType || "")
      .trim();

  cleanGovernmentIdNumber =
    String(governmentIdNumber || "")
      .trim();

  // -------------------------------------------------
  // ID TYPE
  // -------------------------------------------------

  if (!cleanGovernmentIdType) {
    return res.status(400).json({
      message: "Government ID type is required.",
    });
  }

  // -------------------------------------------------
  // ID NUMBER
  // -------------------------------------------------

  if (!cleanGovernmentIdNumber) {
    return res.status(400).json({
      message: "Government ID number is required.",
    });
  }

  // -------------------------------------------------
  // ID FRONT
  // -------------------------------------------------

  if (!governmentIdFrontFile) {
    return res.status(400).json({
      message: "Government ID front photo is required.",
    });
  }

  // -------------------------------------------------
  // ID BACK
  // -------------------------------------------------

  if (!governmentIdBackFile) {
    return res.status(400).json({
      message: "Government ID back photo is required.",
    });
  }

  // =================================================
// GOVERNMENT ID OCR VERIFICATION
// =================================================

if (
  cleanAccountType === "Seller"
) {

  console.log(
    "================================="
  );

  console.log(
    "SELLER GOVERNMENT ID OCR VERIFICATION"
  );

  console.log(
    "================================="
  );

  try {

    // ---------------------------------------------
    // OCR FRONT
    // ---------------------------------------------

    const frontText =
      await extractTextFromImage(
        governmentIdFrontFile.buffer
      );

    // ---------------------------------------------
    // OCR BACK
    // ---------------------------------------------

    const backText =
      await extractTextFromImage(
        governmentIdBackFile.buffer
      );

    // ---------------------------------------------
    // COMBINE OCR
    // ---------------------------------------------

    const combinedOCR =
      `${frontText}\n${backText}`;

    console.log(
      "SELLER GOVERNMENT ID OCR:"
    );

    console.log(
      combinedOCR
    );

    // ---------------------------------------------
    // FIRST NAME
    // ---------------------------------------------

    const firstNameMatched =
      nameExistsInOCR(
        String(firstName),
        combinedOCR
      );

    // ---------------------------------------------
    // LAST NAME
    // ---------------------------------------------

    const lastNameMatched =
      nameExistsInOCR(
        String(lastName),
        combinedOCR
      );

    // ---------------------------------------------
    // ID TYPE
    // ---------------------------------------------

    const idTypeMatched =
      governmentIdTypeExistsInOCR(
        String(cleanGovernmentIdType),
        combinedOCR
      );

    // ---------------------------------------------
    // ID NUMBER
    // ---------------------------------------------

    const idNumberMatched =
      governmentIdNumberExistsInOCR(
        String(cleanGovernmentIdNumber),
        combinedOCR
      );

    // ---------------------------------------------
    // GOVERNMENT ID MATCH
    // TYPE + NUMBER
    // ---------------------------------------------

    const governmentIdMatched =
      idTypeMatched &&
      idNumberMatched;

    // ---------------------------------------------
    // FINAL 3-WAY VERIFICATION
    // ---------------------------------------------

    const verified =
      firstNameMatched &&
      lastNameMatched &&
      governmentIdMatched;

    console.log(
      "================================="
    );

    console.log(
      "SELLER ID VERIFICATION RESULT"
    );

    console.log(
      "FIRST NAME:",
      firstNameMatched
    );

    console.log(
      "LAST NAME:",
      lastNameMatched
    );

    console.log(
      "ID TYPE:",
      idTypeMatched
    );

    console.log(
      "ID NUMBER:",
      idNumberMatched
    );

    console.log(
      "GOVERNMENT ID:",
      governmentIdMatched
    );

    console.log(
      "FINAL VERIFIED:",
      verified
    );

    console.log(
      "================================="
    );

    // ---------------------------------------------
    // BLOCK REGISTRATION IF NOT VERIFIED
    // ---------------------------------------------

    if (!verified) {

      const failedChecks: string[] = [];

      if (!firstNameMatched) {
        failedChecks.push(
          "First Name"
        );
      }

      if (!lastNameMatched) {
        failedChecks.push(
          "Last Name"
        );
      }

      if (!idTypeMatched) {
        failedChecks.push(
          "Government ID Type"
        );
      }

      if (!idNumberMatched) {
        failedChecks.push(
          "Government ID Number"
        );
      }

      return res.status(400).json({

        verified: false,

        message:
          "Seller government ID verification failed.",

        failedChecks,

        matches: {
          firstName:
            firstNameMatched,

          lastName:
            lastNameMatched,

          idType:
            idTypeMatched,

          idNumber:
            idNumberMatched,

          governmentId:
            governmentIdMatched,
        },

      });
    }

    console.log(
      "✅ SELLER GOVERNMENT ID VERIFIED"
    );

  } catch (ocrError) {

    console.error(
      "SELLER GOVERNMENT ID OCR ERROR:",
      ocrError
    );

    return res.status(500).json({

      verified: false,

      message:
        "Unable to read the government ID. Please upload clearer photos.",

    });
  }
}

  console.log("=================================");
  console.log("GOVERNMENT ID VALIDATION: OK");
  console.log("ID TYPE:", cleanGovernmentIdType);
  console.log("ID NUMBER:", cleanGovernmentIdNumber);
  console.log("ID FRONT: OK");
  console.log("ID BACK: OK");
  console.log("=================================");
}


// =================================================
// SELLER VALIDATION
// =================================================

let cleanShopName: string | null = null;

let cleanShopDescription: string | null = null;

if (cleanAccountType === "Seller") {

  cleanShopName =
    String(shopName || "")
      .trim();

  cleanShopDescription =
    String(shopDescription || "")
      .trim();

  if (!cleanShopName) {
    return res.status(400).json({
      message: "Shop name is required for sellers.",
    });
  }

  if (!cleanShopDescription) {
    return res.status(400).json({
      message: "Shop description is required for sellers.",
    });
  }
}


// =================================================
// DUPLICATE CHECK
// =================================================

const usernameExists =
  await usersCollection().findOne({
    username: cleanUsername,
  });

if (usernameExists) {
  return res.status(409).json({
    message: "Username is already taken.",
  });
}


// -------------------------------------------------
// CONTACT DUPLICATE
// -------------------------------------------------

const contactExists =
  await usersCollection().findOne({
    contactNumber: cleanContactNumber,
  });

if (contactExists) {
  return res.status(409).json({
    message: "Contact number is already registered.",
  });
}


// -------------------------------------------------
// EMAIL DUPLICATE
// -------------------------------------------------

if (cleanGsfeEmail) {

  const emailExists =
    await usersCollection().findOne({
      gsfeEmail: cleanGsfeEmail,
    });

  if (emailExists) {
    return res.status(409).json({
      message: "GSFE email is already registered.",
    });
  }
}


// -------------------------------------------------
// TUP ID DUPLICATE
// -------------------------------------------------

if (cleanTupId) {

  const tupIdExists =
    await usersCollection().findOne({
      tupIdNumber: cleanTupId,
    });

  if (tupIdExists) {
    return res.status(409).json({
      message: "TUP ID number is already registered.",
    });
  }
}


// -------------------------------------------------
// GOVERNMENT ID DUPLICATE
// -------------------------------------------------

if (cleanGovernmentIdNumber) {

  const governmentIdExists =
    await usersCollection().findOne({
      governmentIdNumber:
        cleanGovernmentIdNumber,
    });

  if (governmentIdExists) {
    return res.status(409).json({
      message:
        "Government ID number is already registered.",
    });
  }
}


// =================================================
// HASH PASSWORD
// =================================================

const hashedPassword =
  await bcrypt.hash(
    password,
    12
  );


// =================================================
// ACCOUNT STATUS
// =================================================

const accountStatus: AccountStatus =
  cleanAccountType === "Seller"
    ? "Pending"
    : "Approved";


// =================================================
// ROLE
// =================================================

const compatibilityRole =
  cleanAccountType === "Seller"
    ? "Seller"
    : cleanAffiliation;


// =================================================
// PHOTO OBJECTS
// =================================================

const tupIdFrontPhoto =
  tupIdFrontFile
    ? makePhotoObject(tupIdFrontFile)
    : null;

const tupIdBackPhoto =
  tupIdBackFile
    ? makePhotoObject(tupIdBackFile)
    : null;

const governmentIdFrontPhoto =
  governmentIdFrontFile
    ? makePhotoObject(
        governmentIdFrontFile
      )
    : null;

const governmentIdBackPhoto =
  governmentIdBackFile
    ? makePhotoObject(
        governmentIdBackFile
      )
    : null;


// =================================================
// USER DOCUMENT
// =================================================

const newUser = {

  firstName:
    String(firstName)
      .trim(),

  lastName:
    String(lastName)
      .trim(),

  username:
    cleanUsername,

  contactNumber:
    cleanContactNumber,

  birthday:
    String(birthday),

  age,

  accountType:
    cleanAccountType,

  tupAffiliation:
    cleanAffiliation,

  role:
    compatibilityRole,

  // ------------------------------------------------
  // STUDENT INFORMATION
  // ------------------------------------------------

  gsfeEmail:
    cleanAffiliation === "Student"
      ? cleanGsfeEmail
      : null,

  tupIdNumber:
    cleanAffiliation === "Student"
      ? cleanTupId
      : null,

  gmailEmail:
  cleanAffiliation !== "Student" &&
  cleanAccountType === "Client"
    ? cleanGmailEmail
    : null,

  // ------------------------------------------------
  // GOVERNMENT ID INFORMATION
  // ------------------------------------------------

  governmentIdType:
    cleanGovernmentIdType,

  governmentIdNumber:
    cleanGovernmentIdNumber,

  // ------------------------------------------------
  // SELLER INFORMATION
  // ------------------------------------------------

  shopName:
    cleanShopName,

  shopDescription:
    cleanShopDescription,

  // ------------------------------------------------
  // ID PHOTOS
  // ------------------------------------------------

  tupIdFrontPhoto,

  tupIdBackPhoto,

  governmentIdFrontPhoto,

  governmentIdBackPhoto,

  // ------------------------------------------------
  // OLD FIELD
  // ------------------------------------------------

  verificationPhoto:
    null,

  // ------------------------------------------------
  // PASSWORD
  // ------------------------------------------------

  password:
    hashedPassword,

  // ------------------------------------------------
  // ACCOUNT STATUS
  // ------------------------------------------------

  accountStatus,

  // ------------------------------------------------
  // OTP
  // ------------------------------------------------

  otpHash:
    null,

  otpExpiresAt:
    null,

  otpAttempts:
    0,

  otpLastSentAt:
    null,

  otpVerifiedAt:
    null,

  // ------------------------------------------------
  // DATES
  // ------------------------------------------------

  createdAt:
    new Date(),

  updatedAt:
    new Date(),
};


// =================================================
// INSERT
// =================================================

const result =
  await usersCollection()
    .insertOne(newUser);


console.log(
  "================================="
);

console.log(
  "REGISTRATION SUCCESS"
);

console.log(
  "USER ID:",
  result.insertedId
);

console.log(
  "ACCOUNT TYPE:",
  cleanAccountType
);

console.log(
  "AFFILIATION:",
  cleanAffiliation
);

console.log(
  "ACCOUNT STATUS:",
  accountStatus
);

if (
  cleanAffiliation === "Student"
) {
  console.log(
    "GSFE EMAIL:",
    cleanGsfeEmail
  );

  console.log(
    "TUP ID:",
    cleanTupId
  );
}

console.log(
  "================================="
);


// =================================================
// RESPONSE
// =================================================

return res.status(201).json({

  message:
    "Registration successful.",

  user:
    buildSafeUser({
      ...newUser,
      _id:
        result.insertedId,
    }),

  });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "REGISTRATION ERROR:",
        error
      );

      console.error(
        "================================="
      );

      return res.status(500).json({
        message:
          "Registration failed.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      });
    }
  }
);


// =====================================================
// VERIFY GOVERNMENT ID
// FACULTY / STAFF / OTHERS ONLY
// =====================================================

app.post(
  "/api/verify-government-id",

  upload.fields([
    {
      name: "governmentIdFront",
      maxCount: 1,
    },
    {
      name: "governmentIdBack",
      maxCount: 1,
    },
  ]),

  async (
    req: Request,
    res: Response
  ) => {
    try {

      console.log(
        "================================="
      );

      console.log(
        "GOVERNMENT ID VERIFICATION REQUEST"
      );

      console.log(
        "================================="
      );

      // -------------------------------------------------
      // GET BODY
      // -------------------------------------------------

      const {
        firstName,
        lastName,
        governmentIdType,
        governmentIdNumber,
      } = req.body;

      console.log(
        "FIRST NAME:",
        firstName
      );

      console.log(
        "LAST NAME:",
        lastName
      );

      console.log(
        "GOVERNMENT ID TYPE:",
        governmentIdType
      );

      console.log(
        "GOVERNMENT ID NUMBER:",
        governmentIdNumber
      );

      // -------------------------------------------------
      // GET FILES
      // -------------------------------------------------

      const files =
        req.files as
          | {
              [fieldname: string]:
                Express.Multer.File[];
            }
          | undefined;

      const governmentIdFront =
        getUploadedFile(
          files,
          "governmentIdFront"
        );

      const governmentIdBack =
        getUploadedFile(
          files,
          "governmentIdBack"
        );

      console.log(
        "GOVERNMENT ID FRONT:",
        governmentIdFront
          ? `${governmentIdFront.originalname} (${governmentIdFront.size} bytes)`
          : "NONE"
      );

      console.log(
        "GOVERNMENT ID BACK:",
        governmentIdBack
          ? `${governmentIdBack.originalname} (${governmentIdBack.size} bytes)`
          : "NONE"
      );

      // -------------------------------------------------
      // BASIC VALIDATION
      // -------------------------------------------------

      if (
        !firstName ||
        !lastName ||
        !governmentIdType ||
        !governmentIdNumber
      ) {
        return res.status(400).json({
          verified: false,
          message:
            "First name, last name, government ID type, and government ID number are required.",
        });
      }

      if (!governmentIdFront) {
        return res.status(400).json({
          verified: false,
          message:
            "Government ID front photo is required.",
        });
      }

      if (!governmentIdBack) {
        return res.status(400).json({
          verified: false,
          message:
            "Government ID back photo is required.",
        });
      }

      // -------------------------------------------------
      // OCR FRONT
      // -------------------------------------------------

      console.log(
        "================================="
      );

      console.log(
        "STARTING FRONT ID OCR"
      );

      console.log(
        "================================="
      );

      const frontText =
        await extractTextFromImage(
          governmentIdFront.buffer
        );

      // -------------------------------------------------
      // OCR BACK
      // -------------------------------------------------

      console.log(
        "================================="
      );

      console.log(
        "STARTING BACK ID OCR"
      );

      console.log(
        "================================="
      );

      const backText =
        await extractTextFromImage(
          governmentIdBack.buffer
        );

      // -------------------------------------------------
      // COMBINE OCR
      // -------------------------------------------------

      const combinedOCR =
        `${frontText}\n${backText}`;

      console.log(
        "================================="
      );

      console.log(
        "COMBINED GOVERNMENT ID OCR"
      );

      console.log(
        combinedOCR
      );

      console.log(
        "================================="
      );

      // -------------------------------------------------
      // FIRST NAME MATCH
      // -------------------------------------------------

      const firstNameMatched =
        nameExistsInOCR(
          String(firstName),
          combinedOCR
        );

      // -------------------------------------------------
      // LAST NAME MATCH
      // -------------------------------------------------

      const lastNameMatched =
        nameExistsInOCR(
          String(lastName),
          combinedOCR
        );

      // -------------------------------------------------
      // GOVERNMENT ID NUMBER MATCH
      // -------------------------------------------------

// -------------------------------------------------
// GOVERNMENT ID TYPE MATCH
// -------------------------------------------------

const idTypeMatched =
  governmentIdTypeExistsInOCR(
    String(governmentIdType),
    combinedOCR
  );

// -------------------------------------------------
// GOVERNMENT ID NUMBER MATCH
// -------------------------------------------------

const idNumberMatched =
  governmentIdNumberExistsInOCR(
    String(governmentIdNumber),
    combinedOCR
  );

// -------------------------------------------------
// GOVERNMENT ID = TYPE + NUMBER
// -------------------------------------------------

const governmentIdMatched =
  idTypeMatched &&
  idNumberMatched;

      // -------------------------------------------------
      // RESULT
      // -------------------------------------------------

const verified =
  firstNameMatched &&
  lastNameMatched &&
  governmentIdMatched;

      console.log(
        "================================="
      );

      console.log(
        "GOVERNMENT ID VERIFICATION RESULT"
      );

console.log(
  "FIRST NAME MATCH:",
  firstNameMatched
);

console.log(
  "LAST NAME MATCH:",
  lastNameMatched
);

console.log(
  "ID TYPE MATCH:",
  idTypeMatched
);

console.log(
  "ID NUMBER MATCH:",
  idNumberMatched
);

console.log(
  "GOVERNMENT ID MATCH:",
  governmentIdMatched
);

console.log(
  "FINAL VERIFIED:",
  verified
);

      console.log(
        "================================="
      );

      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      return res.json({
        verified,

        matches: {
          firstName:
            firstNameMatched,

          lastName:
            lastNameMatched,

          idType:
            idTypeMatched,

          idNumber:
            idNumberMatched,

          governmentId:
            governmentIdMatched,
        },

        governmentIdType:
          String(
            governmentIdType
          ).trim(),

        message: verified
          ? "Government ID verification successful."
          : "Government ID information does not match the uploaded ID.",
      });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "GOVERNMENT ID VERIFICATION ERROR:",
        error
      );

      console.error(
        "================================="
      );

      return res.status(500).json({
        verified: false,
        message:
          "Unable to verify the government ID. Please upload clearer photos.",
      });
    }
  }
);


// =====================================================
// LOGIN
// =====================================================
  

// =====================================================
// LOGIN
// =====================================================

app.post(
  "/api/auth/login",
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        username,
        password,
      } = req.body;

      console.log(
        "================================="
      );

      console.log(
        "LOGIN REQUEST"
      );

      console.log(
        "Username:",
        username
      );

      if (
        !username ||
        !password
      ) {

        return res.status(400).json({
          message:
            "Username and password are required.",
        });
      }

      const cleanUsername =
        String(username)
          .trim();

      const user =
        await usersCollection()
          .findOne({
            username:
              cleanUsername,
          });

      if (!user) {

        return res.status(401).json({
          message:
            "Invalid username or password.",
        });
      }

      // -------------------------------------------------
      // PASSWORD CHECK
      // -------------------------------------------------

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {

        return res.status(401).json({
          message:
            "Invalid username or password.",
        });
      }

      // -------------------------------------------------
      // REJECTED ACCOUNT
      // -------------------------------------------------

      if (
        user.accountStatus ===
        "Rejected"
      ) {

        return res.status(403).json({
          message:
            "Your account registration was rejected.",
          accountStatus:
            "Rejected",
        });
      }

      // -------------------------------------------------
      // SELLER PENDING
      // -------------------------------------------------

      if (
        user.accountStatus ===
        "Pending"
      ) {

        return res.status(403).json({
          message:
            "Your account is still pending admin approval.",
          accountStatus:
            "Pending",
        });
      }

      // -------------------------------------------------
      // APPROVED
      // -------------------------------------------------

      const token =
        createJWT(user);

      console.log(
        "LOGIN SUCCESS:",
        user.username
      );

      console.log(
        "================================="
      );

      return res.json({

        message:
          "Login successful.",

        token,

        user:
          buildSafeUser(user),
      });

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Login failed.",
      });
    }
  }
);

// =====================================================
// VERIFY OTP
// =====================================================

app.post(
  "/api/auth/verify-otp",
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        userId,
        otp,
      } = req.body;

      if (
        !userId ||
        !otp
      ) {

        return res.status(400).json({
          message:
            "User ID and OTP are required.",
        });
      }

      if (
        !ObjectId.isValid(userId)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await usersCollection()
          .findOne({
            _id:
              new ObjectId(userId),
          });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      if (
        !user.otpHash ||
        !user.otpExpiresAt
      ) {

        return res.status(400).json({
          message:
            "No active OTP found.",
        });
      }

      const expiresAt =
        new Date(
          user.otpExpiresAt
        );

      if (
        expiresAt.getTime() <
        Date.now()
      ) {

        return res.status(400).json({
          message:
            "OTP has expired.",
        });
      }

      const hashedInput =
        hashOTP(
          String(otp)
        );

      if (
        hashedInput !==
        user.otpHash
      ) {

        const attempts =
          Number(
            user.otpAttempts || 0
          ) + 1;

        await usersCollection()
          .updateOne(
            {
              _id:
                new ObjectId(userId),
            },
            {
              $set: {
                otpAttempts:
                  attempts,
                updatedAt:
                  new Date(),
              },
            }
          );

        return res.status(400).json({
          message:
            "Invalid OTP.",
        });
      }

      await usersCollection()
        .updateOne(
          {
            _id:
              new ObjectId(userId),
          },
          {
            $set: {
              otpHash:
                null,

              otpExpiresAt:
                null,

              otpAttempts:
                0,

              otpVerifiedAt:
                new Date(),

              updatedAt:
                new Date(),
            },
          }
        );

      const updatedUser =
        await usersCollection()
          .findOne({
            _id:
              new ObjectId(userId),
          });

      const token =
        updatedUser
          ? createJWT(
              updatedUser
            )
          : null;

      return res.json({

        message:
          "OTP verified successfully.",

        token,

        user:
          updatedUser
            ? buildSafeUser(
                updatedUser
              )
            : null,
      });

    } catch (error) {

      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "OTP verification failed.",
      });
    }
  }
);

// =====================================================
// RESEND OTP
// =====================================================

app.post(
  "/api/auth/resend-otp",
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        userId,
      } = req.body;

      if (
        !userId
      ) {

        return res.status(400).json({
          message:
            "User ID is required.",
        });
      }

      if (
        !ObjectId.isValid(userId)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await usersCollection()
          .findOne({
            _id:
              new ObjectId(userId),
          });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      const email =
        getUserEmail(user);

      if (!email) {

        return res.status(400).json({
          message:
            "No email address is associated with this account.",
        });
      }

      const otp =
        generateOTP();

      const otpHash =
        hashOTP(otp);

      const expiresAt =
        new Date(
          Date.now() +
          10 * 60 * 1000
        );

      await sendOTPViaEmail(
        email,
        otp
      );

      await usersCollection()
        .updateOne(
          {
            _id:
              new ObjectId(userId),
          },
          {
            $set: {

              otpHash,

              otpExpiresAt:
                expiresAt,

              otpAttempts:
                0,

              otpLastSentAt:
                new Date(),

              updatedAt:
                new Date(),
            },
          }
        );

      return res.json({

        message:
          "OTP has been resent.",

        maskedEmail:
          maskEmail(email),

        maskedPhone:
          maskPhone(
            user.contactNumber
          ),
      });

    } catch (error) {

      console.error(
        "RESEND OTP ERROR:",
        error
      );

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to resend OTP.",
      });
    }
  }
);

// =====================================================
// ADMIN - GET ALL USERS
// =====================================================

app.get(
  "/api/admin/users",
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const users =
        await usersCollection()
          .find(
            {},
            {
              projection: {

                password: 0,
                otpHash: 0,

                "verificationPhoto.data": 0,

                "tupIdFrontPhoto.data": 0,
                "tupIdBackPhoto.data": 0,

                "governmentIdFrontPhoto.data": 0,
                "governmentIdBackPhoto.data": 0,
              },
            }
          )
          .sort({
            createdAt: -1,
          })
          .toArray();

      return res.json(
        users.map(
          buildSafeUser
        )
      );

    } catch (error) {

      console.error(
        "ADMIN GET USERS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch admin users.",
      });
    }
  }
);

// =====================================================
// ADMIN - GET PENDING USERS
// =====================================================

app.get(
  "/api/admin/users/pending",
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const users =
        await usersCollection()
          .find(
            {
              accountStatus:
                "Pending",
            },
            {
              projection: {

                password: 0,
                otpHash: 0,

                "verificationPhoto.data": 0,

                "tupIdFrontPhoto.data": 0,
                "tupIdBackPhoto.data": 0,

                "governmentIdFrontPhoto.data": 0,
                "governmentIdBackPhoto.data": 0,
              },
            }
          )
          .sort({
            createdAt: -1,
          })
          .toArray();

      return res.json(
        users.map(
          buildSafeUser
        )
      );

    } catch (error) {

      console.error(
        "ADMIN PENDING ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch pending users.",
      });
    }
  }
);

// =====================================================
// ADMIN - GET SINGLE USER
// =====================================================

app.get(
  "/api/admin/users/:id",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await usersCollection()
          .findOne(
            {
              _id:
                new ObjectId(id),
            },
            {
              projection: {

                password: 0,
                otpHash: 0,

                "verificationPhoto.data": 0,

                "tupIdFrontPhoto.data": 0,
                "tupIdBackPhoto.data": 0,

                "governmentIdFrontPhoto.data": 0,
                "governmentIdBackPhoto.data": 0,
              },
            }
          );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.json(
        buildSafeUser(user)
      );

    } catch (error) {

      console.error(
        "ADMIN GET USER ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch user.",
      });
    }
  }
);

// =====================================================
// ADMIN - GET USER PHOTO
// =====================================================
//
// Examples:
//
// /api/admin/users/USER_ID/photo?side=tupFront
// /api/admin/users/USER_ID/photo?side=tupBack
// /api/admin/users/USER_ID/photo?side=governmentFront
// /api/admin/users/USER_ID/photo?side=governmentBack
//
// If no side is supplied, it will return the first
// available front photo for backward compatibility.
//
// =====================================================

app.get(
  "/api/admin/users/:id/photo",
  async (
    req: Request,
    res: Response
  ) => {

    try {

 const id =
  String(req.params.id);

      const side =
        String(
          req.query.side || ""
        ) as PhotoSide | "";

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await usersCollection()
          .findOne({
            _id:
              new ObjectId(id),
          });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      // -------------------------------------------------
      // PHOTO FIELD
      // -------------------------------------------------

      const photoMap: Record<
        PhotoSide,
        any
      > = {

        tupFront:
          user.tupIdFrontPhoto,

        tupBack:
          user.tupIdBackPhoto,

        governmentFront:
          user.governmentIdFrontPhoto,

        governmentBack:
          user.governmentIdBackPhoto,
      };

      let photo: any =
        side &&
        photoMap[side]
          ? photoMap[side]
          : null;

      // -------------------------------------------------
      // BACKWARD COMPATIBILITY
      // -------------------------------------------------

      if (!photo) {

        photo =
          user.tupIdFrontPhoto ||
          user.governmentIdFrontPhoto ||
          user.verificationPhoto;
      }

      if (
        !photo ||
        !photo.data
      ) {

        return res.status(404).json({
          message:
            "Verification photo not found.",
        });
      }

      res.setHeader(
        "Content-Type",
        photo.contentType ||
          "image/jpeg"
      );

      res.setHeader(
        "Content-Length",
        String(
          photo.size ||
          photo.data.length
        )
      );

      return res.send(
        photo.data.buffer
      );

    } catch (error) {

      console.error(
        "ADMIN PHOTO ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to retrieve verification photo.",
      });
    }
  }
);

// =====================================================
// ADMIN - APPROVE USER
// =====================================================

app.patch(
  "/api/admin/users/:id/approve",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const result =
        await usersCollection()
          .findOneAndUpdate(
            {
              _id:
                new ObjectId(id),
            },
            {
              $set: {

                accountStatus:
                  "Approved",

                updatedAt:
                  new Date(),
              },
            },
            {
              returnDocument:
                "after",
            }
          );

      if (!result) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.json({

        message:
          "User approved successfully.",

        user:
          buildSafeUser(result),
      });

    } catch (error) {

      console.error(
        "ADMIN APPROVE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to approve user.",
      });
    }
  }
);

// =====================================================
// ADMIN - REJECT USER
// =====================================================

app.patch(
  "/api/admin/users/:id/reject",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const result =
        await usersCollection()
          .findOneAndUpdate(
            {
              _id:
                new ObjectId(id),
            },
            {
              $set: {

                accountStatus:
                  "Rejected",

                updatedAt:
                  new Date(),
              },
            },
            {
              returnDocument:
                "after",
            }
          );

      if (!result) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.json({

        message:
          "User rejected successfully.",

        user:
          buildSafeUser(result),
      });

    } catch (error) {

      console.error(
        "ADMIN REJECT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to reject user.",
      });
    }
  }
);

// =====================================================
// ADMIN - SET PENDING
// =====================================================

app.patch(
  "/api/admin/users/:id/pending",
  async (
    req: Request,
    res: Response
  ) => {

    try {

const id =
  String(req.params.id);

      if (
        !ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const result =
        await usersCollection()
          .findOneAndUpdate(
            {
              _id:
                new ObjectId(id),
            },
            {
              $set: {

                accountStatus:
                  "Pending",

                updatedAt:
                  new Date(),
              },
            },
            {
              returnDocument:
                "after",
            }
          );

      if (!result) {

        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.json({

        message:
          "User status changed to pending.",

        user:
          buildSafeUser(result),
      });

    } catch (error) {

      console.error(
        "ADMIN PENDING UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to change user status.",
      });
    }
  }
);

// =====================================================
// 404
// =====================================================

app.use(
  (
    req: Request,
    res: Response
  ) => {

    res.status(404).json({
      message:
        "Route not found.",
      path:
        req.originalUrl,
    });
  }
);

// =====================================================
// MULTER / GENERAL ERROR HANDLER
// =====================================================

app.use(
  (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    console.error(
      "SERVER ERROR:",
      error
    );

    if (
      error instanceof multer.MulterError
    ) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({
          message:
            "Image file is too large. Maximum size is 5MB per image.",
        });
      }

      return res.status(400).json({
        message:
          error.message,
      });
    }

    if (
      error &&
      error.message ===
        "Only image files are allowed."
    ) {

      return res.status(400).json({
        message:
          "Only image files are allowed.",
      });
    }

    return res.status(500).json({
      message:
        error?.message ||
        "Internal server error.",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

async function startServer() {

  try {

    // -------------------------------------------------
    // CONNECT MONGODB
    // -------------------------------------------------

    await client.connect();

    console.log(
      "================================="
    );

    console.log(
      "MongoDB connected successfully!"
    );

    console.log(
      "Database:",
      DB_NAME
    );

    console.log(
      "================================="
    );

    // -------------------------------------------------
    // UNIQUE USERNAME INDEX
    // -------------------------------------------------

    try {

      await usersCollection()
        .createIndex(
          {
            username: 1,
          },
          {
            unique: true,
          }
        );

      console.log(
        "Unique username index ready."
      );

    } catch (error) {

      console.error(
        "Username index error:",
        error
      );
    }

    // -------------------------------------------------
    // UNIQUE CONTACT INDEX
    // -------------------------------------------------

    try {

await usersCollection().createIndex(
  { contactNumber: 1 },
  {
    unique: true,
    sparse: true,
  }
);

      console.log(
        "Unique contact index ready."
      );

    } catch (error) {

      console.error(
        "Contact index error:",
        error
      );
    }

    // -------------------------------------------------
    // START EXPRESS
    // -------------------------------------------------

    app.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          "================================="
        );

        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `Local: http://localhost:${PORT}`
        );

        console.log(
          `API: http://localhost:${PORT}/api`
        );

        console.log(
          "================================="
        );
      }
    );

  } catch (error) {

    console.error(
      "Server Error:",
      error
    );

    process.exit(1);
  }
}

// =====================================================
// START
// =====================================================

startServer();