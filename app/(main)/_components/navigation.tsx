"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ElementRef,
  useCallback,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";
import DocumentsList from "./documents-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trash-box";
import { uesSearch } from "@/hooks/user-search";
import { useSetting } from "@/hooks/use-setting";
import Navbar from "./navbar";
import { Button } from "@/components/ui/button";
const Navigation = () => {
  const settings = useSetting();
  const router = useRouter();
  const search = uesSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const create = useMutation(api.documents.create);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    if (newWidth < 150) newWidth = 150;
    if (newWidth > 480) newWidth = 480;
    console.log(newWidth, "1111");

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  }, [isMobile]);

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
    }).then((documentId) => router.push(`/documents/${documentId}`));

    toast.promise(promise, {
      loading: "正在创建新笔记...",
      success: "新笔记已创建！",
      error: "创建新笔记失败",
    });
  };

  useEffect(() => {
    isMobile ? collapse() : resetWidth();
  }, [isMobile, pathname, resetWidth]);
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          " group/sidebar h-full bg-secondary overflow-auto relative flex w-60 flex-col z-[999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="w-6 h-6" />
        </div>
        <div>
          <UserItem />
          <Item label="搜索" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="设置" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="新页面" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentsList />
          <Item onClick={handleCreate} icon={Plus} label="新页面" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="垃圾箱" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "left"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className=" opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        ></div>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 left-60 z-10 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <div className="w-full px-3 py-2 bg-transparent">
            {isCollapsed && (
              <Button variant="ghost" onClick={resetWidth}>
                <MenuIcon className="w-6 h-6 text-muted-foreground" />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
