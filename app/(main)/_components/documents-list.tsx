"use client";

import { Document } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {Item} from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { useDocuments} from "@/hooks/use-documents";

interface DocumentsListProps {
  parentDocument?: string | null;
  level?: number;
  data?: Document[];
}

const DocumentsList = ({
  parentDocument = null,
  level = 0,
  data,
}: DocumentsListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const {  getDocuments } = useDocuments();
  
  useEffect(() => {
    const loadDocuments = async () => {
      const documents = await getDocuments() as Document[];
      setDocuments(documents);
      setLoading(false);
    };
    loadDocuments();
  }, []);

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const filteredDocuments = documents.filter(
    (doc) => doc.parentDocument === parentDocument && !doc.isArchived
  );

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (loading) {
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

  if (filteredDocuments.length === 0) {
    return (
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
        No documents
      </p>
    );
  }

  return (
    <>
      {filteredDocuments.map((document) => (
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
            documentIcon={document.icon || undefined}
          />
          {expanded[document.id] && (
            <DocumentsList parentDocument={document.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentsList;
