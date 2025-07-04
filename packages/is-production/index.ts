import { env } from "bun";

if (Bun.main.endsWith(".exe")) env.NODE_ENV = "production";

export const isProduction = env.NODE_ENV === "production";
