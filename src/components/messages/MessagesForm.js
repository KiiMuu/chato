import { useRef } from 'react';
import styles from './Messages.module.scss';
import { useDetectOutsideClicks } from '../../hooks/useDetectOutsideClicks';
import Tooltip from '../layout/tooltip/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPaperclip, faImage, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const MessagesForm = () => {

    const optionsRef = useRef(null);
    const [isOpenOptions, setIsOpenOptions] = useDetectOutsideClicks(optionsRef, false);

    const toggleOptions = () => setIsOpenOptions(!isOpenOptions);

    return (
        <form className={styles.messagesForm}>
            <span className={styles.moreOptionsButton} onClick={toggleOptions}>
                <FontAwesomeIcon icon={faPaperclip} />
                <div 
                    ref={optionsRef}
                    className={`${styles.optionsContent} ${isOpenOptions ? styles.openOptions : ''}`}>
                    <ul>
                        <li>
                            <Tooltip content="Send Image" direction="right">
                                <FontAwesomeIcon icon={faImage} />
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
                name="message"
                placeholder="Type a message"
                autoComplete="off"
            />
            <button className={styles.sendButton}>
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </form>
    )
}

export default MessagesForm;