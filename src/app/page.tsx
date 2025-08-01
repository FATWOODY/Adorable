import { getUserApps } from "@/actions/user-apps";
import { HomeClient } from "@/components/home-client";

export default async function Home() {
  const initialUserApps = await getUserApps();
  
  return <HomeClient initialUserApps={initialUserApps} />;
}
