"use client";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useRemove, useRestore, useTrashDocuments } from "../useDocumentQuery";
import { useQueryClient } from "@tanstack/react-query";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const { mutate: mutateRestore } = useRestore();
  const { mutate: mutateRemove } = useRemove();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: documents, isLoading, refetch } = useTrashDocuments();
  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();
    mutateRestore(documentId, {
      onSuccess: async () => {
        toast.success("笔记已恢复！");
        await queryClient.invalidateQueries({
          queryKey: ["sidebarDocuments"],
        });
        refetch();
      },
      onError: () => {
        toast.error("恢复笔记失败。");
      },
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }

    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <Spinner size="lg" />
        </div>
      );
    }
  };

  const onRemove = (documentId: string) => {
    mutateRemove(documentId, {
      onSuccess: () => {
        toast.success("笔记已删除！");
        refetch();
      },
      onError: () => {
        toast.error("删除笔记失败。");
      },
    });
  };
  return (
    <div className="text-sm">
      <div className=" flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="按标题搜索"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className=" hidden last:block text-xs text-center text-muted-foreground">
          未找到笔记。
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className=" text-sm rounded-sm w-full py-1 hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className=" truncate pl-2">{document.title}</span>
            <div className=" flex items-center">
              <div
                onClick={(e) => onRestore(e, document.id)}
                role="button"
                className=" rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div className=" rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
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

export default TrashBox;
