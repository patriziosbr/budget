import { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import NotaSpeseFormAllNote from "./NotaSpeseFormAllNote";
import {
  SchedaHeader,
  NotaSpesaItem,
  ExpensesSummary,
  ShareModal,
  DeleteConfirmModal,
  useExpencers,
  useSchedaShare,
  useModalState,
  useTitleEdit,
} from "./shared";

// Redux actions
import {
  deleteSchedaSpese,
  singleSchedaSpeseGet,
} from "../features/schedaSpese/schedaSpeseSlice";
import { deleteNotaSpese } from "../features/notaSpese/notaSpeseSlice";
import { getUserById } from "../features/auth/authSlice";

/**
 * SortButton - Reusable sort button component for the ordering functionality
 */
const SortButton = ({ label, orderKey, orderState, onClick, disabled }) => {
  const isActive = orderState[orderKey] === "asc" || orderState[orderKey] === "desc";
  
  return (
    <button
      role="button"
      className={`btn btn-round d-flex align-items-center badge bg-light me-2 mb-2 px-3 border ${
        isActive ? "border-2" : ""
      }`}
      style={{ fontSize: "0.7rem" }}
      onClick={() => onClick(orderKey)}
      disabled={disabled}
    >
      <p className="sm m-0 me-2 form-label">{label}</p>
      <div className="d-flex flex-column">
        <FaCaretUp
          className={`${
            orderState[orderKey] === "desc"
              ? "text-black"
              : "text-secondary"
          }`}
        />
        <FaCaretDown
          className={`${
            orderState[orderKey] === "asc"
              ? "text-black"
              : "text-secondary"
          }`}
        />
      </div>
    </button>
  );
};

function SingleSchedaAllNoteNew({ scheda, categorie }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userById } = useSelector((state) => state.auth);

  // Custom hooks
  const { modalState, handleShow, handleClose } = useModalState();
  const { expencersWithTotals, maxExpencer, expencersDiff } = useExpencers(scheda);

  // Local state
  const [isDisabled, setisDisabled] = useState(false);
  const [notaSpesaToEdit, setNotaSpesaToEdit] = useState(null);
  const [refSchedaId, SetRefSchedaId] = useState(null);

  // Sorting state
  const [orderState, setOrderState] = useState({
    userOrder: null,
    categoryOrder: null,
    dateOrder: "desc",
    priceOrder: null,
  });

  // Refresh callback
  const onRefreshSingle = async () => {
    await dispatch(singleSchedaSpeseGet(scheda._id)).unwrap();
  };

  // Title editing hook
  const {
    titolo,
    erroLength,
    isEditing,
    onLongPress,
    onChange,
    cancelEdit,
    updateSchedataTitolo,
  } = useTitleEdit(scheda, onRefreshSingle);

  // Share hook
  const {
    condivisoConList,
    isFormModified,
    removeSharedUser,
    addEmail,
    validateEmail,
    removeEmail,
    resetForm,
    handleSubmit: editSharedUserSubmit,
  } = useSchedaShare(scheda, onRefreshSingle, () => handleClose("shareModal"));

  // Handlers
  const handleModalClose = (modalType) => {
    handleClose(modalType);
    resetForm();
    if (modalType !== "editNotaModal") setNotaSpesaToEdit(null);
    if (modalType === "deleteNotaModal") setNotaSpesaToEdit(null);
  };

  const editNota = (notaSpesa) => {
    handleShow("editNotaModal");
    setNotaSpesaToEdit(notaSpesa);
  };

  const closeCreateEditModal = (schedaID) => {
    handleClose("editNotaModal");
    handleShow("deleteNotaModal");
    SetRefSchedaId(schedaID);
  };

  const deleteNotaSpeseAction = async (notaId) => {
    const body = {
      notaId,
      schedaId: refSchedaId,
    };

    try {
      const response = await dispatch(deleteNotaSpese(body)).unwrap();
      await dispatch(singleSchedaSpeseGet(body.schedaId)).unwrap();
      handleModalClose("deleteNotaModal");
      toast.success(response.message || "Note succesfull deleted");
    } catch (error) {
      console.log("Error Response:", error);
      toast.error(`Error deleting note: ${error.message}`);
    }
  };

  const deleteSchedaFromDetail = async () => {
    try {
      const response = await dispatch(deleteSchedaSpese(scheda._id)).unwrap();
      toast.success(response.message || "Scheda succesfull deleted");
      if (response?.id) {
        navigate("/note-spese");
      }
    } catch (error) {
      console.log("Error Response:", error);
      toast.error(`Error deleting scheda: ${error.message}`);
    } finally {
      handleModalClose("deleteModal");
    }
  };

  // Sorting handlers
  const onChangeOder = async (orderType) => {
    setOrderState((prevState) => {
      const newOrderState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] =
          key === orderType
            ? prevState[key] === "desc"
              ? "asc"
              : "desc"
            : null;
        return acc;
      }, {});
      return newOrderState;
    });
  };

  const fetchData = async (param) => {
    setisDisabled(true);
    try {
      await dispatch(singleSchedaSpeseGet(param)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setisDisabled(false);
    }
  };

  // Effects
  useEffect(() => {
    dispatch(getUserById(scheda.user));
  }, [scheda.notaSpese, dispatch, scheda.user]);

  useEffect(() => {
    const activeOrderType = Object.keys(orderState).find(
      (key) => orderState[key] !== null
    );
    if (!activeOrderType) return;

    const param = {
      schedaId: scheda._id,
      orderKind: activeOrderType,
      orderState: orderState[activeOrderType],
    };
    fetchData(param);
  }, [orderState]);

  return (
    <>
      <div>
        <div className="card h-100 pb-2 mb-2">
          {/* Header with title and actions */}
          <SchedaHeader
            scheda={scheda}
            user={user}
            userById={userById}
            isEditing={isEditing}
            titolo={titolo}
            erroLength={erroLength}
            onLongPress={onLongPress}
            onChange={onChange}
            cancelEdit={cancelEdit}
            updateSchedataTitolo={updateSchedataTitolo}
            onShare={() => handleShow("shareModal")}
            onDelete={() => handleShow("deleteModal")}
            showSharedAvatars={false}
          />

          {/* Card body with sorting and notes list */}
          <div className="card-body px-3">
            {/* Sorting buttons */}
            <div className="row">
              <div className="col-12">
                <div className="py-2 d-flex">
                  <SortButton
                    label="User"
                    orderKey="userOrder"
                    orderState={orderState}
                    onClick={onChangeOder}
                    disabled={isDisabled}
                  />
                  <SortButton
                    label="Category"
                    orderKey="categoryOrder"
                    orderState={orderState}
                    onClick={onChangeOder}
                    disabled={isDisabled}
                  />
                  <SortButton
                    label="Date"
                    orderKey="dateOrder"
                    orderState={orderState}
                    onClick={onChangeOder}
                    disabled={isDisabled}
                  />
                  <SortButton
                    label="Price"
                    orderKey="priceOrder"
                    orderState={orderState}
                    onClick={onChangeOder}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>

            {/* Notes list */}
            <ul className="list-group">
              {scheda.notaSpese.length === 0 ? (
                <li className="list-group-item border-0 d-flex justify-content-between px-0 mt-3">
                  <p className="text-small mb-0">Aww this list is empty</p>
                </li>
              ) : (
                <>
                  {scheda.notaSpese.map(
                    (notaSpesa) =>
                      notaSpesa && (
                        <NotaSpesaItem
                          key={notaSpesa._id}
                          notaSpesa={notaSpesa}
                          user={user}
                          categories={categorie}
                          onEdit={editNota}
                        />
                      )
                  )}
                </>
              )}
            </ul>
          </div>

          {/* Add note button */}
          <div className="row pt-0 p-3">
            <div className="col-12 d-flex justify-content-end">
              <div
                className="btn bg-gradient-dark btn-sm mb-0 px-4 fixed"
                onClick={() => handleShow("creaNotaModal")}
              >
                <p className="mb-0">Add note</p>
              </div>
            </div>
          </div>

          {/* Expenses summary */}
          {scheda.notaSpese.length > 0 && (
            <ExpensesSummary
              scheda={scheda}
              expencersWithTotals={expencersWithTotals}
              maxExpencer={maxExpencer}
              expencersDiff={expencersDiff}
              variant="default"
              showHigherExpencer={true}
              showUsersTotals={true}
              showCompare={true}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <div className="row">
        {/* Create Note Modal */}
        <Modal
          show={modalState.creaNotaModal}
          onHide={() => handleModalClose("creaNotaModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Create note in {scheda.titolo}</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NotaSpeseFormAllNote
              onSuccess={() => handleModalClose("creaNotaModal")}
              schedaId={scheda._id}
            />
          </Modal.Body>
        </Modal>

        {/* Edit Note Modal */}
        <Modal
          show={modalState.editNotaModal}
          onHide={() => handleModalClose("editNotaModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Edit note in {scheda.titolo}</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NotaSpeseFormAllNote
              onSuccess={() => handleModalClose("editNotaModal")}
              schedaId={scheda._id}
              notaToEdit={notaSpesaToEdit}
              beforeDelete={() => closeCreateEditModal(scheda._id)}
            />
          </Modal.Body>
        </Modal>

        {/* Share Modal */}
        <ShareModal
          show={modalState.shareModal}
          onHide={() => handleModalClose("shareModal")}
          scheda={scheda}
          user={user}
          userById={userById}
          condivisoConList={condivisoConList}
          isFormModified={isFormModified}
          onAddEmail={addEmail}
          onValidateEmail={validateEmail}
          onRemoveEmail={removeEmail}
          onRemoveSharedUser={removeSharedUser}
          onSubmit={editSharedUserSubmit}
          onClose={() => handleModalClose("shareModal")}
        />

        {/* Delete Scheda Modal */}
        <DeleteConfirmModal
          show={modalState.deleteModal}
          onHide={() => handleModalClose("deleteModal")}
          title={scheda.titolo}
          itemName={scheda.titolo}
          itemType="scheda"
          onConfirm={deleteSchedaFromDetail}
          onCancel={() => handleModalClose("deleteModal")}
        />

        {/* Delete Note Modal */}
        <DeleteConfirmModal
          show={modalState.deleteNotaModal}
          onHide={() => handleModalClose("deleteNotaModal")}
          title={notaSpesaToEdit?.testo}
          itemName={notaSpesaToEdit?.testo}
          itemType="note"
          onConfirm={() => deleteNotaSpeseAction(notaSpesaToEdit._id)}
          onCancel={() => handleModalClose("deleteNotaModal")}
        />
      </div>
    </>
  );
}

export default SingleSchedaAllNoteNew;
