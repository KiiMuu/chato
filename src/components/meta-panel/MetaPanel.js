import { Component } from 'react';
import styles from './MetaPanel.module.scss';


class MetaPanel extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel
    }

    render() {

        const { privateChannel } = this.state;

        if (privateChannel) return null;

        return (
            <div className={`${styles.metapanel} p-6`}>
                <div className={styles.metapanelHeader}>
                    <h2>About the channel</h2>
                </div>
                <div className={styles.metapanelContent}>
                    <div className={styles.details}>
                        <h3>Details</h3>
                        <p>some det</p>
                    </div>
                    <div className={styles.topPosters}>
                        <h3>Top posters</h3>
                        <p>some posters</p>
                    </div>
                    <div className={styles.creator}>
                        <h3>createdBy</h3>
                        <p>some creattors</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default MetaPanel;
