import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import validator from "validator";
import nodemailer from "nodemailer";
import { generate_token } from "../utils";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const TEMP_LIST_PATH = path.join(__dirname, "..", "..", "temp_u.json");

interface ITempU {
  uid: string;
  email: string;
  password: string;
  code: string;
}

function readFile(path: fs.PathOrFileDescriptor): Promise<string> {
  return new Promise(function (resolve, reject) {
    fs.readFile(
      path,
      {
        encoding: "utf-8",
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

function writeFile(
  path: fs.PathOrFileDescriptor,
  data: string | NodeJS.ArrayBufferView
): Promise<void> {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, data, "utf-8", function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const body: { email: string; password: string } = req.body;

    body.email = body.email.trim();

    // Check if all fields are satisfied and valid
    if (!body.email || body.email.length === 0) {
      res.status(400);
      throw new Error("Please enter your email address");
    }
    if (!body.password || body.password.length === 0) {
      res.status(400);
      throw new Error("Please create a password");
    }
    if (body.password.length < 6) {
      res.status(400);
      throw new Error("Minimum password's length is 6");
    }

    // // Check if phone number is valid: https://api.apilayer.com/number_verification/validate?number=number
    // // const response = await axios.get(
    // //   `https://api.apilayer.com/number_verification/validate?number=${body.phone_number.trim()}`,
    // //   {
    // //     headers: {
    // //       apikey: process.env.NUMVERIFY_API_KEY,
    // //     },
    // //   }
    // // );
    // // if (!response.data.valid) {
    // //   res.status(400);
    // //   throw new Error("Please enter a valid phone number");
    // // }

    // Check if email address is valid

    // TODO: filter disposable email addresses
    const valid = validator.isEmail(body.email.trim());

    if (!valid) {
      res.status(400);
      throw new Error("Please enter a valid email address");
    }

    // Check if email address is already registered
    const alreadyRegistered = await User.findOne({
      email: body.email,
    });
    if (alreadyRegistered) {
      res.status(400);
      throw new Error("Email address is already registered");
    }

    // All fields are fullfilled, email is valid and unique, carry on

    // Generate unique 6 digit-code
    const code = Math.floor(100000 + Math.random() * 900000);
    const hashed_code = await bcrypt.hash(code.toString(), 10);

    // Send verification email to user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const details = {
      from: process.env.NODEMAILER_USER,
      to: body.email,
      subject: "Verify your inKin account",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container{
            padding: 20px;
            height: 100%;
            width: 100%;
            background-color: #121212;
            font-family: Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            gap: 50px;
            user-select: none;
          }
          .upper> div > img {
            margin: 0 auto;
            margin-bottom: 20px;
          }
          .upper{
            margin: 0 auto;
            color: #565656;
          }
          .upper > * {
            margin: 0 auto;
            text-align: center;
          }
          .lower {
            height: 60px;
            background: linear-gradient(0deg, #A0A0A0, #eeeeee) !important;
            margin: 10px auto;
            display: flex;
            border-radius: 5px;
            width: max-content;
            padding: 5px;
          }
          .lower > p {
            margin: auto;
            text-align: center;
            font-size: 30px;
            letter-spacing: 10px;
            text-indent: 10px;
            padding: 5px;
            padding-left: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="upper">
          <div style="width: 100%; display: flex;">
            <img width="100" src="https://imgs.search.brave.com/_VpUj9pAe8L0viFnCqIV0b2GdGkw4dfe0RUID71-bBU/rs:fit:512:512:1/g:ce/aHR0cHM6Ly9jZG4z/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZW1haWwtMTEx/LzQ4LzEzLTUxMi5w/bmc"><br/>
            </div>
            <p style="color: #ddd !important;">Welcome ${body.email}!<br/>
            <span style="color: #565656 !important;">Kindly write the code below when prompted</span><br/>
            </p>
          </div>
          <div class="lower">
          <br/><br/>
            <p style="color: #121212 !important; text-align: center;">${code}</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    transporter.sendMail(details, (err: any) => {
      if (err) {
        res.status(400);
        throw new Error(err.message);
      }
    });

    console.log("[MAIL SENT] from inkin.verify@gmail.com to " + body.email);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(body.password, salt);

    // Generate uid
    const uid = randomBytes(64).toString("hex");

    const temp_u: ITempU = {
      uid,
      email: body.email,
      password: hashed_password,
      code: hashed_code,
    };

    const response = await readFile(TEMP_LIST_PATH);
    let temp_ulist: ITempU[] = [...JSON.parse(response), temp_u];

    await writeFile(TEMP_LIST_PATH, JSON.stringify(temp_ulist));

    res.status(200).json({
      uid: temp_u.uid,
      email: temp_u.email,
    });
  }
);

export const verifyEmailAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const uid: string = req.params.uid;
    const { code }: { code: string } = req.body;

    const response = await readFile(TEMP_LIST_PATH);

    let temp_ulist: ITempU[] = JSON.parse(response);

    let temp_u: ITempU | null = null;

    // find current user in temp_ulist
    for (let i = 0; i < temp_ulist.length; i++) {
      if (temp_ulist[i].uid === uid) {
        temp_u = temp_ulist[i];
        break;
      }
    }

    // user not found
    if (!temp_u) {
      res.status(400);
      throw new Error("User not found");
    }

    const correct = await bcrypt.compare(code, temp_u.code);

    if (!correct) {
      res.status(400);
      throw new Error("Incorrect code");
    }

    // Save user to database
    const user = await User.create({
      email: temp_u.email,
      password: temp_u.password,
    });
    // Check for unexpected errors
    if (!user) {
      res.status(500);
      throw new Error("Unexpected Error: failed to save");
    }
    let new_temp_list = temp_ulist.filter((user) => user.uid !== uid);

    await writeFile(TEMP_LIST_PATH, JSON.stringify(new_temp_list));

    const jwt = generate_token({ id: user._id.toString() });

    res.status(200).json({
      id: user._id,
      points: user.points,
      token: jwt,
    });
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const body: { email: string; password: string } = req.body;

  body.email = body.email.trim();

  // Check for all the fields
  if (!body.email || body.email.length === 0) {
    res.status(400);
    throw new Error("Please enter your email address");
  }
  if (!body.password || body.password.length === 0) {
    res.status(400);
    throw new Error("Please enter your password");
  }
  // Fields are fullfilled.

  // Find user in database
  const user = await User.findOne({ email: body.email });

  if (!user) {
    // Check if user account is not verified

    const response = await readFile(TEMP_LIST_PATH);

    const data = JSON.parse(response);

    for (let i = 0; i < data.length; i++) {
      if (data[i].email === body.email) {
        res.status(400);
        throw new Error("Your account is not verified");
      }
    }

    res.status(400);
    throw new Error("Incorrect email");
  }

  // User has been found

  // Check for password

  const correctPassword = await bcrypt.compare(body.password, user!.password);

  if (!correctPassword) {
    res.status(400);
    throw new Error("Incorrect password");
  }
  // Creds are correct

  // Generate jwt
  const token = generate_token({ id: user._id.toString() });

  // Send user to frontend

  res.status(200).json({
    id: user._id,
    points: user!.points,
    token: token,
  });
});
