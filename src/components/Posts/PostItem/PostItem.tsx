import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { translate } from 'react-switch-lang';

import classes from './PostItem.module.scss';
import defaultAvatar from '../../../static/images/default-avatar.png';
import StateContext from '../../../context/state-context';
import { USER_URI, POST_URI } from '../../../constants/navigation';
import { LIKE_ICON, COMMENT_ICON, EDIT_ICON, CLOSE_ICON } from '../../../constants/icons';
import { LIKE_POST } from '../../../constants/actions';
import { POSTS, POST_LIKE, COMMENTS } from '../../../constants/fbCollections';
import firebase from '../../../global/firebase';

const PostItem = ({ t, ...props }: any) => {
    const stateContext: any = useContext(StateContext);
    const dispatch = stateContext[1];
    const currentUser: any = firebase.auth().currentUser;
    const [editMode, setEditMode] = useState(false);
    const [newContent, setNewContent] = useState('');

    const onLikeButtonPressedHandler = async () => {
        if (!props.liked) {
            dispatch({
                type: LIKE_POST,
                postId: props.postId
            });

            await firebase.firestore()
                .collection(props.type === "comment" ? COMMENTS : POSTS)
                .doc(props.postId)
                .collection(POST_LIKE)
                .doc(currentUser.uid)
                .set({
                    likedAt: new Date().toISOString()
                });

            await firebase.firestore()
                .collection(props.type === "comment" ? COMMENTS : POSTS)
                .doc(props.postId)
                .update({
                    likes: props.likes + 1
                });
        }
    }

    const content = props.content.split(' ').map((word: string) => {
        if (word[0] === '@') {
            return <React.Fragment>{` `}<Link to={`${USER_URI}${word.substr(1)}`}>{word}</Link>{` `}</React.Fragment>
        } else if (word.substring(0, 5) === "http:" || word.substring(0, 6) === "https:") {
            // eslint-disable-next-line
            return <React.Fragment>{` `}<a target="_blank" href={word}>{word}</a>{` `}</React.Fragment>
        }

        return <React.Fragment>{` `}{word}{` `}</React.Fragment>;
    });

    const onUpdatePostHandler = async () => {
        await firebase.firestore()
            .collection(props.type === "comment" ? COMMENTS : POSTS)
            .doc(props.postId)
            .update({
                content: newContent 
            });

        window.location.reload();
    }

    const onDeletePost = async () => {
        if (window.confirm(t('posts.deleteMsg'))) {
            await firebase.firestore()
                .collection(props.type === "comment" ? COMMENTS : POSTS)
                .doc(props.postId)
                .delete();

            if (props.type !== "comment") {
                const postComments = await firebase.firestore()
                        .collection(COMMENTS)
                        .where('payload', '==', props.postId)
                        .get();

                postComments.forEach(commentDoc => {
                    commentDoc.ref.delete();
                });
            }

            alert("Post Deleted!");

            window.location.reload();
        }
    }

    return (
        <div className={classes.PostItem}>
            <div className={classes.AvatarSection}>
                <img
                    src={!props.creator.photoURL || props.creator.photoURL === '' ? defaultAvatar : props.creator.photoURL}
                    alt="Loading..."
                />
                <Link to={`${USER_URI}${props.creator.username}`}>@{props.creator.username}</Link>
            </div>

            {props.image && (
                <img
                    className={classes.PostImg}
                    src={props.image}
                    alt="Loading..."
                />
            )}

            <div className={classes.PostContent}>
                {editMode ? (
                    <React.Fragment>
                        <textarea style={{ width: '92%' }} value={newContent} onChange={(e) => setNewContent(e.target.value)}></textarea>
                        <button onClick={onUpdatePostHandler}>{t("posts.saveBtn")}</button>
                        {` `}<a href="javascript:void(0)" onClick={onDeletePost}>{t("posts.removeBtn")}</a>
                    </React.Fragment>
                ) : content}
            </div>

            <div className={classes.PostLinks}>
                <button className="flat" style={!props.liked ? { color: '#333' } : {}} onClick={onLikeButtonPressedHandler}>
                    <i className="material-icons">
                        {LIKE_ICON}
                    </i>
                    <span>{props.likes}</span>
                </button>

                {!props.hideComment && (
                    <button className="flat" style={{ color: '#333' }} onClick={() => props.history.push(`${POST_URI}${props.postId}`)}>
                        <i className="material-icons">
                            {COMMENT_ICON}
                        </i>
                    </button>
                )}

                {currentUser.uid === props.creator.id && (
                    <button className="flat" style={{ color: '#333' }} onClick={() => {
                        setNewContent(props.content);
                        setEditMode(!editMode);
                    }}>
                        <i className="material-icons">
                            {editMode ? CLOSE_ICON : EDIT_ICON}
                        </i>
                    </button>
                )}
            </div>
        </div>
    )
}

export default withRouter(translate(PostItem));