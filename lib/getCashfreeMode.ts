export function getCashfreeMode(): "sandbox" | "production" {
    const envMode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
    return envMode === "production" ? "production" : "sandbox";
}
