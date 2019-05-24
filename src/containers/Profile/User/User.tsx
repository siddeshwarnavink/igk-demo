import React, { useState, useEffect } from 'react';
import { translate } from 'react-switch-lang';

import classes from './User.module.scss';
import defaultAvatar from '../../../static/images/default-avatar.png';
import authRequired from '../../../hoc/authRequired/authRequired';
import firebase from '../../../global/firebase';
import { USERS, USERS_FOLLOWING, USERS_FOLLOWERS } from '../../../constants/fbCollections';
import { PROFILE_URI } from '../../../constants/navigation';
import Spinner from '../../../components/UI/Spinner/Spinner';
import PostsTab from './PostsArea/PostsArea';

const User = ({ t, ...props }: any) => {
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileData, setProfileData]: any = useState({});
    const [buttonState, setButtonState] = useState(0);
    const currentUser: any = firebase.auth().currentUser;

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
        })

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
    }, [initData]);

    const actionButtonClickHandler = async () => {
        switch(buttonState) {
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

    return (
        <div className={classes.User}>
            <div className={classes.Container}>
                {!profileLoading ? (
                    <React.Fragment>
                        <div className={classes.ProfileArea}>
                            <img src={!profileData.photoURL || profileData.photoURL === '' ?  defaultAvatar : profileData.photoURL} alt="User's avatar" />
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
                    </React.Fragment>
                ) : <Spinner />}
            </div>
        </div>
    )
}

export default authRequired(translate(User));