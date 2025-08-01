"use server";

import { freestyle } from "@/lib/freestyle";

export async function requestDevServer({ repoId }: { repoId: string }) {
  console.log("Requesting dev server for repo:", repoId);
  
  try {
    const result = await freestyle.requestDevServer({
      repoId: repoId,
    });
    
    console.log("Dev server response:", result);
    
    const {
      ephemeralUrl,
      devCommandRunning,
      installCommandRunning,
      codeServerUrl,
    } = result;

    return {
      ephemeralUrl,
      devCommandRunning: devCommandRunning ?? true,
      installCommandRunning: installCommandRunning ?? false,
      codeServerUrl,
    };
  } catch (error) {
    console.error("Failed to request dev server:", error);
    throw error;
  }
}
