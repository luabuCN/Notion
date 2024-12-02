import { create } from "zustand";
import { useUser } from "@clerk/clerk-react";

export interface Document {
  id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocument?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentStore {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  create: (data: Partial<Document>) => Promise<Document>;
  update: (id: string, data: Partial<Document>) => Promise<Document>;
  remove: (id: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  publish: (id: string) => Promise<void>;
  unpublish: (id: string) => Promise<void>;
  getDocument: (id: string) => Promise<Document>;
  getDocuments: () => Promise<Document[]>;
  setDocuments: (documents: Document[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDocuments = create<DocumentStore>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,

  create: async (data) => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to create document");
      
      const document = await response.json();
      set((state) => ({ documents: [...state.documents, document] }));
      return document;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create document" });
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to update document");
      
      const document = await response.json();
      set((state) => ({
        documents: state.documents.map((doc) => 
          doc.id === id ? { ...doc, ...document } : doc
        ),
      }));
      return document;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update document" });
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete document");
      
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete document" });
      throw error;
    }
  },

  archive: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}/archive`, {
        method: "PATCH",
      });
      
      if (!response.ok) throw new Error("Failed to archive document");
      
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? { ...doc, isArchived: true } : doc
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to archive document" });
      throw error;
    }
  },

  restore: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}/restore`, {
        method: "PATCH",
      });
      
      if (!response.ok) throw new Error("Failed to restore document");
      
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? { ...doc, isArchived: false } : doc
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to restore document" });
      throw error;
    }
  },

  publish: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}/publish`, {
        method: "PATCH",
      });
      
      if (!response.ok) throw new Error("Failed to publish document");
      
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? { ...doc, isPublished: true } : doc
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to publish document" });
      throw error;
    }
  },

  unpublish: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}/unpublish`, {
        method: "PATCH",
      });
      
      if (!response.ok) throw new Error("Failed to unpublish document");
      
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? { ...doc, isPublished: false } : doc
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to unpublish document" });
      throw error;
    }
  },

  getDocument: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) throw new Error("Failed to fetch document");
      return await response.json();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch document" });
      throw error;
    }
  },

  getDocuments: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const documents = await response.json();
      set({ documents, isLoading: false });
      return documents;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch documents",
        isLoading: false 
      });
      throw error;
    }
  },

  setDocuments: (documents) => set({ documents }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
