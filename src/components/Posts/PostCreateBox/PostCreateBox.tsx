import React, { useContext, useState } from 'react';
import { translate } from 'react-switch-lang';

import classes from './PostCreateBox.module.scss';
import firebase from '../../../global/firebase';
import StateContext from '../../../context/state-context';
import { ADD_POST } from '../../../constants/actions';
import { POSTS, COMMENTS } from '../../../constants/fbCollections';
import Uploader from '../../Uploader/Uploader';

const PostCreateBox = ({ t, ...props }: any) => {
    const stateContext: any = useContext(StateContext);
    const dispatch = stateContext[1];
    const currentUser: any = firebase.auth().currentUser;
    const [content, setContent] = useState('');
    const [image, setImage] = useState('')

    const createPostHandler = (event: any) => {
        event.preventDefault();
        

        let postData: any = {
            content,
            likes: 0,
            creator: currentUser.uid,
            image,
            postedAt: new Date().toISOString()
        }

        if (props.type === "comment") {
            postData = {
                ...postData,
                payload: props.payload,
                dataId: props.dataId
            }
        }


        firebase.firestore().collection(
            props.type === "comment" ? COMMENTS : POSTS
        ).add({
            ...postData
        }).then(() => {
            dispatch({
                type: ADD_POST,
                post: {
                    ...postData,
                    creator: {
                        username: currentUser.displayName
                    }
                }
            })
        })
    }

    return (
        <div className={classes.PostCreateBox}>
            <form onSubmit={createPostHandler}>
                <textarea
                    onChange={(e: any) => setContent(e.target.value)}
                    style={{ width: '95.5%' }}
                    placeholder={`${t('posts.postBoxPlaceholder')}, @${currentUser.displayName}`}
                    value={content}
                ></textarea>
                <button type="submit">{t("posts.postBoxButton")}</button>
                <Uploader 
                    id="image"
                    name="image"
                    onUploadComplete={({ cdnUrl }: any) => setImage(cdnUrl)}
                />
            </form>
        </div>
    )
}

export default translate(PostCreateBox);