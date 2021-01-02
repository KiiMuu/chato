import { useState, useEffect } from 'react';
import styles from './Messages.module.scss';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

const Messages = ({ currentChannel, currentUser }) => {

    const [values, setValues] = useState({
        channel: currentChannel,
        user: currentUser,
        messages: [],
        numUniqueUsers: '',
        messagesLoading: false
    });

    const { channel, user, messages, numUniqueUsers, messagesLoading } = values;

    const messagesRef = firebase.database().ref('messages');

    const addMessageListener = channelId => {
        let loadedMessages = [];

        messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());

            const uniqueUsers = loadedMessages.reduce((acc, message) => {
                if (!acc.includes(message.user.name)) {
                    acc.push(message.user.name)
                }
    
                return acc;
            }, []);

            const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    
            const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;

            setValues({
                ...values,
                messages: loadedMessages,
                numUniqueUsers,
                messagesLoading: true
            });
        });
    }

    const addListener = channelId => {
        addMessageListener(channelId);
    }

    useEffect(() => {
        if (channel && user) {
            addListener(channel.id);
        }

        // eslint-disable-next-line
    }, []);

    const displayMessages = messages => {
        return messages?.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp} 
                message={message} 
                user={user}
            />
        ));
    }

    const displayChannelName = channel => channel ? channel.name : '';

    return (
        <div className={styles.mainMsg}>
            <MessagesHeader 
                channelName={displayChannelName(channel)} 
                usersCount={numUniqueUsers}
            />
            <div className={styles.messages}>
                {messagesLoading ? displayMessages(messages) : <span className={styles.loadingMessages}>Loading messages...</span>}
                {/* {displayMessages(messages)} */}
            </div>
            <MessagesForm 
                messagesRef={messagesRef} 
                currentChannel={channel}
                currentUser={user}
            />
        </div>
    )
}

export default Messages;
