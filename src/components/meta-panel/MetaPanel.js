import { Component, Fragment } from 'react';
import styles from './MetaPanel.module.scss';


class MetaPanel extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        channel: this.props.currentChannel
    }

    render() {

        const { privateChannel, channel } = this.state;

        if (privateChannel) return null;

        return (
            <div className={`${styles.metapanel} p-6`}>
                {!channel ? 'Loading' : (
                    <Fragment>
                        <div className={styles.metapanelHeader}>
                            <h2>About `{channel?.name}`</h2>
                        </div>
                        <div className={styles.metapanelContent}>
                            <div className={styles.details}>
                                <h3>Details</h3>
                                <p>{channel?.details}</p>
                            </div>
                            <div className={styles.topPosters}>
                                <h3>Top posters</h3>
                                <p>some posters</p>
                            </div>
                            <div className={styles.creator}>
                                <h3>Created by</h3>
                                <p>{channel?.createdBy.name}</p>
                                <img 
                                    src={channel.createdBy.avatar} 
                                    className={styles.avatar} 
                                    alt={channel?.createdBy.name} 
                                    draggable="false"
                                />
                            </div>
                        </div>
                    </Fragment>
                )}
            </div>
        )
    }
}

export default MetaPanel;
