import { webEnv } from "@/env/web";

interface KashierOrderParams {
	orderId: string;
	amount: number;
	currency?: string;
	merchantRedirectUrl?: string;
}

export const createKashierOrder = async (params: KashierOrderParams) => {
	// Kashier API documentation integration goes here.
	// We will create a hash from the order information and use Kashier's payment URL.
	const { orderId, amount, currency = "EGP", merchantRedirectUrl = `${webEnv.NEXT_PUBLIC_SITE_URL}/account` } = params;
	const mid = webEnv.KASHIER_MERCHANT_ID;
	
	// Create signature
	const path = `/?payment=${mid}.${orderId}.${amount}.${currency}`;
	const hash = await createKashierSignature(path);

	// Instead of calling an API, Kashier Hosted Payment Page works via redirect or an iframe with a generated URL.
	// For simplicity, we just return the checkout URL.
	const kashierUrl = `https://checkout.kashier.io/?merchantId=${mid}&orderId=${orderId}&amount=${amount}&currency=${currency}&hash=${hash}&merchantRedirect=${encodeURIComponent(merchantRedirectUrl)}&mode=test`;

	return kashierUrl;
};

// Generates Kashier HMAC SHA256 Signature
const createKashierSignature = async (path: string) => {
	const secret = webEnv.KASHIER_API_KEY;
	const encoder = new TextEncoder();
	const keyData = encoder.encode(secret);
	const msgData = encoder.encode(path);

	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		keyData,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
};

export const verifyKashierWebhook = async (queryString: string, signature: string) => {
	const hash = await createKashierSignature(queryString);
	return hash === signature;
};
