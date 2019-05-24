import React from 'react';

import PostItem from './PostItem/PostItem';
import { Post } from './Posts.model';

const Posts = (props: any) => {
    return (
        <div>
            {props.posts.map((post: Post) => {
                return (
                    <PostItem
                        key={post.id}
                        postId={post.id}
                        content={post.content}
                        likes={post.likes}
                        creator={post.creator}
                        image={post.image ? post.image : null}
                        liked={post.liked}
                    />
                )
            })}
        </div>
    )
}

export default Posts;