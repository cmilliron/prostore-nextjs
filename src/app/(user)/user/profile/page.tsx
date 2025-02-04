import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { getCurrentSession } from "@/lib/actions/auth-actions";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function ProfilePage() {
  const session = await getCurrentSession();

  return (
    <SessionProvider session={session}>
      <div className="maw-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
}
