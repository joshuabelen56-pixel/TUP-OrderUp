import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
});

async function test() {
  try {
    console.log("Connecting to MongoDB Atlas...");

    await client.connect();

    console.log("MongoDB CONNECTED!");

    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB PING SUCCESS!");
  } catch (error) {
    console.error("MongoDB CONNECTION FAILED:");
    console.error(error);
  } finally {
    await client.close();
  }
}

test();