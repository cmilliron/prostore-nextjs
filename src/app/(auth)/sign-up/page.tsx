import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/assets/logo.svg";
import { APP_NAME } from "@/lib/constants";
import { getCurrentSession } from "@/lib/actions/auth-actions";
import SignUpForm from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await searchParams;

  const session = await getCurrentSession();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              priority={true}
              src={logo}
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
