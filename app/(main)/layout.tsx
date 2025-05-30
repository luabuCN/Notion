"use client";

import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import Navigation from "./_components/navigation";
import SearchCommand from "@/components/search-command";
import { useUser } from "@clerk/clerk-react";
import { useIsLogon } from "./useDocumentQuery";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useIsLogon();
  if (isLoading) {
    return (
      <div className=" h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!data) {
    return redirect("/");
  }
  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <Navigation />
      <main className=" flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
