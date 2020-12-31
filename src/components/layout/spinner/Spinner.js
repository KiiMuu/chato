import styles from './Spinner.module.scss';

const Spinner = () => {
    return (
        <div className={styles.spinner}>
            <img 
                src='/spinner.gif' 
                width="150" 
                height="150" 
                alt="Loading..." 
                draggable="false" 
            />
        </div>
    )
}

export default Spinner;
