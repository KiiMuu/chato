import styles from './ColorPanel.module.scss';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ColorPanel = () => {
    return (
        <div className={styles.colorpanel}>
            <button><FontAwesomeIcon icon={faPlus} /></button>
        </div>
    )
}

export default ColorPanel;
