export interface User {
    user_id: number;
    username: string;
}

export interface Tag {
    title: string;
    id: number;
    name: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    author: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    tags: Tag[];
} 