"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Item from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { Document } from "@prisma/client";
import { useSidebarDocuments } from "../useQuery";
interface DocumentsListProps {
  parentDocuments?: string;
  level?: number;
  data?: Document[];
}
const DocumentsList = ({
  parentDocuments,
  level = 0,
  data,
}: DocumentsListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };
  const { data: documents, isLoading } = useSidebarDocuments(parentDocuments);
  useEffect(() => {
    console.log(documents, "documents");
  }, [documents]);
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        没有文档
      </p>
      {documents?.map((document) => (
        <div key={document.id}>
          <Item
            id={document.id}
            onClick={() => onRedirect(document.id)}
            label={document.title}
            icon={FileIcon}
            active={params.documentId === document.id}
            level={level}
            onExpand={() => onExpand(document.id)}
            expanded={expanded[document.id]}
            documentIcon={document.icon}
          />
          {expanded[document.id] && (
            <DocumentsList parentDocuments={document.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentsList;
