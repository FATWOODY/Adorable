import { FreestyleSandboxes } from "freestyle-sandboxes";

if (!process.env.FREESTYLE_API_KEY) {
  console.warn("FREESTYLE_API_KEY is not set. Preview functionality may not work.");
}

export const freestyle = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});
