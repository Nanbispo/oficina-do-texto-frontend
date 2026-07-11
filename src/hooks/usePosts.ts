import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { type Post } from '../types';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await api.get<Post[]>('/posts');
      return data;
    },
  });
}

export function usePost(id?: string | number) {
  return useQuery({
    queryKey: ['post', id],
    enabled: id !== undefined && id !== null && id !== '',
    queryFn: async () => {
      const postId = String(id);

      const endpoints = [`/posts/${postId}`, `/post/${postId}`];

      for (const endpoint of endpoints) {
        try {
          const { data } = await api.get<Post>(endpoint);
          if (data) {
            return data;
          }
        } catch (error) {
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status !== 404 && status !== 405) {
            throw error;
          }
        }
      }

      const { data: posts } = await api.get<Post[]>('/posts');
      const post = posts.find((item) => String(item.id) === postId);

      if (!post) {
        throw new Error('Artigo não encontrado.');
      }

      return post;
    },
  });
}
