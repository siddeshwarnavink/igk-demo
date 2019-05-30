import React, { useEffect, useState, useContext } from 'react';

import firebase from '../../../../global/firebase';
import StateContext from '../../../../context/state-context';
import { POSTS, USERS, POST_LIKE } from '../../../../constants/fbCollections';
import { SET_POSTS, ADD_POST } from '../../../../constants/actions';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Posts from '../../../../components/Posts/Posts';
import PostCreateBox from '../../../../components/Posts/PostCreateBox/PostCreateBox';
import CommitmentArea from '../CommitmentArea/CommitmentArea';

const PostsArea = (props: any) => {
    const [loading, setLoading] = useState(false);
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

        setLoading(true);

        loadPosts();
        // eslint-disable-next-line
    }, [dispatch, currentUser, props.userId]);

    const loadPosts = async () => {
        let query = firebase.firestore()
            .collection(POSTS)
            .where('creator', '==', props.userId)
            .orderBy("postedAt", "desc")
        
        const totalCount = await firebase.firestore().collection(POSTS).where('creator', '==', props.userId).get().then(snap => snap.size);


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
            })
    }

    return (
        <div>
            {loading ? <Spinner /> : (
                <React.Fragment>
                    {currentUser.uid === props.userId && <PostCreateBox />}
                    <CommitmentArea userId={props.userId} />
                    <Posts 
                        posts={posts.posts}
                        loadMore={loadPosts}
                        isEnd={isEnd}
                    />
                </React.Fragment>
            )}
        </div>
    )
}

export default PostsArea;