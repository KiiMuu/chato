import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import styles from './SidePanel.module.scss';

const StarredChannels = ({ setCurrentChannel, setPrivateChannel, currentUser }) => {

    const [values, setValues] = useState({
        user: currentUser,
        activeChannel: '',
        starredChannels: []
    });

    const { user, activeChannel, starredChannels } = values;

    const usersRef = firebase.database().ref('users');

    useEffect(() => {
        if (user) {
            addListeners(user.uid);
        }

        // eslint-disable-next-line
    }, [user]);

    const addListeners = userId => {
        usersRef.child(userId).child('starred').on('child_added', snap => {
            const starredChannel = { id: snap.key, ...snap.val() };

            setValues({
                ...values,
                starredChannels: [...starredChannels, starredChannel]
            });
        });

        usersRef.child(userId).child('starred').on('child_removed', snap => {
            const unstarredChannel = { id: snap.key, ...snap.val() };
            const filteredChannels = starredChannels.filter(channel => {
                return channel.id !== unstarredChannel.id;
            });

            setValues({
                ...values,
                starredChannels: filteredChannels
            });
        });
    }

    const setActiveChannel = channel => {
        setValues({
            ...values,
            activeChannel: channel.id
        });
    }

    const changeChannel = channel => {
        setActiveChannel(channel);
        setCurrentChannel(channel);
        setPrivateChannel(false);
    }

    const displayStarredChannels = starredChannels => (
        starredChannels?.length > 0 && starredChannels.map(starredCh => (
            <li 
                key={starredCh.id}
                onClick={() => changeChannel(starredCh)}
                active={starredCh.id === activeChannel ? activeChannel : undefined}
                className={starredCh.id === activeChannel ? styles.activeChannel : ''}
            >{starredCh.name}</li>
        ))
    );

    return (
        <div className={styles.starredChannels}>
            <div className={styles.starredLength}>
                <span>
                    Starred ({starredChannels?.length})
                </span>
            </div>
            {starredChannels?.length > 0 && <ul className={styles.starredList}>{displayStarredChannels(starredChannels)}</ul>}
        </div>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(StarredChannels);
