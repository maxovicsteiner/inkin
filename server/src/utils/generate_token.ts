import jwt from "jsonwebtoken";

export function generate_token(payload: string | object | Buffer): string {
  return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret);
}
