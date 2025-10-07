import { CustomError } from "./CustomError.js";

export function ensureExists(value, message = "Not found", statusCode = 400) {
  if (!value) throw new CustomError(message, statusCode);
  return value; // return value so you can inline it
}
