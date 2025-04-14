"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useRemoveCoverImage } from "@/app/(main)/useDocumentQuery";
import { useEffect, useState } from "react";
interface CoverProps {
  url?: string | null | undefined;
  preview?: boolean;
}

const Cover = ({ url, preview }: CoverProps) => {
  console.log(url, "url---------");

  const coverImage = useCoverImage();
  const { mutate: removeCoverImage } = useRemoveCoverImage();
  const params = useParams();

  // 使用 useState 来管理图片 URL
  const [imageUrl, setImageUrl] = useState(url);

  // 监听 URL 的变化
  useEffect(() => {
    setImageUrl(url);
  }, [url]);

  const onRemove = async () => {
    removeCoverImage(params.documentId as string);
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !imageUrl && "h-[12vh]",
        imageUrl && "bg-muted"
      )}
    >
      {!!imageUrl && (
        <Image
          src={imageUrl}
          fill
          unoptimized
          alt="封面"
          className="object-cover w-full h-full"
        />
      )}
      {imageUrl && !preview && (
        <div className=" opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(imageUrl)}
            variant="outline"
            size="sm"
            className=" text-muted-foreground text-xs"
          >
            <ImageIcon className=" h-4 w-4 mr-2" /> 更改封面
          </Button>
          <Button
            onClick={onRemove}
            variant="outline"
            size="sm"
            className=" text-muted-foreground text-xs"
          >
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
