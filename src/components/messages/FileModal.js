import { Fragment, useState } from 'react';
import mime from 'mime-types';
import styles from './Messages.module.scss';
import Modal from '../layout/modal/Modal';
import useModal from '../../hooks/useModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faImage, 
} from '@fortawesome/free-solid-svg-icons';

const FileModal = ({ uploadPhoto }) => {

    const { isOpenModal, toggleModal, modalRef, handleEscKey } = useModal();

    const [values, setValues] = useState({
        file: null,
        authorized: ['image/jpeg', 'image/png']
    });

    const { file, authorized } = values;

    const addPhoto = e => {
        const file = e.target.files[0];
        
        if (file) {
            setValues({
                ...values,
                file
            });
        }
    }

    const isAuthorized = filename => authorized.includes(mime.lookup(filename));

    const clearPhoto = () => setValues({ ...values, file: null });

    const sendPhoto = () => {
        if (file !== null) {
            if (isAuthorized(file.name)) {
                const metadata = {
                    contentType: mime.lookup(file.name)
                }

                uploadPhoto(file, metadata);
                toggleModal();
                clearPhoto();
            }
        }
    }

    // modal content
    const modalContent = (
        <div className={styles.addPhoto}>
            <div className={styles.addPhotoHeader}>
                <h2>Add a new photo</h2>
            </div>
            <div className={styles.addPhotoContent}>
                <input
                    name="photo"
                    type="file" 
                    onChange={addPhoto}
                />
                <div className={styles.photoActions}>
                    <button onClick={sendPhoto}>Send</button>
                    <button onClick={toggleModal}>Cancel</button>
                </div>
            </div>
        </div>
    );

    return (
        <Fragment>
            <span 
                className={styles.modalTrigger}
                onClick={toggleModal}>
                <FontAwesomeIcon icon={faImage} />
            </span>
            <Modal
                isOpenModal={isOpenModal}
                hide={toggleModal}
                modalRef={modalRef}
                modalContent={modalContent}
                handleEscKey={handleEscKey}
            />
        </Fragment>
    )
}

export default FileModal;
