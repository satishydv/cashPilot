import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  return process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || "default_dev_secret_key_change_in_production";
};

export const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
