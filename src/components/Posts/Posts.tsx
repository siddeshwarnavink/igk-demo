import React from 'react';
import { translate } from 'react-switch-lang';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostItem from './PostItem/PostItem';
import { Post } from './Posts.model';
import Spinner from '../UI/Spinner/Spinner';

const Posts = ({ t, ...props }: any) => {
    return (
        <InfiniteScroll
            dataLength={props.posts.length}
            next={props.loadMore}
            hasMore={!props.isEnd}
            loader={<Spinner />}
            endMessage={
                <p style={{textAlign: 'center', color: '#777'}}>
                  <b>{t("posts.noPosts")}</b>
                </p>
            }
        >
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
        </InfiniteScroll>
    )
}

export default translate(Posts);