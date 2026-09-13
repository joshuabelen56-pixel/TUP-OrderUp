import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// =====================================================
// ENV
// =====================================================

const CAPTCHA_PORT = Number(process.env.CAPTCHA_PORT) || 5001;

const CAPTCHA_JWT_SECRET =
  process.env.CAPTCHA_JWT_SECRET || "CHANGE_THIS_CAPTCHA_JWT_SECRET";

const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY || "";
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";

if (!TURNSTILE_SITE_KEY || !TURNSTILE_SECRET_KEY) {
  console.error(
    "WARNING: TURNSTILE_SITE_KEY or TURNSTILE_SECRET_KEY is missing from .env"
  );
}

// =====================================================
// APP
// =====================================================

const captchaApp = express();

captchaApp.use(
  cors({
    origin: true,
    credentials: false,
  })
);

captchaApp.use(express.json());

// =====================================================
// VERIFY TURNSTILE TOKEN WITH CLOUDFLARE
// =====================================================

async function verifyTurnstile(token: string, ip?: string) {
  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      success: false,
    };
  }
}

// =====================================================
// HEALTH CHECK
// =====================================================

captchaApp.get("/", (req: Request, res: Response) => {
  res.json({
    message: "TUP-OrderUp Captcha Server is running.",
    status: "OK",
  });
});

// =====================================================
// SERVE THE CAPTCHA PAGE
// =====================================================

captchaApp.get("/captcha", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ffffff;
          }
        </style>
      </head>
      <body>
        <div
          class="cf-turnstile"
          data-sitekey="${TURNSTILE_SITE_KEY}"
          data-callback="onTurnstileSuccess"
          data-error-callback="onTurnstileError"
        ></div>

        <script>
          async function onTurnstileSuccess(token) {
            try {
              const res = await fetch("/api/captcha/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              });

              const data = await res.json();

              if (data.verified && data.captchaVerificationToken) {
                window.ReactNativeWebView?.postMessage(
                  JSON.stringify({
                    success: true,
                    captchaVerificationToken: data.captchaVerificationToken,
                  })
                );
              } else {
                window.ReactNativeWebView?.postMessage(
                  JSON.stringify({ success: false, message: data.message || "Verification failed." })
                );
              }
            } catch (err) {
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({ success: false, message: "Network error during verification." })
              );
            }
          }

          function onTurnstileError() {
            window.ReactNativeWebView?.postMessage(
              JSON.stringify({ success: false, message: "CAPTCHA widget error." })
            );
          }
        </script>
      </body>
    </html>
  `);
});

// =====================================================
// VERIFY TOKEN + ISSUE SHORT-LIVED JWT
// =====================================================

captchaApp.post(
  "/api/captcha/verify",
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          verified: false,
          message: "Missing CAPTCHA token.",
        });
      }

      const ip =
        (req.headers["x-forwarded-for"] as string) || req.ip;

      const result = await verifyTurnstile(token, ip);

      if (!result.success) {
        console.log("CAPTCHA FAILED:", result);

        return res.status(403).json({
          verified: false,
          message: "CAPTCHA verification failed.",
        });
      }

      const captchaVerificationToken = jwt.sign(
        { purpose: "captcha_verified" },
        CAPTCHA_JWT_SECRET,
        { expiresIn: "10m" }
      );

      console.log("✅ CAPTCHA VERIFIED SUCCESSFULLY");

      return res.json({
        verified: true,
        captchaVerificationToken,
      });
    } catch (error) {
      console.error("CAPTCHA VERIFY ERROR:", error);

      return res.status(500).json({
        verified: false,
        message: "CAPTCHA verification failed due to a server error.",
      });
    }
  }
);

// =====================================================
// 404
// =====================================================

captchaApp.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found.",
    path: req.originalUrl,
  });
});

// =====================================================
// START SERVER
// =====================================================

captchaApp.listen(CAPTCHA_PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log(`Captcha server running on port ${CAPTCHA_PORT}`);
  console.log(`Local:   http://localhost:${CAPTCHA_PORT}/captcha`);
  console.log(`Network: http://192.168.18.24:${CAPTCHA_PORT}/captcha`);
  console.log("=================================");
});
