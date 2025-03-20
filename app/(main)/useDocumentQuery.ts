import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archive,
  createDocument,
  getSidebar,
  getTrashDocuments,
  remove,
  restore,
} from "@/app/actions/document";

export const useSidebarDocuments = (parentDocumentId?: string) => {
  return useQuery({
    queryKey: ["sidebarDocuments", parentDocumentId],
    queryFn: () => getSidebar(parentDocumentId),
    staleTime: 0,
  });
};

export const useCreateDocument = () => {
  return useMutation({
    mutationFn: async (params: {
      title: string;
      parentDocumentId?: string;
    }) => {
      return createDocument(params.title, params.parentDocumentId);
    },
  });
};

export const useArchive = () => {
  return useMutation({
    mutationFn: async (parentDocumentId: string) => {
      return archive(parentDocumentId);
    },
  });
};

export const useTrashDocuments = () => {
  return useQuery({
    queryKey: ["trashDocuments"],
    queryFn: () => getTrashDocuments(),
    staleTime: 0,
  });
};

export const useRestore = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      return restore(documentId);
    },
  });
};

export const useRemove = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      return remove(documentId);
    },
  });
};
