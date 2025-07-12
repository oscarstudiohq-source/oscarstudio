// lib/phonepeClient.js
import { StandardCheckoutClient, Env } from "pg-sdk-node";

const clientId = process.env.PHONEPE_CLIENT_ID;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
const clientVersion = Number(process.env.PHONEPE_CLIENT_VERSION);
const env = Env.SANDBOX; // Use Env.PRODUCTION when live

export const phonepeClient = StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env
);
