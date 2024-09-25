import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const dbUri = process.env.DATABASE_URI as string;
const saltRounds = Number(process.env.HASH_SALT) as number;
const defaultPassword = process.env.DEFAULT_PASS as string;
const node_env = process.env.NODE_ENV as string;
const jwt_access_secret = process.env.JWT_ACCESS_SECRET as string;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET as string;
const jwt_access_expiresIn = process.env.JWT_ACCESS_EXPIRES_IN as string;
const jwt_refresh_expiresIn = process.env.JWT_REFRESH_EXPIRES_IN as string;
const CLIENT_URL = process.env.CLIENT_URL as string;
const SERVER_URL = process.env.SERVER_URL as string;
const STRIPE_SECRET = process.env.STRIPE_SECRET as string;
const AMARPAY_URL = process.env.AMARPAY_URL as string;
const AMARPAY_STORE_ID = process.env.AMARPAY_STORE_ID as string;
const AMARPAY_SIGNATURE_KEY = process.env.AMARPAY_SIGNATURE_KEY as string;
const AMARPAY_PAYMENT_VERIFY_URL = process.env.AMARPAY_PAYMENT_VERIFY_URL as string;



export default {
  STRIPE_SECRET,
  CLIENT_URL,
  SERVER_URL,
  dbUri,
  port,
  saltRounds,
  defaultPassword,
  node_env,
  jwt_access_secret,
  jwt_refresh_secret,
  jwt_access_expiresIn,
  jwt_refresh_expiresIn,
  AMARPAY_URL,
  AMARPAY_STORE_ID,
  AMARPAY_SIGNATURE_KEY,
  AMARPAY_PAYMENT_VERIFY_URL,
};
