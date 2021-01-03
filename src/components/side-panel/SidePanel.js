import styles from './SidePanel.module.scss';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';

const SidePanel = ({ currentUser }) => {
    return (
        <div className={`${styles.sidepanel} p-6`}>
            <UserPanel 
                key={currentUser && currentUser.uid} 
                currentUser={currentUser} 
            />
            <Channels currentUser={currentUser} />
            <DirectMessages currentUser={currentUser} />
        </div>
    )
}

export default SidePanel;
