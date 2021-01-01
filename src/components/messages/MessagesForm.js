import { useRef, useState } from 'react';
import firebase from '../../firebase';
import styles from './Messages.module.scss';
import { useDetectOutsideClicks } from '../../hooks/useDetectOutsideClicks';
import Tooltip from '../layout/tooltip/Tooltip';
import FileModal from './FileModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowRight, 
    faPaperclip, 
    faLocationArrow 
} from '@fortawesome/free-solid-svg-icons';

const MessagesForm = ({ messagesRef, currentChannel, currentUser }) => {

    // options
    const optionsRef = useRef(null);
    const [isOpenOptions, setIsOpenOptions] = useDetectOutsideClicks(optionsRef, false);

    const toggleOptions = () => setIsOpenOptions(!isOpenOptions);

    // messages
    const [values, setValues] = useState({
        msg: '',
        channel: currentChannel,
        user: currentUser
    });

    const { msg, channel, user } = values;

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const createMessage = () => {
        const messageCreation = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            },
            content: msg,
        }

        return messageCreation;
    }

    const sendMessage = e => {
        e.preventDefault();

        if (msg) {
            messagesRef.child(channel.id).push().set(createMessage()).then(() => {
                setValues({
                    ...values,
                    msg: ''
                });
            }).catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <form className={styles.messagesForm}>
            <span className={styles.moreOptionsButton} onClick={toggleOptions}>
                <FontAwesomeIcon icon={faPaperclip} />
                <div 
                    ref={optionsRef}
                    className={`${styles.optionsContent} ${isOpenOptions ? styles.openOptions : ''}`}>
                    <ul>
                        <li>
                            <Tooltip content="Send Photo" direction="right">
                                <FileModal />
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip content="Send Location" direction="right">
                                <FontAwesomeIcon icon={faLocationArrow} />
                            </Tooltip>
                        </li>
                    </ul>
                </div>
            </span>
            <input
                type="text"
                name="msg"
                value={msg}
                placeholder="Type a message"
                autoComplete="off"
                onChange={handleChange}
            />
            <button className={styles.sendButton} onClick={sendMessage}>
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </form>
    )
}

export default MessagesForm;