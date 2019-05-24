import React, { useState } from 'react';
import { translate } from 'react-switch-lang';

import classes from './Profile.module.scss';
import authRequired from '../../hoc/authRequired/authRequired';
import firebase from '../../global/firebase';
import defaultProfilePic from '../../static/images/default-avatar.png';
import Uploader from '../../components/Uploader/Uploader';
import validateProfile from '../../validations/profile';
import useFormValidation from '../../hooks/useFormValidation';
import { USERS } from '../../constants/fbCollections';

const Profile = ({ t, ...props }: any) => {
    const [image, setImage] = useState('');
    const currentUser: any = firebase.auth().currentUser;
    
    const onProfileUpdateHandler = async () => {
        const usersRef = firebase.firestore().collection(USERS);

        const searcHUserExist = await usersRef
            .where('username', '==', values.displayName)
            .get()
            .then(querySnapshort => querySnapshort.docs)

        const isUserExist: boolean = searcHUserExist.filter((doc) => doc.id !== currentUser.uid).length > 0        

        if (!isUserExist) {
            await currentUser.updateProfile({
                displayName: values.displayName,
                photoURL: image
            });

            await usersRef.doc(currentUser.uid).update({
                username: values.displayName,
                photoURL: image
            })

            alert(t('profile.profileUpdateSuccess'));

            window.location.reload();
        } else {
            alert(t('profile.usernameExists'));
        }
    }

    const PROFILE_FORM_STATE = {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL ? currentUser.photoURL : ''
    }
    
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        isSubmitting
    }: any = useFormValidation(PROFILE_FORM_STATE, validateProfile, onProfileUpdateHandler);

    return (
        <div className={classes.Profile}>
            <div className={classes.Container}>
                <h1>{t("profile.profileTitle")}</h1>

                <div className={classes.DPSection}>
                    <img src={PROFILE_FORM_STATE.photoURL === '' ? defaultProfilePic : PROFILE_FORM_STATE.photoURL} alt="Profile pic" />
                    <br />
                    <Uploader
                        id="image"
                        name="image"
                        onUploadComplete={({ cdnUrl }: any) => setImage(cdnUrl)}
                    />
                    <br /><br />
                </div>

                <form onSubmit={handleSubmit}>
                    <label>{t("auth.usernamePlaceHolder")}</label>
                    <input
                        style={{ width: '96%' }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.displayName}
                        name="displayName"
                    />

                    {errors.displayName && <span className="error-text">{errors.displayName}</span>}

                    <br />

                    <button type="submit" disabled={isSubmitting}>
                        {t("profile.updateButton")}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default authRequired(translate(Profile));