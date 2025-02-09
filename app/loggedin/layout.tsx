import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if(!session) { redirect('/'); return null; }
  return <SessionProvider session={session}>
  {children}
</SessionProvider>
}
