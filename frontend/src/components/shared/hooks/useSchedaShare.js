import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateSchedaSpese } from "../../../features/schedaSpese/schedaSpeseSlice";

/**
 * Custom hook for managing scheda sharing functionality
 * @param {Object} scheda - The scheda object
 * @param {Function} onRefresh - Callback to refresh data after update
 * @param {Function} onClose - Callback to close the modal
 */
export const useSchedaShare = (scheda, onRefresh, onClose) => {
  const dispatch = useDispatch();

  const [sharedUserUpdateForm, setSharedUserUpdateForm] = useState({
    titolo: scheda.titolo,
    condivisoConList: [],
    removedEmails: [],
  });

  const [isFormModified, setIsFormModified] = useState(false);

  const { condivisoConList } = sharedUserUpdateForm;

  const removeSharedUser = (userMail) => {
    setSharedUserUpdateForm((f) => ({
      ...f,
      removedEmails: [
        ...f.removedEmails,
        { mail: userMail.email, mailId: userMail._id },
      ],
    }));
    setIsFormModified(true);
  };

  const addEmail = (newEmailEntry) => {
    setSharedUserUpdateForm((f) => ({
      ...f,
      condivisoConList: [...f.condivisoConList, newEmailEntry],
    }));
    setIsFormModified(true);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const removeEmail = (email) => {
    setSharedUserUpdateForm((prev) => ({
      ...prev,
      condivisoConList: prev.condivisoConList.filter(
        (entry) => entry.email !== email
      ),
    }));
  };

  const resetForm = () => {
    setSharedUserUpdateForm({
      titolo: scheda.titolo,
      condivisoConList: [],
      removedEmails: [],
    });
    setIsFormModified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatePayload = {
      titolo: sharedUserUpdateForm.titolo,
      condivisoConList: sharedUserUpdateForm.condivisoConList,
      removedEmails: sharedUserUpdateForm.removedEmails,
    };
debugger
    try {
      await dispatch(
        updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })
      ).unwrap();

      if (updatePayload.condivisoConList.length > 0) {
        toast.success(`Scheda "${scheda.titolo}" condivisa con successo!`);
      }
      if (updatePayload.removedEmails.length > 0) {
        toast.success(`Utenti rimossi con successo!`);
      }

      if (onRefresh) {
        await onRefresh();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error(`Error updating shared users: ${error.message}`);
    }
  };

  return {
    condivisoConList,
    isFormModified,
    removeSharedUser,
    addEmail,
    validateEmail,
    removeEmail,
    resetForm,
    handleSubmit,
  };
};

export default useSchedaShare;
