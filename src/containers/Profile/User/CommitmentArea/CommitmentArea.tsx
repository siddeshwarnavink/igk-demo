import React, { useEffect, useState } from 'react';

import classes from './CommitmentArea.module.scss';
import UsersList from '../../../../components/Users/UsersList';
import UserItem from '../../../../components/Users/UserItem/UserItem';
import { USERS, USERS_FOLLOWERS, USERS_FOLLOWING } from '../../../../constants/fbCollections';
import firebase from '../../../../global/firebase';
import Spinner from '../../../../components/UI/Spinner/Spinner';

const CommitmentArea = (props: any) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initData('0');
        // eslint-disable-next-line
    }, []);

    const initData  = (dataType: string) => {
        let uri: string;
        setLoading(true);

        switch (dataType) {
            default:
            case '0':
                uri = `${USERS}/${props.userId}/${USERS_FOLLOWERS}`
                break;

            case '1': 
                uri = `${USERS}/${props.userId}/${USERS_FOLLOWING}`
                break;
        }

        firebase.firestore().collection(uri).get().then(async (querySnapshort) => {
            const innerUsers: any = [];
            
            await querySnapshort.forEach(async doc => {
                const userDoc = await firebase.firestore()
                    .collection(`${USERS}`)
                    .doc(doc.id)
                    .get();

                innerUsers.push({
                    id: userDoc.id,
                    ...userDoc.data()
                })
            });
            

            setUsers(innerUsers);
            setLoading(false);
        })
    }

    return (
        <div className={classes.CommitmentArea}>
            <select onChange={(e) => initData(e.target.value)}>
                <option value="0">Followers</option>
                <option value="1">Following</option>
            </select>
            <UsersList>
                {loading ? <Spinner /> : users.map((user: any, key) => (
                    <UserItem
                        username={user.username}
                        photoURL={user.photoURL}
                        key={key}
                    />
                ))}
            </UsersList>
        </div>
    )
}

export default CommitmentArea;