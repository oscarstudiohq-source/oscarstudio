import { log } from "../lib/logger";

export function loadCashfreeSdk() {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") return reject("Not in browser");

        if (window.Cashfree && typeof window.Cashfree === "function") {
            log.info('loadCashfreeSdk1');
            return resolve(window.Cashfree); // already loaded
        }

        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        log.info('loadCashfreeSdk1.1');
        script.onload = () => {
            if (window.Cashfree && typeof window.Cashfree === "function") {
                log.info('loadCashfreeSdk2');
                resolve(window.Cashfree);
            } else {
                log.info('loadCashfreeSdk3');
                reject("Cashfree SDK loaded but not available");
            }
        };
        script.onerror = () => reject("Failed to load Cashfree SDK");
        document.body.appendChild(script);
        log.info('loadCashfreeSdk4');
    });
}
  