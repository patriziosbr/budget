import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateSchedaSpese } from "../../../features/schedaSpese/schedaSpeseSlice";

/**
 * Custom hook for managing scheda title editing
 * @param {Object} scheda - The scheda object
 * @param {Function} onRefresh - Callback to refresh data after update
 */
export const useTitleEdit = (scheda, onRefresh) => {
  const dispatch = useDispatch();
  const [longPressCount, setlongPressCount] = useState(0);
  const [formData, setFormData] = useState({ titolo: scheda.titolo });
  const [erroLength, setErroLength] = useState(false);

  const { titolo } = formData;

  const isEditing = longPressCount > 0;

  const onLongPress = () => {
    setlongPressCount(longPressCount + 1);
  };

  const onChange = (e) => {
    if (e.target.value.length > 20) {
      setErroLength(true);
      return;
    } else {
      setErroLength(false);
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const cancelEdit = () => {
    setlongPressCount(longPressCount - 1);
    setFormData({ titolo: scheda.titolo });
  };

  const updateSchedataTitolo = async () => {
    const updatePayload = { titolo: titolo };
    if (scheda.titolo === titolo) {
      setlongPressCount(0);
      return;
    }
    try {
      await dispatch(
        updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })
      ).unwrap();
      if (onRefresh) {
        await onRefresh();
      }
      toast.success("Title update success");
    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.message || "Error while update scheda title");
    } finally {
      setlongPressCount(0);
    }
  };

  return {
    titolo,
    erroLength,
    isEditing,
    onLongPress,
    onChange,
    cancelEdit,
    updateSchedataTitolo,
  };
};

export default useTitleEdit;
