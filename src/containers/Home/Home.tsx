import React, { useEffect, useContext, useState } from 'react';

import classes from './Home.module.scss';
import firebase from '../../global/firebase';
import { POSTS, USERS, POST_LIKE } from '../../constants/fbCollections';
import authRequired from '../../hoc/authRequired/authRequired';
import StateContext from '../../context/state-context';
import PostCreateBox from '../../components/Posts/PostCreateBox/PostCreateBox';
import { ADD_POST, SET_POSTS } from '../../constants/actions';
import Posts from '../../components/Posts/Posts';
import Spinner from '../../components/UI/Spinner/Spinner';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [{ posts }, dispatch]: any = useContext(StateContext);
    const currentUser: any = firebase.auth().currentUser;
    const [lastDoc, setLastDoc]: any = useState(null);
    const [firstDoc, setFirstDoc]: any = useState(null);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        dispatch({
            type: SET_POSTS,
            posts: []
        });

        loadPosts();
    }, []);

    const loadPosts = async () => {
        let query = firebase.firestore()
            .collection(POSTS)
            .orderBy("postedAt", "desc")

        const totalCount = await firebase.firestore().collection(POSTS).get().then(snap => snap.size);

        if (posts.posts.length >= totalCount) {
            setIsEnd(true);
        }

        if (lastDoc !== null && firstDoc !== null) {
            query = query.startAfter(lastDoc)
                    // .endBefore(firstDoc)
                    .limit(3);
        } else {
            query = query.limit(3);
        }

        query.get()
            .then(quertSnapshort => {
                setLastDoc(quertSnapshort.docs[quertSnapshort.docs.length - 1]);
                setFirstDoc(quertSnapshort.docs[0]);

                if (quertSnapshort.size === 0) {
                    setLoading(false);
                    return;
                }

                quertSnapshort.forEach(async (doc: any) => {
                    const userDoc = await firebase.firestore()
                        .collection(USERS)
                        .doc(doc.data().creator)
                        .get();

                    const postAlreadyLiked = await firebase.firestore()
                        .doc(`${POSTS}/${doc.id}/${POST_LIKE}/${currentUser.uid}`)
                        .get()
                        .then((linkDocumen: any) => linkDocumen.exists);


                    const post = {
                        id: doc.id,
                        ...doc.data(),
                        creator: {
                            id: userDoc.id,
                            ...userDoc.data()
                        },
                        liked: postAlreadyLiked
                    }

                    setLoading(false);

                    dispatch({
                        type: ADD_POST,
                        post
                    })
                });
            });
    }

    return (
        <React.Fragment>
            <div className={classes.Container}>
                {!loading ? (
                    <React.Fragment>
                        <PostCreateBox />
                        <Posts
                            posts={posts.posts}
                            loadMore={loadPosts}
                            isEnd={isEnd}
                        />
                    </React.Fragment>
                ) : <Spinner />}
            </div>
        </React.Fragment>
    )
}

export default authRequired(Home);