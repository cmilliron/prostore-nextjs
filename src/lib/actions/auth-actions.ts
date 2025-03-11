import { auth } from "@/auth";

export const config = {
  runtime: "nodejs",
};

export async function getCurrentSession() {
  return await auth();
}
