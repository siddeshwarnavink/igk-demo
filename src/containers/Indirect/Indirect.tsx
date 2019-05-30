import React, { useEffect, useState } from 'react';
import { translate } from 'react-switch-lang' 
import classes from './Indirect.module.scss';

import authRequired from '../../hoc/authRequired/authRequired';
import firebase from '../../global/firebase';
import { CONVERSATION, USERS } from '../../constants/fbCollections';
import Spinner from '../../components/UI/Spinner/Spinner';
import Conversations from '../../components/Conversations/Conversations'
import ConversationItem from '../../components/Conversations/ConversationItem/ConversationItem'

const Indirect = ({ t, ...props }: any) => {
    const currentUser: any = firebase.auth().currentUser;
    const [loading, setLoading] = useState(false);
    const [conves, setConves] = useState([]);

    useEffect(() => {
        setLoading(true);
        initConvs();
        // eslint-disable-next-line
    }, []);

    const initConvs = async () => {
        const convByUser = await firebase.firestore().collection(CONVERSATION)
            .where('creator', '==', currentUser.uid)
            .get();

        const convInUser = await firebase.firestore().collection(CONVERSATION)
            .where('member', '==', currentUser.uid)
            .get();

        const allDocs = [
            ...convByUser.docs,
            ...convInUser.docs
        ];

        const convs: any = [];

        await Promise.all(allDocs.map(async (doc) => {
            const otherUser = await firebase.firestore()
                .collection(USERS)
                .doc(doc.data().creator === currentUser.uid ? doc.data().member : doc.data().creator)
                .get()
                .then((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                await convs.push({
                    id: doc.id,
                    ...doc.data(),
                    otherUser
                });
        }));

        setConves(convs);
        setLoading(false);        
    }

    return (
        <div className={classes.Indirect}>
            <div className={classes.Content}>
                <h1>{t("indirect.title")}</h1>
            </div>

            {loading ? <Spinner /> : (
                <Conversations>
                    {conves.length > 0 ? conves.map((conv: any) => (
                        <ConversationItem
                            key={conv.id}
                            otherUser={conv.otherUser}
                            createdAt={conv.createdAt}
                            dp={conv.otherUser.photoURL}
                        />
                    )) : <p>{t("indirect.noConvs")}</p> }
                </Conversations>
            )}
        </div>
    )
}

export default authRequired(translate(Indirect));