import styles from './Messages.module.scss';
import Tooltip from '../layout/tooltip/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar } from '@fortawesome/free-solid-svg-icons';

const MessagesHeader = ({ channelName, usersCount, handleSearhcChange, isPrivateChannel, handleStarred, isChannelStarred }) => {

    const showStar = () => (
        <Tooltip content={isChannelStarred ? 'Unstar channle' : 'Star channel'} direction="right">
            <span onClick={handleStarred} className={styles.star}>
                <FontAwesomeIcon icon={faStar} className={isChannelStarred ? styles.unstarred : styles.starred} />
            </span>
        </Tooltip>
    );

    return (
        <div className={styles.messagesHeader}>
            <div className={styles.messagesHeaderContent}>
                <h2>{channelName} {!isPrivateChannel ? showStar() : ''}</h2>
                <div className={styles.subMessagesHeader}>
                    {!isPrivateChannel ? <span>{usersCount}</span> : ''}
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
                    onChange={handleSearhcChange}
                />
            </div>
        </div>
    )
}

export default MessagesHeader
