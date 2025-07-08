export function loadCashfreeSdk() {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") return reject("Not in browser");

        if (window.Cashfree && typeof window.Cashfree === "function") {
            return resolve(window.Cashfree); // already loaded
        }

        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => {
            if (window.Cashfree && typeof window.Cashfree === "function") {
                resolve(window.Cashfree);
            } else {
                reject("Cashfree SDK loaded but not available");
            }
        };
        script.onerror = () => reject("Failed to load Cashfree SDK");
        document.body.appendChild(script);
    });
}
  