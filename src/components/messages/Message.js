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
            {isPhoto(message) ?
                <div className={styles.msgPhoto}>
                    <img 
                        src={message.photo} 
                        className={styles.imgMsg} 
                        alt={message.user.name} 
                        draggable="false"
                    />
                    <span className={styles.messageDate}>{timeFromNow(message.timestamp)}</span>
                </div> : 
                (<div className={styles.msgContent}>
                    {message.user.id === user.uid ? '' : <span className={styles.userName}>{message.user.name}</span>}
                    <p className={styles.messageText}>{message.content}</p>
                    <span className={styles.messageDate}>{timeFromNow(message.timestamp)}</span>
                </div>)
            }
            {/* <div className={styles.msgContent}>
                {isPhoto(message) ?
                <Fragment>
                    <img 
                        src={message.photo} 
                        className={styles.imgMsg} 
                        alt={message.user.name} 
                    />
                    <span className={styles.messageDate}>{timeFromNow(message.timestamp)}</span>
                </Fragment> :
                (<Fragment>
                    <span className={styles.userName}>{message.user.name}</span>
                    <p className={styles.messageText}>{message.content}</p>
                    <span className={styles.messageDate}>{timeFromNow(message.timestamp)}</span>
                </Fragment>)}
            </div> */}
        </div>
    )
}

export default Message;
