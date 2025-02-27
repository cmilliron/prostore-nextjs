import { Metadata } from "next";
import { getAllUsers, deleteUserById } from "@/lib/actions/users.actions";
import { getCurrentSession } from "@/lib/actions/auth-actions";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatId } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default async function AdminUserPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const searchParams = await props.searchParams;

  const { page = 1 } = searchParams;

  const users = await getAllUsers({ page: Number(page) });

  console.log(users);

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Users</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUserById} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages && users.totalPages > 1 && (
          <Pagination page={page} totalPages={users.totalPages} />
        )}
      </div>
    </div>
  );
}
