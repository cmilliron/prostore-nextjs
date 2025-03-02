import React from "react";
import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoriesDrawer from "./categories-drawer";
import logo from "@/assets/logo.svg";
import Search from "./search";

export default function Header() {
  return (
    <>
      <header className="w-full border-b">
        <div className="wrapper flex-between">
          <div className="flex-start">
            <CategoriesDrawer />
            <Link href="/" className="flex-start ml-4">
              <Image
                priority={true}
                src={logo}
                width={48}
                height={48}
                alt={`${APP_NAME} logo`}
              />
              <span className="hidden lg-block font-bold text-wxl ml-3">
                {APP_NAME}
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <Search />
          </div>
          <Menu />
        </div>
      </header>
    </>
  );
}
