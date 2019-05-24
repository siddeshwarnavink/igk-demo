import React, { useEffect, useState, useContext } from 'react';
import { translate } from 'react-switch-lang';

import classes from './Comments.module.scss';
import firebase from '../../global/firebase';
import { COMMENTS, USERS, POST_LIKE } from '../../constants/fbCollections';
import PostCreateBox from '../Posts/PostCreateBox/PostCreateBox';
import Spinner from '../UI/Spinner/Spinner';
import { ADD_POST, SET_POSTS } from '../../constants/actions';
import StateContext from '../../context/state-context';
import PostItem from '../Posts/PostItem/PostItem';
import { Post } from '../Posts/Posts.model';

const Comments = ({ t, ...props }: any) => {
    const currentUser: any = firebase.auth().currentUser;
    const [loading, setLoading] = useState(true);
    const [noComments, setNoComments] = useState(false);
    const [{ posts }, dispatch]: any = useContext(StateContext);

    useEffect(() => {
        initComments();
        // eslint-disable-next-line
    }, []);

    const initComments = () => {
        dispatch({
            type: SET_POSTS,
            posts: []
        });

        firebase.firestore()
            .collection(COMMENTS)
            .where('dataId', '==', props.dataId)
            .where('payload', '==', props.payload)
            .get()
            .then(querySnap => {
                if (querySnap.empty) {
                    setLoading(false);
                    setNoComments(true);
                    return;
                }

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
            <h1>{t("comments.title")}</h1>

            <div className={classes.Post}>
                {noComments ? <p>{t("comments.noComment")}</p>
                    :
                    loading ? <Spinner /> : (
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

export default translate(Comments);