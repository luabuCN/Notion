"use client";

import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";

interface NavBarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const NavBar = ({ isCollapsed, onResetWidth }: NavBarProps) => {
  const params = useParams();
  const [document, setDocument] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`/api/documents/${params.documentId}`);
        setDocument(response.data);
      } catch (error) {
        console.error('Failed to fetch document', error);
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [params.documentId]);

  if (loading) {
    return (
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1F1F1F] justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
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
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Menu documentId={document.id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document.id} />}
    </>
  );
};

export default NavBar;
