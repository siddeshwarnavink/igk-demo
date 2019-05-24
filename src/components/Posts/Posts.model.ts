export interface Post {
    id: string;
    content: string;
    creator: any;
    liked?: boolean;
    likes: number;
    postedAt: string;
    image?: any;
}