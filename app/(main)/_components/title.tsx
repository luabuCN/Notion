"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { Document } from "@prisma/client";
import { useUpdateDoc } from "@/app/(main)/useDocumentQuery";
interface TitleProps {
  initialData: Document;
}

const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: update } = useUpdateDoc();

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    update({
      id: initialData.id,
      title: e.target.value || "未命名",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };
  return (
    <div className=" flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className=" h-7 px-2 focus-visible:ring-transparent"
          ref={inputRef}
          value={title}
          onClick={enableInput}
          onChange={onChange}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="lg"
          className=" font-normal h-auto p-1"
        >
          <span className=" truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-md" />;
};

export default Title;
