import { Fragment, useState, useRef, useEffect } from 'react';
import firebase from '../../firebase';
import Dropdown from '../layout/dropdown/Dropdown';
import Modal from '../layout/modal/Modal';
import useModal from '../../hooks/useModal';
import styles from './SidePanel.module.scss';
import AvatarEditor from 'react-avatar-editor';

const UserPanel = ({ currentUser }) => {

    let avatarEditor = useRef(null);
    const [values, setValues] = useState({
        user: currentUser,
        previewPhoto: '',
        croppedImage: '',
        blob: '',
        metadata: {
            contentType: 'image/jepg'
        },
        uploadedCropped: ''
    });

    const { user, previewPhoto, croppedImage, blob, metadata, uploadedCropped } = values;

    const { isOpenModal, toggleModal, modalRef, handleEscKey } = useModal();

    const storageRef = firebase.storage().ref();
    const userRef = firebase.auth().currentUser;
    const usersRef = firebase.database().ref('users');

    const handleSignout = () => {
        firebase.auth().signOut().then(() => console.log('Signed out!!'));
    }

    const handleChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                setValues({ ...values, previewPhoto: reader.result });
            });
        }
    }

    const handleCropPhoto = () => {
        if (avatarEditor && previewPhoto) {
            avatarEditor.current.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);

                setValues({
                    ...values,
                    croppedImage: imageUrl,
                    blob
                });
            });
        }
    }

    const handleUploadPhoto = () => {
        storageRef.child(`avatars/user-${userRef.uid}`).put(blob, metadata).then(snap => {
            snap.ref.getDownloadURL().then(downloadUrl => {
                setValues({
                    ...values,
                    uploadedCropped: downloadUrl
                });
            });
        }).catch(err => {
            console.error(err);
        });
    }

    const changeAvatar = () => {
        userRef.updateProfile({
            photoURL: uploadedCropped
        }).then(() => {
            console.log('PhotoURL Updated');
            toggleModal();
        }).catch(err => {
            console.error(err);
        });

        usersRef.child(user.uid).update({
            avatar: uploadedCropped
        }).then(() => {
            console.log('Avatar Updated');
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        if (uploadedCropped) {
            changeAvatar(uploadedCropped);
        }

        // eslint-disable-next-line
    }, [uploadedCropped]);

    // modal content
    const modalContent = (
        <div className={styles.changeAvatar}>
            <div className={styles.changeAvatarContent}>
                <input 
                    type="file" 
                    name="previewPhoto" 
                    onChange={handleChange}
                />
                <div className="px-2">
                    <div className="flex flex-wrap items-stretch -mx-2">
                        <div className={`${styles.avatarEditor} w-full lg:w-2/4`}>
                            {previewPhoto && (
                                <AvatarEditor
                                    ref={avatarEditor}
                                    image={previewPhoto}
                                    width={120}
                                    height={120}
                                    border={20}
                                    scale={1.2} 
                                />
                            )}
                        </div>
                        <div className={`${styles.croppedImage} w-full lg:w-2/4`}>
                            {croppedImage && (
                                <img 
                                    width="120" 
                                    height="120" 
                                    src={croppedImage}
                                    alt="cropped"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.changeAvatarActions}>
                {croppedImage && (<button onClick={handleUploadPhoto}>Save</button>)}
                <button onClick={handleCropPhoto}>Preview</button>
                <button onClick={toggleModal}>Cancel</button>
            </div>
        </div>
    );

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
        {id: 2, content: <Fragment>
            <span 
                onClick={toggleModal}>
                Change avatar
            </span>
            <Modal
                isOpenModal={isOpenModal}
                hide={toggleModal}
                modalRef={modalRef}
                modalContent={modalContent}
                handleEscKey={handleEscKey}
            />
        </Fragment>},
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
