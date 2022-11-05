import mongoose from "mongoose";

export default async function connectToDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI as string);
    console.log(`[DATABASE CONNECTED] - Mongo db connected`);
  } catch (error: any) {
    console.log(`[DATABASE ERROR] - ${error.message}`);
  }
}
