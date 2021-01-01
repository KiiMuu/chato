import { Fragment } from 'react';
import styles from './Messages.module.scss';

import Modal from '../layout/modal/Modal';
import useModal from '../../hooks/useModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faImage, 
} from '@fortawesome/free-solid-svg-icons';

const FileModal = () => {

    const { isOpenModal, toggleModal, modalRef, handleEscKey } = useModal();

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
                />
                <div className={styles.photoActions}>
                    <button>Send</button>
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
