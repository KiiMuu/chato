import { useState } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import styles from './SidePanel.module.scss';

const StarredChannels = ({ setCurrentChannel, setPrivateChannel }) => {

    const [values, setValues] = useState({
        activeChannel: '',
        starredChannels: []
    });

    const { activeChannel, starredChannels } = values;

    const setActiveChannel = channel => {
        setValues({
            ...values,
            activeChannel: channel.id
        });
    }

    const changeChannel = channel => {
        setActiveChannel(channel);
        setCurrentChannel(channel);
        setPrivateChannel(false);
    }

    const displayStarredChannels = starredChannels => (
        starredChannels?.length > 0 && starredChannels.map(starredCh => (
            <li 
                key={starredCh.id}
                onClick={() => changeChannel(starredCh)}
                active={starredCh.id === activeChannel}
                className={starredCh.id === activeChannel ? styles.activeChannel : ''}
            >{starredCh.name}</li>
        ))
    );

    return (
        <div className={styles.starredChannels}>
            <div className={styles.starredLength}>
                <span>
                    Starred ({starredChannels?.length})
                </span>
            </div>
            {starredChannels?.length > 0 && <ul className={styles.starredList}>{displayStarredChannels(starredChannels)}</ul>}
        </div>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(StarredChannels);
