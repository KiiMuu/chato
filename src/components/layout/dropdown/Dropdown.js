import { useRef } from 'react';
import styles from './Dropdown.module.scss';
import { useDetectOutsideClicks } from '../../../hooks/useDetectOutsideClicks';

const Dropdown = props => {
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useDetectOutsideClicks(dropdownRef, false);

    const handleDropdownClick = () => setIsOpen(!isOpen);

    const { dropdownName, items, icon, style } = props;

    const options = items.map(item => (
        <li key={item.id} className={styles.dropdownListItem}>{item.content}</li>
    ));

    return (
        <div className={styles.dropdown}>
            <button onClick={handleDropdownClick} className={styles.dropdownTrigger} style={style}>
                {dropdownName} <span className={styles.dropdownTriggerIcon}>{icon}</span>
            </button>
            <nav
                ref={dropdownRef} 
                className={`${styles.dropdownList} ${isOpen ? styles.open : ''} rounded-md`}>
                <ul className='list-none'>
                    {options}
                </ul>
            </nav>
        </div>
    )
}

export default Dropdown;
