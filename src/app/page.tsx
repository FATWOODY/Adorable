import { getUserApps } from "@/actions/user-apps";
import { HomeClient } from "@/components/home-client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialUserApps = await getUserApps();
  
  return <HomeClient initialUserApps={initialUserApps} />;
}
