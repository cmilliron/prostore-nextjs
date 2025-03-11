import { auth } from "@/auth";

export async function getCurrentSession() {
  return await auth();
}
