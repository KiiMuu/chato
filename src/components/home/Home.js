import { connect } from 'react-redux';
import styles from './Home.module.scss';

// components
import ColorPanel from '../color-panel/ColorPanel';
import SidePanel from '../side-panel/SidePanel';
import Messages from '../messages/Messages';
// import MetaPanel from '../meta-panel/MetaPanel';

const Home = ({ currentUser }) => {
    return (
        <div className={styles.home}>
            <div className="flex flex-wrap">
                <div className="flex-initial"><ColorPanel /></div>
                <div className="w-full lg:w-1/5">
                    <SidePanel currentUser={currentUser} />
                </div>
                <div className="w-full lg:w-3/5"><Messages /></div>
                {/* <div className="w-full lg:w-1/5"><MetaPanel /></div> */}
            </div>
        </div>
    )
}

const mapStateToProps = ({ user }) => ({
    currentUser: user.currentUser
});

export default connect(mapStateToProps)(Home);
