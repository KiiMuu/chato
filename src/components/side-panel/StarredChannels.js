import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import styles from './SidePanel.module.scss';

const StarredChannels = ({ setCurrentChannel, setPrivateChannel, currentUser }) => {

    const [starredChannels, setStarredChannels] = useState([]);
    const [values, setValues] = useState({
        user: currentUser,
        activeChannel: '',
    });

    const { user, activeChannel } = values;

    const usersRef = firebase.database().ref('users');

    useEffect(() => {
        if (user) {
            addListeners(user.uid);
        }

        // eslint-disable-next-line
    }, []);

    const addListeners = userId => {
        usersRef.child(userId).child('starred').on('child_added', snap => {
            const starredChannel = { id: snap.key, ...snap.val() };
            // newStarred.push({id: snap.key, ...snap.val()});

            setStarredChannels(prevStarredChannels => [
                ...prevStarredChannels,
                starredChannel
            ]);
        });

        usersRef.child(userId).child('starred').on('child_removed', snap => {
            const unstarredChannel = { id: snap.key, ...snap.val() };

            setStarredChannels(prevStarredChannels =>
                prevStarredChannels.filter(channel => {
                    return channel.id !== unstarredChannel.id;
                })
            );
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

    console.log(starredChannels.length);
    console.log(starredChannels);

    return (
        <div className={styles.starredChannels}>
            <div className={styles.starredLength}>
                <span>
                    Starred ({starredChannels.length})
                </span>
            </div>
            {starredChannels?.length > 0 && <ul className={styles.starredList}>{displayStarredChannels(starredChannels)}</ul>}
        </div>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(StarredChannels);
