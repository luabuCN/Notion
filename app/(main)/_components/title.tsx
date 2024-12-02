"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface TitleProps {
  initialData: {
    id: string;
    title: string;
    icon?: string;
  };
}

const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

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

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value || "Untitled";
    setTitle(newTitle);
    
    try {
      await axios.patch(`/api/documents/${initialData.id}`, { 
        title: newTitle 
      });
    } catch (error) {
      toast.error("Failed to update document title");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent"
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
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-md" />;
};

export default Title;
