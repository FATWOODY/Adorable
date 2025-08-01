import { getUserApps } from "@/actions/user-apps";
import { HomeClient } from "@/components/home-client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let initialUserApps = [];
  
  try {
    initialUserApps = await getUserApps();
  } catch (error) {
    console.log("Failed to fetch user apps, user may not be authenticated:", error);
    // Return empty array for unauthenticated users
  }
  
  return <HomeClient initialUserApps={initialUserApps} />;
}
