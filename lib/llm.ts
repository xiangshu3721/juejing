const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const DEEPSEEK_MODEL = "deepseek-chat";

export function getLlmConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
  const baseUrl = (
    process.env.DEEPSEEK_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    DEEPSEEK_BASE
  ).replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || DEEPSEEK_MODEL;

  return { apiKey, baseUrl, model };
}
