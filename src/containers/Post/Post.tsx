import React, { useEffect, useState } from 'react';

import classes from './Post.module.scss';
import firebase from '../../global/firebase';
import { POSTS, USERS, POST_LIKE } from '../../constants/fbCollections';
import PostItem from '../../components/Posts/PostItem/PostItem';
import Spinner from '../../components/UI/Spinner/Spinner';
import authRequired from '../../hoc/authRequired/authRequired';
import Comments from '../../components/Comments/Comments';

const Post = (props: any) => {
    const currentUser: any = firebase.auth().currentUser;
    const [loading, setLoading] = useState(true);
    const [post, setPost]: any = useState({});


    useEffect(() => {
        initPost();
        // eslint-disable-next-line
    }, []);
    
    const initPost = () => {
        setLoading(true);
        
        firebase.firestore()
            .collection(POSTS)
            .doc(props.match.params.postId)
            .get()
            .then(async (doc: any) => {
                if (!doc.exists) {
                    alert("Post not found");
                    window.location.assign("/");
                }

                const userDoc = await firebase.firestore()
                        .collection(USERS)
                        .doc(doc.data().creator)
                        .get();

                const postAlreadyLiked = await firebase.firestore()
                        .doc(`${POSTS}/${doc.id}/${POST_LIKE}/${currentUser.uid}`)
                        .get()
                        .then((linkDocumen: any) => linkDocumen.exists);

                const innerPost = {
                    id: doc.id,
                    ...doc.data(),
                    creator: {
                        id: userDoc.id,
                        ...userDoc.data()
                    },
                    liked: postAlreadyLiked
                }                

                setPost(innerPost);
                setLoading(false);
            });
    }

    return (
        <div className={classes.Post}>
            {loading ? <Spinner /> : (
                <React.Fragment>
                    <div className={classes.Post}>
                        <PostItem
                            hideComment
                            postId={props.match.params.postId}
                            content={post.content}
                            likes={post.likes}
                            creator={post.creator}
                            image={post.image ? post.image : null}
                            liked={post.liked}
                        />
                    </div>

                    <Comments 
                        dataId="post" 
                        payload={props.match.params.postId} 
                    />
                </React.Fragment>
            )}
        </div>
    )
} 

export default authRequired(Post);