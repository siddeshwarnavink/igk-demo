import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const baseURL = "https://igk-demo.web.app/";

admin.initializeApp();

function getUser(userId: string) {
    return admin.firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then(doc => ({
            id: doc.id,
            ...doc.data()
        }));
}

function getPost(postId: string) {
    return admin.firestore()
        .collection('posts')
        .doc(postId)
        .get()
        .then(doc => ({
            id: doc.id,
            ...doc.data()
        }));
}

function getComment(postId: string) {
    return admin.firestore()
        .collection('comment')
        .doc(postId)
        .get()
        .then(doc => ({
            id: doc.id,
            ...doc.data()
        }));
}


export const notifyOnLike = functions.firestore
    .document('posts/{postId}/likes/{likerId}')
    .onCreate(async (snap, context) => {
        const editedPost: any = await getPost(context.params.postId);
        const likerUser: any = await getUser(context.params.likerId);
        const postCreator: any = await getUser(editedPost.creator);

        return new Promise(async (resolve, reject) => {
            if (postCreator.notifyToken) {
                if (likerUser.id !== postCreator.id) {
                    await admin.messaging().sendToDevice(postCreator.notifyToken, {
                        notification: {
                            title: `@${likerUser.username} liked your post`,
                            body: 'Tap here to check it out!',
                            click_action: `${baseURL}post/${editedPost.id}`
                        }
                    });
                }
                resolve('notification sent!');
            } else {
                reject('notification failed to send!')
            }
        })
    });

export const notifyOnComment = functions.firestore
    .document('comments/{commentId}')
    .onCreate(async (snap, context) => {
        const comment: any = {
            id: snap.id,
            ...snap.data()
        }

        const commenter: any = await getUser(comment.creator);
        const commentedPost: any = await getPost(comment.payload);
        const postCreator: any = await getUser(commentedPost.creator);

        return new Promise(async (resolve, reject) => {
            if (postCreator.notifyToken) {
                if (commenter.id !== postCreator.id) {
                    await admin.messaging().sendToDevice(postCreator.notifyToken, {
                        notification: {
                            title: `@${commenter.username} commented your post`,
                            body: 'Tap here to check it out!',
                            click_action: `${baseURL}post/${commentedPost.id}`
                        }
                    });
                }
                resolve('notification sent!');
            } else {
                reject('notification failed to send!')
            }
        })
    });

export const notifyOnLikeComment = functions.firestore
    .document('comments/{postId}/likes/{likerId}')
    .onCreate(async (snap, context) => {
        const editedPost: any = await getComment(context.params.postId);
        const likerUser: any = await getUser(context.params.likerId);
        const postCreator: any = await getUser(editedPost.creator);

        return new Promise(async (resolve, reject) => {
            if (postCreator.notifyToken) {
                if (likerUser.id !== postCreator.id) {
                    await admin.messaging().sendToDevice(postCreator.notifyToken, {
                        notification: {
                            title: `@${likerUser.username} liked your comment`,
                            body: 'Tap here to check it out!',
                            click_action: `${baseURL}post/${editedPost.id}`
                        }
                    });
                }
                resolve('notification sent!');
            } else {
                reject('notification failed to send!')
            }
        })
    });

export const notifyOnFollow = functions.firestore
    .document('users/{userId}/followers/{followerId}')
    .onCreate(async (snap, context) => {
        const user: any = await getUser(context.params.userId);
        const follower: any = await getUser(context.params.followerId);

        return new Promise(async (resolve, reject) => {
            if (user.notifyToken) {
                await admin.messaging().sendToDevice(user.notifyToken, {
                    notification: {
                        title: `@${follower.username} started following you!`,
                        body: 'Tap here to check his / her profile',
                        click_action: `${baseURL}users/${follower.username}`
                    }
                });
                resolve('notification sent!');
            } else {
                reject('notification failed to send!')
            }
        })
    });

export const notifyOnNewConv = functions.firestore
    .document('conversation/{conversationId}')
    .onCreate(async (snap: any, context) => {
        const creator: any = await getUser(snap.data().creator);
        const member: any = await getUser(snap.data().member);

        return new Promise(async (resolve, reject) => {
            if (member.id === creator.id) {
                await snap.ref.delete();
                resolve('conversation deleted!');
            }

            if (member.notifyToken) {
                if (creator.id !== member.id) {
                    await admin.messaging().sendToDevice(member.notifyToken, {
                        notification: {
                            title: `@${creator.username} started to chat with you`,
                            body: 'Tap to chat with him',
                            click_action: `${baseURL}users/${creator.username}?openChat=true`
                        }
                    });
                }
                resolve('notification sent!');
            } else {
                reject('notification failed to send!')
            }
        })
    });

export const notifyOnNewMsg = functions.firestore
    .document('conversation/{conversationId}/messages/{messagesId}')
    .onCreate(async (snap: any, context) => {
        const conv: any = await admin.firestore()
            .collection('conversation')
            .doc(context.params.conversationId)
            .get()
            .then(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        const creator = await getUser(conv.creator);
        const member = await getUser(conv.member);

        const notifyUser: any = snap.data().author === creator.id ? member : creator;
        const unNotifyUser: any = notifyUser === creator ? member : creator;

        return new Promise(async (resolve, reject) => {
            if (notifyUser.notifyToken) {
                if (creator.id !== member.id) {
                    await admin.messaging().sendToDevice(notifyUser.notifyToken, {
                        notification: {
                            title: `@${unNotifyUser.username} messaged you!`,
                            body: snap.data().data.text ? snap.data().data.text : "Tap to view",
                            click_action: `${baseURL}users/${unNotifyUser.username}?openChat=true`
                        }
                    });
                }
                resolve('notification sent!');
            } else {
                reject('notification failed to send!')
            }
        })
    })