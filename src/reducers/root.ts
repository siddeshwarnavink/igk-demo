import authReducer from './auth';
import postsReducer from './posts';

const rootReducer = ({ auth, posts }: any, action: any) => ({
    auth: authReducer(auth, action),
    posts: postsReducer(posts, action)
}) 

export default rootReducer;