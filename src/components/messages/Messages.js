import styles from './Messages.module.scss';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';

const Messages = () => {
    return (
        <div className={styles.mainMsg}>
            <MessagesHeader />
            <div className={styles.messages}>Messages</div>
            <MessagesForm />
        </div>
    )
}

export default Messages;
