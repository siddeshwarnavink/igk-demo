import React, { useEffect, useState, useContext } from 'react';

import classes from './Comments.module.scss';
import firebase from '../../global/firebase';
import { COMMENTS, USERS, POST_LIKE } from '../../constants/fbCollections';
import PostCreateBox from '../Posts/PostCreateBox/PostCreateBox';
import Spinner from '../UI/Spinner/Spinner';
import { ADD_POST } from '../../constants/actions';
import StateContext from '../../context/state-context';
import PostItem from '../Posts/PostItem/PostItem';
import { Post } from '../Posts/Posts.model';

const Comments = (props: any) => {
    const currentUser: any = firebase.auth().currentUser;
    const [loading, setLoading] = useState(true);
    const [{ posts }, dispatch]: any = useContext(StateContext);

    console.log(posts);
    

    useEffect(() => {
        initComments();
        // eslint-disable-next-line
    }, []);

    const initComments = () => {
        firebase.firestore()
            .collection(COMMENTS)
            .where('dataId', '==', props.dataId)
            .where('payload', '==', props.payload)
            .get()
            .then(querySnap => {
                querySnap.forEach(async (doc: any) => {
                    const userDoc = await firebase.firestore()
                        .collection(USERS)
                        .doc(doc.data().creator)
                        .get();

                    const postAlreadyLiked = await firebase.firestore()
                        .doc(`${COMMENTS}/${doc.id}/${POST_LIKE}/${currentUser.uid}`)
                        .get()
                        .then((linkDocumen: any) => linkDocumen.exists);
                    

                    const comment = {
                        id: doc.id,
                        ...doc.data(),
                        creator: {
                            id: userDoc.id,
                            ...userDoc.data()
                        },
                        liked: postAlreadyLiked
                    }

                    dispatch({
                        type: ADD_POST,
                        post: comment
                    });

                    setLoading(false);
                })
            });
    }

    return (
        <div className={classes.Comments}>
            <h1>Comments</h1>
            
            <div className={classes.Post}>
                {loading ? <Spinner /> : (
                    posts.posts.map((post: Post) => (
                        <PostItem
                            key={post.id}
                            hideComment
                            type="comment"
                            postId={post.id}
                            content={post.content}
                            likes={post.likes}
                            creator={post.creator}
                            image={post.image ? post.image : null}
                            liked={post.liked}
                        />
                    ))
                )}
            </div>

            <PostCreateBox 
                type="comment"
                dataId={props.dataId} 
                payload={props.payload} 
            />
        </div>
    )
}

export default Comments;