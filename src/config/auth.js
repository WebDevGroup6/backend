import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "default-secret-key", // Use a strong secret in production
  expiresIn: "1h", // Token expiration time
};

if (
  process.env.JWT_SECRET === "default-secret-key" ||
  !process.env.JWT_SECRET
) {
  console.warn(
    "Warning: JWT_SECRET is not set or using default. Set a strong secret in your .env file for production."
  );
}
