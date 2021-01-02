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
        messagesLoading: false
    });

    const { channel, user, messages, messagesLoading } = values;

    const messagesRef = firebase.database().ref('messages');

    const addMessageListener = channelId => {
        let loadedMessages = [];

        messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());

            setValues({
                ...values,
                messages: loadedMessages,
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
        return messages && messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp} 
                message={message} 
                user={user}
            />
        ));
    }

    return (
        <div className={styles.mainMsg}>
            <MessagesHeader />
            <div className={styles.messages}>
                {messagesLoading ? displayMessages(messages) : <span className={styles.loadingMessages}>Loading messages...</span>}
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
