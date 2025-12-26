import jwt from "jsonwebtoken";

export function signJwt(payload: any) {
  const secret = process.env.JWT_SECRET as string;

  return jwt.sign(payload, secret, {
    expiresIn: "30d"
  });
}

