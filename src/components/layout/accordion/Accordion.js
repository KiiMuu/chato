import { useRef, useState } from 'react';
import { useDetectOutsideClicks } from '../../../hooks/useDetectOutsideClicks';
import styles from './Accordion.module.scss';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Accordion = ({ title, children }) => {

    const accordionRef = useRef(null);
    const [isAccOpen, setIsAccOpen] = useDetectOutsideClicks(accordionRef, false);
    const [accHeight, setAccHeight] = useState('0');

    const handleAccordionClick = () => {
        setIsAccOpen(!isAccOpen);
        setAccHeight(isAccOpen ? '0' : `${accordionRef.current.scrollHeight}px`);
    }

    return (
        <div className={styles.accordion}>
            <button className={styles.accButton} onClick={handleAccordionClick}>
                <span className={styles.accTitle}>{title}</span>
                {isAccOpen ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />}
            </button>
            <div ref={accordionRef} style={{ maxHeight: accHeight }}>
                <div className={styles.accordionContent}>{children}</div>
            </div>
        </div>
    )
}

export default Accordion;
