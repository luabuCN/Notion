import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archive,
  createDocument,
  getSidebar,
  getTrashDocuments,
  remove,
  restore,
  getDocumentById,
  getSearch,
  updateDoc,
  type IUpdate,
  getUser,
  removeCoverImage,
} from "@/app/actions/document";
import { auth } from "@clerk/nextjs/server";

export const useSidebarDocuments = (parentDocumentId?: string) => {
  return useQuery({
    queryKey: ["sidebarDocuments", parentDocumentId],
    queryFn: () => getSidebar(parentDocumentId),
    staleTime: 0,
  });
};
export const useDocumentQuery = (documentId: string) => {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocumentById(documentId),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (parentDocumentId: string) => {
      return archive(parentDocumentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sidebarDocuments"],
      });
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      return restore(documentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sidebarDocuments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },
  });
};

export const useRemove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      return remove(documentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sidebarDocuments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },
  });
};

export const useSearch = () => {
  return useQuery({
    queryKey: ["search"],
    queryFn: () => getSearch(),
  });
};

export const useUpdateDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: IUpdate) => {
      return updateDoc(params);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sidebarDocuments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },
  });
};

export const useIsLogon = () => {
  return useQuery({
    queryKey: ["isLogon"],
    queryFn: () => getUser(),
  });
};

export const useRemoveCoverImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      await removeCoverImage(documentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },
  });
};
