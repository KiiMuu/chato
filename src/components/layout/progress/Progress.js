import styles from './Progress.module.scss';

const Range = props => {
    return (
        <div className={styles.range} style={{width: `${props.percentage}%`}} />
    )
}

const Progress = props => {
    return (
        <div className={styles.barContainer}>
            <div className={styles.progressBar}>
                <Range percentage={props.percentage} />
            </div>
        </div>
    )
}

export default Progress;
