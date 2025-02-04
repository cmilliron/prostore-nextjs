"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
];

export default function MainAdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <AdminNavLink
          key={item.href}
          pathname={pathname}
          link={item.href}
          title={item.title}
        />
      ))}
    </nav>
  );
}

function AdminNavLink({
  pathname,
  link,
  title,
}: {
  pathname: string;
  link: string;
  title: string;
}) {
  return (
    <Link
      href={link}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname.includes(link) ? "" : "text-muted-foreground"
      )}
    >
      {title}
    </Link>
  );
}
