import { useRef, useEffect, useCallback } from 'react';
import { useDetectOutsideClicks } from './useDetectOutsideClicks';

const useModal = () => {
    const modalRef = useRef(null);
    const [isOpenModal, setIsOpenModal] = useDetectOutsideClicks(modalRef, false);

    const handleEscKey = useCallback(e => {
        if (e.keyCode === 27) setIsOpenModal(!isOpenModal);
    }, [isOpenModal, setIsOpenModal]);

    useEffect(() => {
        if (isOpenModal) document.addEventListener('keydown', handleEscKey, false);

        return () => {
            document.removeEventListener('keydown', handleEscKey, false);
        }
    }, [handleEscKey, isOpenModal]);

    const toggleModal = () => setIsOpenModal(!isOpenModal);

    return { isOpenModal, toggleModal, modalRef, handleEscKey };
};

export default useModal;