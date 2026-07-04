import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: ".env.production" });
} else {
	dotenv.config({ path: ".env.local" });
}

const databaseUrl = process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy";

export default {
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	migrations: {
		table: "drizzle_migrations",
	},
	dbCredentials: {
		url: databaseUrl,
	},
	out: "./migrations",
	strict: false,
} satisfies Config;
