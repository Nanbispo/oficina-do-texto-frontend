import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

// Tipagem baseada perfeitamente na sua struct Go
export interface Tag {
  id: number;     // Assumindo que a sua struct de Tag tem ID
  name: string;  // e Title
}

export interface Post {
  authorId: number;
  id: number;
  title: string;
  content: string;
  author: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // O Go já manda o JSON perfeito, só precisamos ler
      const { data } = await api.get<Post[]>('/posts');
      return data;
    },
  });
}