"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash, Undo } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import ConfirmModal from "@/components/modals/confirm-modal";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  
  const { 
    documents, 
    remove, 
    restore, 
    isLoading 
  } = useDocuments((store) => ({
    documents: store.documents.filter(doc => doc.isArchived),
    remove: store.remove,
    restore: store.restore,
    isLoading: store.isLoading
  }));

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();
    const promise = restore(documentId);

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note."
    });

    router.push("/documents");
  };

  const onRemove = async (documentId: string) => {
    const promise = remove(documentId);

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note."
    });

    router.push("/documents");
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Search by title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        {filteredDocuments?.length === 0 && (
          <p className="text-xs text-center text-muted-foreground pb-2">
            No documents found.
          </p>
        )}
        {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">
              {document.title}
            </span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document.id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
