import { Fragment, useState } from 'react';
import firebase from '../../firebase';
import Dropdown from '../layout/dropdown/Dropdown';
import styles from './SidePanel.module.scss';

const UserPanel = ({ currentUser }) => {

    const [user] = useState(currentUser);

    const handleSignout = () => {
        firebase.auth().signOut().then(() => console.log('Signed out!!'));
    }

    // Dropdown content
    let icon = <Fragment>
        <img 
            className={`${styles.avatar} rounded-full inline border-2 border-light-blue-500 border-opacity-25 shadow-xl`}
            width="30"
            height="30"
            src={user.photoURL}
            alt={user && user.displayName}
            draggable="false"
        />
    </Fragment>;

    let dropdownName = <Fragment>
        <span className={styles.currentUsername}>{user && user.displayName}</span>
    </Fragment>;

    let options = [
        {id: 1, content: <span>Signed in as <strong>{user && user.displayName}</strong></span>},
        {id: 2, content: <span>Change avatar</span>},
        {id: 3, content: <span onClick={handleSignout}>Signout</span>},
    ]

    return (
        <Fragment>
            <div className={styles.userpanelHeader}>
                <h2 className={styles.userpanelHeaderName}>{process.env.REACT_APP_NAME}</h2>
            </div>
            <div className={`${styles.userpanelDropdown} rounded-md`}>
                <Dropdown 
                    dropdownName={dropdownName}
                    icon={icon}
                    items={options}
                    style={{ color: '#eee', padding: '0 1rem' }}
                />
            </div>
        </Fragment>
    )
}

export default UserPanel;
