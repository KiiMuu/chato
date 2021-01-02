import { Fragment } from 'react';
import styles from './Messages.module.scss';
import moment from 'moment';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? styles.messageSelf : styles.messageYours;
}

const timeFromNow = timestamp => moment(timestamp).calendar();

const isPhoto = msg => {
    return msg.hasOwnProperty('photo') && !msg.hasOwnProperty('content');
}

const Message = ({ message, user }) => {
    return (
        <div className={`${styles.message} ${isOwnMessage(message, user)}`}>
            <img
                src={message.user.avatar} 
                alt={message.user.name}
                className={styles.userAvatar}
                draggable="false" 
            />
            <div className={styles.msgContent}>
                {isPhoto(message) ?
                <img 
                    src={message.photo} 
                    className={styles.imgMsg} 
                    alt={message.user.name} 
                /> : 
                (<Fragment>
                    <span className={styles.userName}>{message.user.name}</span>
                    <p className={styles.messageText}>{message.content}</p>
                    <span className={styles.messageDate}>{timeFromNow(message.timestamp)}</span>
                </Fragment>)}
            </div>
        </div>
    )
}

export default Message;