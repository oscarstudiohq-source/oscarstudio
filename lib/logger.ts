// lib/log.ts

const isProd = process.env.NODE_ENV === "production";

export const log = {
    info: (...args: any[]) => {
        if (!isProd) {
            console.log("[INFO]", ...args);
        }
    },
    warn: (...args: any[]) => {
        if (!isProd) {
            console.warn("[WARN]", ...args);
        }
    },
    error: (...args: any[]) => {
        if (!isProd) {
            console.error("[ERROR]", ...args);
        }
    },
};
