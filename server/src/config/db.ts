import mongoose from "mongoose";

export default async function connectToDB(): Promise<void> {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/inkin");
    console.log(`[DATABASE CONNECTED] - Mongo db connected`);
  } catch (error: any) {
    console.log(`[DATABASE ERROR] - ${error.message}`);
  }
}
