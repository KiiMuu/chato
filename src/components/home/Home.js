import { connect } from 'react-redux';
import styles from './Home.module.scss';

// components
import SidePanel from '../side-panel/SidePanel';
import Messages from '../messages/Messages';
import MetaPanel from '../meta-panel/MetaPanel';

const Home = ({ currentUser, currentChannel, isPrivateChannel, userMessages }) => {
    return (
        <div className={styles.home}>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/6">
                    <SidePanel currentUser={currentUser} />
                </div>
                <div className="w-full lg:w-4/6">
                    <Messages
                        key={currentChannel && currentChannel.id}
                        currentChannel={currentChannel}
                        currentUser={currentUser}
                        isPrivateChannel={isPrivateChannel}
                    />
                </div>
                <div className="w-full lg:w-1/6">
                    <MetaPanel
                        key={currentChannel?.id}
                        isPrivateChannel={isPrivateChannel}
                        currentChannel={currentChannel}
                        userMessages={userMessages}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ user, channel }) => ({
    currentUser: user.currentUser,
    currentChannel: channel.currentChannel,
    isPrivateChannel: channel.isPrivateChannel,
    userMessages: channel.userMessages
});

export default connect(mapStateToProps)(Home);
