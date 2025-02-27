import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/users.actions";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Update product",
};

export default async function UpdateProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
}
