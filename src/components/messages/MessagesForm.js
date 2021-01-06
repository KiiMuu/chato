import { useRef, useState } from 'react';
import firebase from '../../firebase';
import { v4 as uuidv4  } from 'uuid';
import styles from './Messages.module.scss';
import { useDetectOutsideClicks } from '../../hooks/useDetectOutsideClicks';
import Tooltip from '../layout/tooltip/Tooltip';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowRight, 
    faPaperclip, 
    faLocationArrow 
} from '@fortawesome/free-solid-svg-icons';

const MessagesForm = ({ messagesRef, currentChannel, currentUser, isPrivateChannel, getMessagesRef }) => {

    // options
    const optionsRef = useRef(null);
    const [isOpenOptions, setIsOpenOptions] = useDetectOutsideClicks(optionsRef, false);

    const toggleOptions = () => setIsOpenOptions(!isOpenOptions);

    // messages
    const [values, setValues] = useState({
        msg: '',
        channel: currentChannel,
        user: currentUser,
        uploadState: '',
        percentUploaded: 0,
        storageRef: firebase.storage().ref(),
        errors: []
    });

    const { msg, channel, user, uploadState, percentUploaded, storageRef, errors } = values;

    const typingRef = firebase.database().ref('typing');

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const handleTyping = e => {
        if (msg) {
            typingRef.child(channel.id).child(user.uid).set(user.displayName);
        } else {
            typingRef.child(channel.id).child(user.uid).remove();
        }
    }

    const createMessage = (fileUrl = null) => {
        const messageCreation = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        if (fileUrl !== null) {
            messageCreation['photo'] = fileUrl;
        } else {
            messageCreation['content'] = msg;
        }

        return messageCreation;
    }

    const sendMessage = e => {
        e.preventDefault();

        if (msg) {
            getMessagesRef().child(channel.id).push().set(createMessage()).then(() => {
                setValues({
                    ...values,
                    msg: ''
                });

                typingRef.child(channel.id).child(user.uid).remove();
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const getPath = () => {
        if (isPrivateChannel) {
            return `chat/private-${channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    const uploadPhoto = (file, metadata) => {
        const pathToUpload = channel.id;
        const ref = getMessagesRef();
        const filePath = `${getPath()}/${uuidv4()}.jpg`;

        setValues({
            ...values,
            uploadState: 'Uploading',
        });

        storageRef.child(filePath).put(file, metadata).on('state_changed', snap => {
            const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);

            setValues({
                ...values,
                percentUploaded,
                uploadState: 'Uploading'
            });
        }, err => {
            console.error(err);
            
            setValues({
                ...values,
                errors: errors.concat(err),
                uploadState: 'error'
            });
        }, () => {
            storageRef.child(filePath).put(file, metadata).snapshot.ref.getDownloadURL().then(downloadUrl => {
                sendFileMessage(downloadUrl, ref, pathToUpload);
            }).catch(err => {
                console.error(err);
            
                setValues({
                    ...values,
                    errors: errors.concat(err),
                    uploadState: 'error',
                });
            })
        });
    }

    const sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload).push().set(createMessage(fileUrl)).then(() => {
            setValues({
                ...values,
                uploadState: 'Done'
            });
        }).catch(err => {
            console.error(err);

            setValues({
                ...values,
                errors: errors.concat(err)
            });
        });
    }

    return (
        <form className={styles.messagesForm}>
            <ProgressBar
                uploadState={uploadState}
                percentUploaded={percentUploaded}
            />
            <span className={styles.moreOptionsButton} onClick={toggleOptions}>
                <FontAwesomeIcon icon={faPaperclip} />
                <div 
                    ref={optionsRef}
                    className={`${styles.optionsContent} ${isOpenOptions ? styles.openOptions : ''}`}>
                    <ul>
                        <li>
                            <Tooltip content="Send Photo" direction="right">
                                <FileModal uploadPhoto={uploadPhoto} />
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip content="Send Location" direction="right">
                                <FontAwesomeIcon icon={faLocationArrow} />
                            </Tooltip>
                        </li>
                    </ul>
                </div>
            </span>
            <input
                type="text"
                name="msg"
                value={msg}
                placeholder="Type a message"
                autoComplete="off"
                onChange={handleChange}
                onKeyDown={handleTyping}
            />
            <button className={styles.sendButton} onClick={sendMessage}>
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </form>
    )
}

export default MessagesForm;