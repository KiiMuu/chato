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
        searchTerm: '',
        searchResults: [],
        searchLoading: false,
        messagesLoading: true
    });

    const { channel, user, messages, numUniqueUsers, searchTerm, searchResults, searchLoading, messagesLoading } = values;

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
                messagesLoading: false
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

    const handleSearhcMessages = () => {
        const channelMessages = [...messages];
        const regex = new RegExp(searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }

            return acc;
        }, []);

        setValues({
            ...values,
            searchResults,
            searchLoading: false
        });
    }

    const handleSearhcChange = e => {
        setValues({
            ...values,
            searchTerm: e.target.value,
            searchLoading: true
        });
    }

    useEffect(() => {
        if (searchTerm) {
            handleSearhcMessages();
        }

        // eslint-disable-next-line
    }, [searchTerm]);

    const messagesAndResults = () => {
        if (searchTerm) {
            if (searchLoading) {
                return <span className={styles.loadingMessages}>Loading results...</span>;
            } else if (searchResults.length === 0) {
                return <span className={styles.loadingMessages}>No results found</span>;
            } else {
                return displayMessages(searchResults)
            }
        } else {
            if (messagesLoading) {
                return <span className={styles.loadingMessages}>Loading messages...</span>;
            } else if (messages.length === 0) {
                return <span className={styles.loadingMessages}>No messages</span>;
            } else {
                return displayMessages(messages);
            }
        }
    }

    return (
        <div className={styles.mainMsg}>
            <MessagesHeader 
                channelName={displayChannelName(channel)} 
                usersCount={numUniqueUsers}
                handleSearhcChange={handleSearhcChange}
            />
            <div className={styles.messages}>
                {messagesAndResults()}
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
