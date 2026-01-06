import { useState } from "react";

/**
 * Custom hook for managing modal states
 * @param {Object} initialState - Initial modal state object
 */
export const useModalState = (initialState = {}) => {
  const [modalState, setModalState] = useState({
    creaNotaModal: false,
    shareModal: false,
    deleteModal: false,
    deleteNotaModal: false,
    editNotaModal: false,
    ...initialState,
  });

  const handleShow = (modalType) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalType]: true,
    }));
  };

  const handleClose = (modalType) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalType]: false,
    }));
  };

  return {
    modalState,
    handleShow,
    handleClose,
  };
};

export default useModalState;
