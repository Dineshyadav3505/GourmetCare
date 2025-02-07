import jwt from "jsonwebtoken";

export const getAccessToken = (email: string): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");
  return jwt.sign({ email }, secret, { expiresIn: "30d" });
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");
  return jwt.verify(token, secret) as jwt.JwtPayload;
};
