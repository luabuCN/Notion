"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDocuments } from "@/hooks/use-documents";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
}

export const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {
  const { user } = useUser();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { documents, getDocuments } = useDocuments((store) => ({
    documents: store.documents,
    getDocuments: store.getDocuments
  }));

  useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  const documentsByParent = documents.filter((document) => 
    document.parentDocument === parentDocumentId
  );

  if (!user) return null;

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documentsByParent.map((document) => (
        <div key={document.id}>
          <Item
            id={document.id}
            onClick={() => {}}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={false}
            level={level}
            onExpand={() => onExpand(document.id)}
            expanded={expanded[document.id]}
          />
          {expanded[document.id] && (
            <DocumentList
              parentDocumentId={document.id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
