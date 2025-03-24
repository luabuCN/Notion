"use client";

import IconPicker from "@/components/icon-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { ImageIcon, Smile, X } from "lucide-react";
import { useRef, useState, type ElementRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Document } from "@prisma/client";
import { useUpdateDoc } from "../useDocumentQuery";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
interface ToolbarProps {
  initialData: Document;
  preview?: boolean;
}
const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData?.title);
  const { mutate: update } = useUpdateDoc();
  // const coverImage = useCoverImage();
  
  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setIsEditing(true);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData.id,
      title: value || "未命名",
    });

    update({
      id: initialData.id,
      title: value || "未命名",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update(
      {
        id: initialData.id,
        icon,
      },
      {
        onSuccess: async () => {
          toast.success("图标已更新");
        },
        onError: () => {
          toast.error("图标更新失败");
        },
      }
    );
  };

  const onRemoveIcon = () => {
    // removeIcon({
    //   id: initialData._id,
    // });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData?.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className=" text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className=" rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-sm "
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData?.icon && preview && (
        <p className=" text-6xl pt-6">{initialData?.icon}</p>
      )}
      <div className=" opacity-100 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData?.icon && !preview && (
          <IconPicker onChange={onIconSelect}>
            <Button
              className=" text-muted-foreground text-xs "
              variant="outline"
              size="sm"
            >
              <Smile className=" h-4 w-4 mr-2" />
              添加图标
            </Button>
          </IconPicker>
        )}

        {!initialData?.coverImage && !preview && (
          // <Button
          //   onClick={coverImage.onOpen}
          //   className=" text-muted-foreground text-xs"
          //   variant="outline"
          //   size="sm"
          // >
          //   <ImageIcon className=" h-4 w-4 mr-2" />
          //   添加封面
          // </Button>
          <UploadButton
          className="ut-button:bg-white ut-button:text-muted-foreground"
            appearance={{
              button:cn(buttonVariants({ variant:'outline',size:'sm' }))
            }}
            content={{
              button({ ready }) {
                  return (
                    <>
                      <ImageIcon className=" h-4 w-4 mr-2" />
                      添加封面
                    </>
                  );
              },
              allowedContent(){
                return false
              }
            }}
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log(res, "res------------");
              update({
                id: initialData.id,
                coverImage: res[0].ufsUrl,
              });
            }}
          />
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={disableInput}
          className=" text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]  resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData?.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
