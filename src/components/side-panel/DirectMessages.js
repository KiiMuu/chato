import { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';
import styles from './SidePanel.module.scss';

class DirectMessages extends Component {

    state = {
        user: this.props.currentUser,
        users: [],
        activeChannel: '',
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence')
    }

    addListeners = currentUserUid => {
        const { usersRef, connectedRef, presenceRef, user } = this.state;
        let loadedUsers = [];

        usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();

                user['uid'] = snap.key;
                user['status'] = 'offline';

                loadedUsers.push(user);

                this.setState({ users: loadedUsers });
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
            if (this.state.user.uid !== snap.key) {
                // add status to user
                this.addStatusToUser(snap.key);
            }
        });

        presenceRef.on('child_removed', snap => {
            if (user.uid !== snap.key) {
                // remove status from user
                this.addStatusToUser(snap.key, false);
            }
        });
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }

            return acc.concat(user);
        }, []);

        this.setState({
            users: updatedUsers
        });
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    isUserOnline = user => user.status === "online";

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;

        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
    }

    setActiveChannel = userId => {
        this.setState({ activeChannel: userId });
    }

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);

        const channelData = {
            id: channelId,
            name: user.name
        }

        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
        this.setActiveChannel(user.uid);
    }

    displayUsers = users => (
        users?.length > 0 && users.map(user => (
            <li 
                key={user.uid} 
                onClick={() => this.changeChannel(user)}
                active={user.uid === this.state.activeChannel ? this.state.activeChannel : undefined}
                className={user.uid === this.state.activeChannel ? styles.activeChannel : ''}
                >
                @{user.name} 
                <span className={`${styles.statusIcon} ${this.isUserOnline(user) ? styles.green : styles.grey}`}></span>
            </li>
        ))
    )

    render() {

        const { users } = this.state;

        return (
            <div className={styles.directMessages}>
                <div className={styles.usersLength}>
                    <span>
                        Direct Message ({users?.length})
                    </span>
                </div>
                {users?.length > 0 && <ul className={styles.usersList}>{this.displayUsers(users)}</ul>}
            </div>
        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);