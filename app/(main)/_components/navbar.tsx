"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";
import { useDocumentQuery } from "@/app/(main)/useDocumentQuery";

interface NavBarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const NavBar = ({ isCollapsed, onResetWidth }: NavBarProps) => {
  const params = useParams();
  const { data: document, isLoading } = useDocumentQuery(
    params.documentId as string
  );

  if (isLoading) {
    return (
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1F1F1F] justify-between">
        <Title.skeleton />
        <div className=" flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }
  if (document === null) {
    return null;
  }
  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1F1F1F]">
        {isCollapsed && (
          <MenuIcon
            onClick={onResetWidth}
            role="button"
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document!} />
          <div className=" flex items-center gap-x-2">
            <Publish initialData={document!} />
            <Menu documentId={document!.id} />
          </div>
        </div>
      </nav>
      {document!.isArchived && <Banner documentId={document!.id} />}
    </>
  );
};

export default NavBar;
