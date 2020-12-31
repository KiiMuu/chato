import { useState } from 'react';
import styles from './Tooltip.module.scss';

const Tooltip = props => {
    let timeOut;
    const [isTooltipActive, setIsTooltipActive] = useState(false);

    const showTooltip = () => {
        timeOut = setTimeout(() => {
            setIsTooltipActive(true);
        }, 150);
    }

    const hideTooltip = () => {
        clearInterval(timeOut);
        setIsTooltipActive(false);
    }

    return (
        <div 
            className={styles.tooltip}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {props.children}
            {isTooltipActive && (
                // pass dynamic className as props in CSS Modules => ${styles[props.direction]}
                <div className={`${styles.tooltipTip} ${styles[props.direction]}`}>
                    {props.content}
                </div>
            )}
        </div>
    )
}

export default Tooltip;
