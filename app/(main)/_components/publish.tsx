" use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Document } from "@prisma/client";
import { useUpdateDoc } from "../useDocumentQuery";
interface PublishProps {
  initialData: Document;
}

const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const { mutate: update } = useUpdateDoc();
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = () => {
    setIsSubmitting(true);
    update(
      {
        id: initialData.id,
        isPublished: true,
      },
      {
        onSuccess: () => {
          toast.success("文档已发布");
          setIsSubmitting(false);
        },
        onError: () => {
          toast.error("发布文档失败");
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleUnpublish = () => {
    setIsSubmitting(true);
    update(
      {
        id: initialData.id,
        isPublished: false,
      },
      {
        onSuccess: () => {
          toast.success("笔记已取消发布！");
          setIsSubmitting(false);
        },
        onError: () => {
          toast.error("取消发布笔记失败");
          setIsSubmitting(false);
        },
      }
    );
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          发布
          {initialData.isPublished && (
            <Globe className=" text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData?.isPublished ? (
          <div className="space-y-4">
            <p className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 animate-pulse text-sky-500" />
              <span className="text-xs font-medium text-sky-500">
                该笔记已在网上发布
              </span>
            </p>
            <div className="flex items-center">
              <input
                className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs"
                value={url}
                type="text"
                disabled
              />
              <Button
                className="h-8 rounded-l-none"
                onClick={onCopy}
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              className="w-full text-xs"
              size="sm"
              onClick={handleUnpublish}
            >
              取消发布
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className=" text-sm font-medium mb-2">发布此笔记</p>
            <span className=" text-xs  text-muted-foreground mb-4">
              通过唯一链接分享您的笔记。
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              发布
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
