import { SET_POSTS, ADD_POST, LIKE_POST } from '../constants/actions';
import { Post } from '../components/Posts/Posts.model';

export default (state: any, action: any) => {
    switch (action.type) {
        case SET_POSTS:
            return {
                ...state,
                posts: [
                    ...action.posts
                ]
            }

        case ADD_POST:
            return {
                ...state,
                posts: [
                    ...state.posts,
                    {
                        ...action.post
                    },
                ]
            }

        case LIKE_POST:
            let likePost = state.posts.filter((post: Post) => post.id === action.postId);
            likePost[0].likes++;
            likePost[0].liked = true;

            const posts = state.posts.concat(likePost)
                .filter((item: Post, i: number, ar: Post[]) => ar.indexOf(item) === i);


            return {
                ...state,
                posts
            }


        default:
            return state;
    }
}