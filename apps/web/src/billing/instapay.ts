import { webEnv } from "@/env/web";

export interface InstaPayInstructions {
	phone: string;
	accountName: string;
	amount: number;
	currency: string;
	note: string;
}

/**
 * Returns the payment instructions to display to the user.
 * InstaPay has no merchant API — the user manually transfers money
 * via their bank app and submits the transfer reference to confirm.
 */
export function getInstaPayInstructions(): InstaPayInstructions {
	return {
		phone: webEnv.NEXT_PUBLIC_INSTAPAY_PHONE,
		accountName: webEnv.NEXT_PUBLIC_INSTAPAY_ACCOUNT_NAME,
		amount: webEnv.NEXT_PUBLIC_INSTAPAY_AMOUNT,
		currency: "EGP",
		note: "Dreamy Pro - Monthly",
	};
}
