"use client";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { File } from "lucide-react";
import { uesSearch } from "@/hooks/user-search";
import axios from "axios";

const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const toggle = uesSearch((store) => store.toggle);
  const isOpen = uesSearch((store) => store.isOpen);
  const onClose = uesSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('/api/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Failed to fetch documents', error);
      }
    };

    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search all ${user?.fullName} documents...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((doc) => (
            <CommandItem
              key={doc.id}
              value={`${doc.id}-${doc.title}`}
              title={doc.title}
              onSelect={() => {
                router.push(`/documents/${doc.id}`);
                onClose();
              }}
            >
              {doc.icon ? (
                <div className="mr-2 h-4 w-4">{doc.icon}</div>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
