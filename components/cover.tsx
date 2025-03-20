"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  url?: string | null | undefined;
  preview?: boolean;
}

const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const params = useParams();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (url) await edgestore.publicFiles.delete({ url });
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
  };
  return (
    <div className={cn("relative w-full h-[35vh] group", !url && "h-[12vh]", url && "bg-muted")}>
      {!!url && <Image src={url} fill alt="封面" className="object-cover w-full h-full" />}
      {url && !preview && (
        <div className=" opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            variant="outline"
            size="sm"
            className=" text-muted-foreground text-xs"
          >
            <ImageIcon className=" h-4 w-4 mr-2" /> 更改封面
          </Button>
          <Button onClick={onRemove} variant="outline" size="sm" className=" text-muted-foreground text-xs">
            <X className=" h-4 w-4 mr-2" /> 移除
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
export default Cover;
