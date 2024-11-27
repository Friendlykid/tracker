import { config } from "dotenv";
import path from "path";

if (process.env.NODE_ENV === "development") {
  config({ path: path.resolve(process.cwd(), ".env.local") });
}
