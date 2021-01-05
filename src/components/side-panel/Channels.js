import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';
import styles from './SidePanel.module.scss';
import Modal from '../layout/modal/Modal';
import useModal from '../../hooks/useModal';
import Tooltip from '../layout/tooltip/Tooltip';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Channels = ({ currentUser, setCurrentChannel, setPrivateChannel }) => {

    const { isOpenModal, toggleModal, modalRef, handleEscKey } = useModal();
    const [channels, setChannels] = useState({
        activeChannel: '',
        allChannels: [],
        channelName: '',
        channelDetails: '',
        firstLoaded: true
    });

    const { activeChannel, allChannels, channelName, channelDetails, firstLoaded } = channels;

    const channelsRef = firebase.database().ref('channels');

    const handleChange = e => {
        setChannels({
            ...channels,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (isFormValid(channelName, channelDetails)) {
            addChannel();
        }
    }

    const isFormValid = (channelName, channelDetails) => channelName && channelDetails;

    const addChannel = () => {
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            }
        }

        channelsRef.child(key).update(newChannel).then(() => {
            setChannels({
                ...channels,
                channelName: '',
                channelDetails: ''
            });

            toggleModal();
        }).catch(err => {
            console.log(err);
        });
    }

    const addListeners = () => {
        let loadedChannels = [];

        channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());

            setChannels({
                ...channels,
                allChannels: loadedChannels
            });
        });
    }

    const setFirstChannel = () => {
        const firstChannel = allChannels[0];

        if (firstLoaded &&  allChannels?.length > 0) {
            setCurrentChannel(firstChannel);
            setActiveChannel(firstChannel);
        }

        setChannels({
            ...channels,
            firstLoaded: false
        });
    }

    const removeListeners = () => {
        return () => {
            channelsRef.off();
        }
    }

    useEffect(() => {
        addListeners();
        setFirstChannel();
        removeListeners();

        return () => {}
        // eslint-disable-next-line
    }, [firstLoaded]);


    const changeChannel = channel => {
        setActiveChannel(channel);
        setCurrentChannel(channel);
        setPrivateChannel(false);

        setChannels({
            ...channels,
            channel
        });
    }

    const setActiveChannel = channel => {
        setChannels({
            ...channels,
            activeChannel: channel.id
        });
    }

    const displayChannels = allChannels => (
        allChannels?.length > 0 && allChannels.map(channel => (
            <li 
                key={channel.id}
                onClick={() => changeChannel(channel)}
                active={channel.id === activeChannel ? activeChannel : undefined}
                className={channel.id === activeChannel ? styles.activeChannel : ''}
            >{channel.name}</li>
        ))
    );

    // modal content
    const modalContent = (
        <div className={styles.addChannel}>
            <div className={styles.addChannelHeader}>
                <h2>Add a Channel</h2>
            </div>
            <div className={styles.addChannelContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.addChannelFields}>
                        <div className="flex flex-wrap">
                            <div className="w-full mb-4">
                                <div className={styles.addChannelField}>
                                    <input 
                                        type="text"
                                        className=""
                                        name="channelName" 
                                        placeholder="Add channel name" 
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <div className={styles.addChannelField}>
                                    <input 
                                        type="text"
                                        name="channelDetails" 
                                        placeholder="About the channel" 
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.channelActions}>
                        <button onClick={handleSubmit}>Add</button>
                        <button onClick={toggleModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
    return (
        <div className={styles.channels}>
            <div className={styles.channelsLength}>
                <span>
                    Channels ({allChannels?.length})
                </span>
                <span>
                    <Tooltip content="Add new channel" direction="right">
                        <button 
                            className={styles.modalTrigger} 
                            onClick={toggleModal}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </Tooltip>
                    <Modal
                        isOpenModal={isOpenModal}
                        hide={toggleModal}
                        modalRef={modalRef}
                        modalContent={modalContent}
                        handleEscKey={handleEscKey}
                    />
                </span>
            </div>
            {allChannels?.length > 0 && <ul className={styles.channelsList}>{displayChannels(allChannels)}</ul>}
        </div>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);