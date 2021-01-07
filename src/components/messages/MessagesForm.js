import { useRef, useState } from 'react';
import firebase from '../../firebase';
import { v4 as uuidv4  } from 'uuid';
import styles from './Messages.module.scss';
import { useDetectOutsideClicks } from '../../hooks/useDetectOutsideClicks';
import Tooltip from '../layout/tooltip/Tooltip';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowRight, 
    faPaperclip, 
    faLocationArrow, 
    faLaughBeam,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

const MessagesForm = ({ currentChannel, currentUser, isPrivateChannel, getMessagesRef }) => {

    // options
    const optionsRef = useRef(null);
    const [isOpenOptions, setIsOpenOptions] = useDetectOutsideClicks(optionsRef, false);

    const toggleOptions = () => setIsOpenOptions(!isOpenOptions);

    // messages
    let msgInRef = useRef(null);
    const [values, setValues] = useState({
        msg: '',
        channel: currentChannel,
        user: currentUser,
        uploadState: '',
        percentUploaded: 0,
        storageRef: firebase.storage().ref(),
        errors: [],
        emojiPicker: false,
    });

    const { msg, channel, user, uploadState, percentUploaded, storageRef, errors, emojiPicker } = values;

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

    const handleEmojiPicker = () => {
        setValues({
            ...values,
            emojiPicker: !emojiPicker
        });
    }

    const handleAddEmoji = emoji => {
        const oldMessage = msg;
        const newMessage = colonToUnicode(` ${oldMessage}${emoji.colons} `);

        setValues({ 
            ...values,
            msg: newMessage,
            emojiPicker: false
        });

        setTimeout(() => msgInRef.current.focus(), 0);
    }

    const colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if (typeof emoji !== "undefined") {
                let unicode = emoji.native;
                if (typeof unicode !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        });
    };

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
            <div className={styles.emojiPicker}>
                {emojiPicker && (
                    <Picker
                        set="apple"
                        title="Pick an emoji"
                        emoji="point_up"
                        onSelect={handleAddEmoji}
                    />
                )}
            </div>
            <ProgressBar
                uploadState={uploadState}
                percentUploaded={percentUploaded}
            />
            <span className={styles.moreOptionsButton}>
                <FontAwesomeIcon 
                    icon={faPaperclip} 
                    onClick={toggleOptions} 
                    className={styles.faPaperclipIcon}
                />
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
                <span className={styles.emoji} onClick={handleEmojiPicker}>
                    <FontAwesomeIcon icon={emojiPicker ? faTimes : faLaughBeam} />
                </span>
            </span>
            <input
                type="text"
                name="msg"
                value={msg}
                placeholder="Type a message"
                autoComplete="off"
                onChange={handleChange}
                onKeyDown={handleTyping}
                ref={msgInRef}
            />
            <button className={styles.sendButton} onClick={sendMessage}>
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </form>
    )
}

export default MessagesForm;