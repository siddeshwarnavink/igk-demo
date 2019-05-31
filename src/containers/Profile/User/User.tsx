import React, { useState, useEffect } from 'react';
import { Launcher } from 'react-chat-window'
import { translate } from 'react-switch-lang';
import randomBytes from 'randombytes'

import classes from './User.module.scss';
import defaultAvatar from '../../../static/images/default-avatar.png';
import authRequired from '../../../hoc/authRequired/authRequired';
import firebase from '../../../global/firebase';
import { USERS, USERS_FOLLOWING, USERS_FOLLOWERS, CONVERSATION, CONVERSATION_MSGS } from '../../../constants/fbCollections';
import { PROFILE_URI } from '../../../constants/navigation';
import Spinner from '../../../components/UI/Spinner/Spinner';
import PostsTab from './PostsArea/PostsArea';
import { CHAT_ITEM } from '../../../constants/filePath';

const User = ({ t, ...props }: any) => {
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileData, setProfileData]: any = useState({});
    const [buttonState, setButtonState] = useState(0);
    const [messageOpen, setMessageOpen] = useState(false);
    const currentUser: any = firebase.auth().currentUser;
    const [msgs, setMsgs] = useState([])

    // Firestore util
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);

    // eslint-disable-next-line
    const initData = async () => {
        const userQuerySnapshot = await firebase.firestore().collection(USERS)
            .where('username', '==', props.match.params.userId)
            .limit(1)
            .get();

        setProfileData({
            id: userQuerySnapshot.docs[0].id,
            ...userQuerySnapshot.docs[0].data()
        });

        const searchFollowingList = await firebase.firestore()
            .doc(`${USERS}/${userQuerySnapshot.docs[0].id}/${USERS_FOLLOWERS}/${currentUser.uid}`)
            .get();

        if (currentUser.displayName === props.match.params.userId) {
            setButtonState(2);
        }
        else {
            if (!searchFollowingList.exists) {
                setButtonState(0);
            } else {
                setButtonState(1);
            }
        }

        setProfileLoading(false);
    }

    useEffect(() => {
        initData();

        if(props.location.search === "?openChat=true") {
            setMessageOpen(true);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        console.log(Object.keys(profileData).length);
        

        if (Object.keys(profileData).length > 0) {
            initConvMsg();
        }
        // eslint-disable-next-line
    }, [profileData])

    const actionButtonClickHandler = async () => {
        switch (buttonState) {
            case 0:
                // Follow
                await firebase.firestore()
                    .doc(`${USERS}/${profileData.id}/${USERS_FOLLOWERS}/${currentUser.uid}`)
                    .set({
                        followedAt: new Date().toISOString()
                    });

                await firebase.firestore()
                    .doc(`${USERS}/${currentUser.uid}/${USERS_FOLLOWING}/${profileData.id}`)
                    .set({
                        followedAt: new Date().toISOString()
                    });

                // Aggregate the data
                await firebase.firestore()
                    .doc(`${USERS}/${profileData.id}`)
                    .update({
                        followers: increment
                    })

                await firebase.firestore()
                    .doc(`${USERS}/${currentUser.uid}`)
                    .update({
                        following: increment
                    })

                break;
            case 1:
                // Unfollow
                await firebase.firestore()
                    .doc(`${USERS}/${profileData.id}/${USERS_FOLLOWERS}/${currentUser.uid}`)
                    .delete();

                await firebase.firestore()
                    .doc(`${USERS}/${currentUser.uid}/${USERS_FOLLOWING}/${profileData.id}`)
                    .delete();

                // Aggregate the data
                await firebase.firestore()
                    .doc(`${USERS}/${profileData.id}`)
                    .update({
                        followers: decrement
                    })

                await firebase.firestore()
                    .doc(`${USERS}/${currentUser.uid}`)
                    .update({
                        following: decrement
                    })

                break;
            case 2:
                // Edit profile
                props.history.push(PROFILE_URI);
                break;
        }

        initData();
    }

    const initConv = async () => {
        let conversation: any;

        conversation = await firebase.firestore().collection(CONVERSATION)
                .where('creator', '==', currentUser.uid)
                .where('member', '==', profileData.id)
                .limit(1)
                .get();

        if (conversation.empty && (currentUser.uid !== profileData.id)) {
            conversation = await firebase.firestore().collection(CONVERSATION)
                .where('member', '==', currentUser.uid)
                .where('creator', '==', profileData.id)
                .limit(1)
                .get();
        }

        let newConv = false;

        if (conversation.empty) {
            // Create new conversation
            conversation = await firebase.firestore().collection(CONVERSATION)
                .add({
                    creator: currentUser.uid,
                    member: profileData.id,
                    createdAt: new Date().toISOString()
                });

            newConv = true;
        }

        if (!newConv) {
            conversation = conversation.docs[0];
        }

        return conversation;
    }

    const initConvMsg = async () => {
        let conversation = await initConv();
        
        firebase.firestore().collection(CONVERSATION).doc(conversation.id).collection(CONVERSATION_MSGS)
            .orderBy('postedAt', 'asc')
            .onSnapshot((querySnap) => {
                const msgs: any = [];
                
                querySnap.forEach(doc => {
                    msgs.push({
                        id: doc.id,
                        ...doc.data(),
                        author: doc.data().author === currentUser.uid ? 'me' : 'them',
                    });
                })

                setMsgs(msgs);
            })
    }


    const onMessageWasSentHandler = async (msg: any) => {
        let conversation = await initConv();

        // Create the message
        await firebase.firestore()
            .collection(CONVERSATION)
            .doc(conversation.id)
            .collection(CONVERSATION_MSGS)
            .add({
                ...msg,
                postedAt: new Date().toISOString(),
                author: currentUser.uid
            });
    }

    const onFilesSelectedHandler = (fileList: FileList) => {
        console.log(fileList);
        const uploadTask = firebase.storage().ref().child(`${CHAT_ITEM}${randomBytes(16)}-${fileList[0].name}`).put(fileList[0]);
    
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snap) => {
            console.log("Snap", snap);
        }, (err) => {
            console.log("Err", err);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                console.log('File available at', downloadURL);

                let conversation = await initConv();

                // Create the message
                await firebase.firestore()
                    .collection(CONVERSATION)
                    .doc(conversation.id)
                    .collection(CONVERSATION_MSGS)
                    .add({
                        type: 'file',
                        data: {
                            url: downloadURL,
                            fileName: fileList[0].name
                        },
                        postedAt: new Date().toISOString(),
                        author: currentUser.uid
                    });
            })
        })
    } 

    return (
        <div className={classes.User}>
            <div className={classes.Container}>
                {!profileLoading ? (
                    <React.Fragment>
                        <div className={classes.ProfileArea}>
                            <img src={!profileData.photoURL || profileData.photoURL === '' ? defaultAvatar : profileData.photoURL} alt="User's avatar" />
                            <h1>@{profileData.username}</h1>

                            <div className={classes.DataArea}>
                                <div>
                                    <label>{t("userPage.followers")}</label>
                                    <div className={classes.NumberCircle}>{profileData.followers}</div>
                                </div>

                                <div>
                                    <label>{t("userPage.following")}</label>
                                    <div className={classes.NumberCircle}>{profileData.following}</div>
                                </div>
                            </div>


                            {!profileLoading && (
                                <button onClick={actionButtonClickHandler}>
                                    {buttonState === 0 ? t("userPage.follow") : buttonState === 2 ? t("userPage.editProfile") : t("userPage.unfollow")}
                                </button>
                            )}

                            <br /><br />
                        </div>

                        <div className={classes.ContentArea}>
                            <PostsTab userId={profileData.id} />
                        </div>
                        {(currentUser.uid !== profileData.id) && <Launcher
                            agentProfile={{
                                teamName: `@${profileData.username}`,
                                imageUrl: !profileData.photoURL || profileData.photoURL === '' ? defaultAvatar : profileData.photoURL + '-/preview/25x25/'
                            }}
                            showEmoji
                            isOpen={messageOpen}
                            messageList={msgs}
                            handleClick={() => {
                                setMessageOpen(!messageOpen)
                            }}
                            onMessageWasSent={onMessageWasSentHandler}
                            onFilesSelected={onFilesSelectedHandler}
                        />}
                    </React.Fragment>
                ) : <Spinner />}
            </div>
        </div>
    )
}

export default authRequired(translate(User));