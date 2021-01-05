import { Component } from 'react';
import styles from './Messages.module.scss';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

class Messages extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        numUniqueUsers: '',
        searchTerm: '',
        searchResults: [],
        searchLoading: false,
        messagesLoading: true,
        isChannelStarred: false,
        messagesRef: firebase.database().ref('messages'),
        privateMessagesRef: firebase.database().ref('privateMessages'),
        usersRef: firebase.database().ref('users')
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();

        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());

            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });

            this.countUniqueUsers(loadedMessages);
        });
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }

            return acc;
        }, []);

        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;

        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;

        this.setState({ numUniqueUsers });
    };

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;

        return privateChannel ? privateMessagesRef : messagesRef;
    }

    addListener = channelId => {
        this.addMessageListener(channelId);
    }

    addUserStars = (channelId, userId) => {
        this.state.usersRef.child(userId).child('starred').once('value').then(data => {
            if (data.val() !== null) {
                const channelIds = Object.keys(data.val());
                const prevStarred = channelIds.includes(channelId);

                this.setState({
                    isChannelStarred: prevStarred
                });
            }
        });
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListener(channel.id);
            this.addUserStars(channel.id, user.uid);
        }
    }

    displayMessages = messages => {
        const { user } = this.state;

        return messages?.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp} 
                message={message} 
                user={user}
            />
        ));
    }

    displayChannelName = channel => {
        const { privateChannel } = this.state;

        return channel ? `${privateChannel ? '@' : ''}${channel.name}` : '';
    }

    handleStarred = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    }

    starChannel = () => {
        const { isChannelStarred, usersRef, channel, user } = this.state;

        if (isChannelStarred) {
            usersRef.child(`${user.uid}/starred`).update({
                [channel.id]: {
                    name: channel.name,
                    details: channel.details,
                    createdBy: {
                        name: channel.createdBy.name,
                        avatar: channel.createdBy.avatar,
                    }
                }
            });
        } else {
            usersRef.child(`${user.uid}/starred`).child(channel.id).remove(err => {
                if (err !== null) {
                    console.error(err);
                }
            });
        }
    }



    handleSearhcMessages = () => {
        const { searchTerm, messages } = this.state;

        const channelMessages = [...messages];
        const regex = new RegExp(searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }

            return acc;
        }, []);

        this.setState({
            searchResults,
            searchLoading: false
        });
    }

    handleSearhcChange = e => {        
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true
        }, () => this.handleSearhcMessages());
    }

    messagesAndResults = () => {
        const { messages, searchTerm, searchResults, searchLoading, messagesLoading } = this.state;

        if (searchTerm) {
            if (searchLoading) {
                return <span className={styles.loadingMessages}>Loading results...</span>;
            } else if (searchResults.length === 0) {
                return <span className={styles.loadingMessages}>No results found</span>;
            } else {
                return this.displayMessages(searchResults)
            }
        } else {
            if (messagesLoading) {
                return <span className={styles.loadingMessages}>Loading messages...</span>;
            } else if (messages.length === 0) {
                return <span className={styles.loadingMessages}>No messages</span>;
            } else {
                return this.displayMessages(messages);
            }
        }
    }

    render() {

        const { privateChannel, channel, numUniqueUsers, user, isChannelStarred } = this.state;

        return (
            <div className={styles.mainMsg}>
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)} 
                    usersCount={numUniqueUsers}
                    handleSearhcChange={this.handleSearhcChange}
                    isPrivateChannel={privateChannel}
                    handleStarred={this.handleStarred}
                    isChannelStarred={isChannelStarred}
                />
                <div className={styles.messages}>
                    {this.messagesAndResults()}
                </div>
                <MessagesForm 
                    messagesRef={this.messagesRef} 
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </div>
        )
    }
}

export default Messages;
