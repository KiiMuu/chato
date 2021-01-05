import { Component, Fragment } from 'react';
import styles from './MetaPanel.module.scss';


class MetaPanel extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        channel: this.props.currentChannel,
    }

    formatCount = count => (count === 0 || count > 1) ? `${count} messages` : `${count} message`;

    showTopPosters = userMessages => {
        return Object.entries(userMessages).sort((a, b) => b[1] - a[1]).map(([key, val, i]) => {
            return (
                <li key={i} className={styles.poster}>
                    <img 
                        src={val.avatar} 
                        className={styles.avatar} 
                        alt={val.name} 
                        draggable="false"
                    />
                    <div className={styles.userInfo}>
                        <span>{key}</span>
                        <p>{this.formatCount(val.count)}</p>
                    </div>
                </li>
            )
        }).slice(0, 5); // get 5 top posters
    }

    render() {

        const { privateChannel, channel } = this.state;
        const { userMessages } = this.props;

        if (privateChannel) return null;

        return (
            <div className={`${styles.metapanel} p-6`}>
                {!channel ? 'Loading' : (
                    <Fragment>
                        <div className={styles.metapanelHeader}>
                            <h2>{channel?.name}</h2>
                        </div>
                        <div className={styles.metapanelContent}>
                            <div className={styles.details}>
                                <h3>Description</h3>
                                <p>{channel?.details}</p>
                            </div>
                            <div className={styles.topPosters}>
                                <h3>Top posters</h3>
                                <ul className={styles.posters}>{userMessages && this.showTopPosters(userMessages)}</ul>
                            </div>
                            <div className={styles.creator}>
                                <h3>Created by</h3>
                                <img 
                                    src={channel.createdBy.avatar} 
                                    className={styles.avatar} 
                                    alt={channel?.createdBy.name} 
                                    draggable="false"
                                />
                                <p>{channel?.createdBy.name}</p>
                            </div>
                        </div>
                    </Fragment>
                )}
            </div>
        )
    }
}

export default MetaPanel;
