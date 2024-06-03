import dotenv from 'dotenv';
dotenv.config();

const config = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  PORT: process.env.PORT,
  SYSTEM_MAIL: process.env.SYSTEM_MAIL,
  SYSTEM_PASS: process.env.SYSTEM_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

export default config;
