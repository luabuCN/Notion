"use client";

import { useScrollTop } from "@/hooks/user-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

const Navbar = () => {
  const scrolled = useScrollTop();
  const { isSignedIn} = useUser()
  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1f1f1f]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="flex items-center justify-between gap-x-2 w-full md:ml-auto md:justify-end ">
        {!isSignedIn && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                登录
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">免费获取 Jotion</Button>
            </SignInButton>
          </>
        )}
        {isSignedIn && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">进入 Jotion</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}

        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
