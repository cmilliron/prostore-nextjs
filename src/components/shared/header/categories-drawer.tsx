import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { getAllCategories } from "@/lib/actions/products-actions";
import Link from "next/link";

export default async function CategoriesDrawer() {
  const categories = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1">
            {categories.map((x) => (
              <Button
                className="w-full justify-start"
                variant="ghost"
                key={x.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${x.category}`}>
                    {x.category} ({x._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
