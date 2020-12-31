import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = props => {

    const { isOpenModal, hide, modalRef, modalContent } = props;

    return ReactDOM.createPortal(
        isOpenModal ? <div className={`${styles.modal}`}>
            <div
                ref={modalRef}
                className={`${styles.modalContent} ${isOpenModal ? styles.open : ''} rounded-md`}>
                <button 
                    className={styles.closeBtn} 
                    onClick={hide}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                {modalContent}
            </div>
        </div> : null,
        document.querySelector('#modal')
    );
}

export default Modal;