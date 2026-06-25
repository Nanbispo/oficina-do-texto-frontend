import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from '../api/client';
import { type User } from '../types';



export function useMe () {
    return useQuery ({
        queryKey: ['me'],
        queryFn: async () => {
            const { data } = await api.get<User>('/me')
            return data
        },
        retry: false,
        enabled: !!localStorage.getItem('@App:token')
    });
}

export function useLogin () {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (crendetials: Record<string, string>) => {
            const { data } = await api.post<{token: string}>('auth/login', crendetials)
            return data
        },
        onSuccess: (data) => {
            localStorage.setItem ('@App:token', data.token);
            queryClient.invalidateQueries({queryKey: ['me']})
        },
    });
}