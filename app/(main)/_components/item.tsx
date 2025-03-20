"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateDocument, useArchive } from "../useDocumentQuery";
import { useQueryClient } from "@tanstack/react-query";

interface ItemProps {
  id?: string;
  documentIcon?: string | null;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}
const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  expanded,
  onExpand,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const { mutate } = useCreateDocument();
  const queryClient = useQueryClient();
  const { mutate: mutateArchive } = useArchive();
  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return;
    mutateArchive(id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["sidebarDocuments"],
        });
        toast.success("笔记已移至回收站！");
        router.push("/documents");
      },
      onError: () => {
        toast.error("移动到回收站失败");
      },
    });
  };
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    mutate(
      {
        title: "未命名",
        parentDocumentId: id,
      },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries({
            queryKey: ["sidebarDocuments"],
          });
          if (!expanded) {
            onExpand?.();
          }
          router.push(`/documents/${res.id}`);
          toast.success("新笔记已创建！");
        },
        onError: () => {
          toast.error("创建新笔记失败");
        },
      }
    );
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && " bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className=" h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 rounded-sm hover:bg-neutral-300" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 h-[18px] mr-2 ">{documentIcon}</div>
      ) : (
        <Icon className=" shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}

      <span className=" truncate">{label}</span>
      {isSearch && (
        <kbd className=" ml-auto pointer-events-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className=" text-sx">⌘</span>
          <p className="text-[14px]">k</p>
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className=" opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className=" w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                删除
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className=" text-xs text-muted-foreground p-2">
                最后编辑者 {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className=" opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
