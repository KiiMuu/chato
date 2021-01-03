import { useState, useEffect } from 'react';
import firebase from '../../firebase';
import styles from './SidePanel.module.scss';

const DirectMessages = ({ currentUser }) => {

    const [values, setValues] = useState({
        user: currentUser,
        users: []
    });

    const { user, users } = values;

    const usersRef = firebase.database().ref('users');
    const connectedRef = firebase.database().ref('.info/connected');
    const presenceRef = firebase.database().ref('presence');

    const addListeners = currentUserUid => {
        let loadedUsers = [];

        usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();

                user['uid'] = snap.key;
                user['status'] = 'offline';

                loadedUsers.push(user);

                setValues({
                    ...values,
                    users: loadedUsers
                });
            }
        });

        connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = presenceRef.child(currentUserUid);

                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            }
        });

        presenceRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                // add status to user
                addStatusToUser(snap.key);
            }
        });

        presenceRef.on('child_removed', snap => {
            if (currentUserUid !== snap.key) {
                // remove status from user
                addStatusToUser(snap.key, false);
            }
        });
    }

    const addStatusToUser = (userId, connected = true) => {
        const updatedUsers = users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }

            return acc.concat(user);
        }, []);

        setValues({
            ...values,
            users: updatedUsers
        });
    }

    useEffect(() => {
        if (user) {
            addListeners(user.uid);
        }

        // eslint-disable-next-line
    }, [user]);

    const isUserOnline = user => user.status === 'online';

    const displayUsers = users => (
        users?.length > 0 && users.map(user => (
            <li key={user.uid}>
                @{user.name} 
                <span className={`${styles.statusIcon} ${isUserOnline(user) ? styles.green : styles.grey}`}></span>
            </li>
        ))
    );

    return (
        <div className={styles.directMessages}>
            <div className={styles.usersLength}>
                <span>
                    Direct Message ({users?.length})
                </span>
            </div>
            {users?.length > 0 && <ul className={styles.usersList}>{displayUsers(users)}</ul>}
        </div>
    )
}

export default DirectMessages;