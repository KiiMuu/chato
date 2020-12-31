import styles from './Messages.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const MessagesHeader = () => {
    return (
        <div className={styles.messagesHeader}>
            <div className={styles.test}>
                <h2>Channel</h2>
                <div className={styles.subMessagesHeader}>
                    <span>2 users</span>
                </div>
            </div>
            <div className={styles.searchMessages}>
                <span>
                    <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Search Messages"
                />
            </div>
        </div>
    )
}

export default MessagesHeader
