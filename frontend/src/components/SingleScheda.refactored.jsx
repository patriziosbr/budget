import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import NotaSpeseForm from "./NotaSpeseForm";
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
  getSchedaSpese,
  deleteSchedaSpese,
  reset,
} from "../features/schedaSpese/schedaSpeseSlice";
import { deleteNotaSpese } from "../features/notaSpese/notaSpeseSlice";
import { getUserById } from "../features/auth/authSlice";
import { getAllCategories } from "../features/categorie/categorieSlice";

function SingleSchedaNew({ scheda }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userById } = useSelector((state) => state.auth);

  // Custom hooks
  const { modalState, handleShow, handleClose } = useModalState();
  const { expencersWithTotals, maxExpencer, expencersDiff } = useExpencers(scheda);
  
  const onRefreshList = async () => {
    await dispatch(getSchedaSpese()).unwrap();
  };

  const {
    titolo,
    erroLength,
    isEditing,
    onLongPress,
    onChange,
    cancelEdit,
    updateSchedataTitolo,
  } = useTitleEdit(scheda, onRefreshList);

  const {
    condivisoConList,
    isFormModified,
    removeSharedUser,
    addEmail,
    validateEmail,
    removeEmail,
    resetForm,
    handleSubmit: editSharedUserSubmit,
  } = useSchedaShare(scheda, onRefreshList, () => handleClose("shareModal"));

  // Local state
  const [notaSpesaToEdit, setNotaSpesaToEdit] = useState(null);
  const [refSchedaId, SetRefSchedaId] = useState(null);
  const [categories, setCategories] = useState([]);

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

  const goToDettagolioScheda = (schedaID) => {
    navigate(`/note-spese/${schedaID}`);
    dispatch(reset());
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
      await dispatch(getSchedaSpese()).unwrap();
      handleModalClose("deleteNotaModal");
      toast.success(response.message || "Note succesfull deleted");
    } catch (error) {
      console.log("Error Response:", error);
      toast.error(`Error deleting note: ${error.message}`);
    }
  };

  // Effects
  useEffect(() => {
    dispatch(getUserById(scheda.user));
  }, [scheda.notaSpese, dispatch, scheda.user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await dispatch(getAllCategories()).unwrap();
        setCategories(res);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, [dispatch]);

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
            onTitleClick={() => goToDettagolioScheda(scheda._id)}
            showSharedAvatars={scheda?.condivisoConList?.length > 0}
            titleColClass="col-8"
            actionsColClass="col-4"
          />

          {/* Notes list */}
          <div className="card-body px-3">
            <ul className="list-group">
              {scheda.notaSpese.length === 0 ? (
                <li className="list-group-item border-0 d-flex justify-content-between px-0 mt-3">
                  <p className="text-small mb-0">Aww this list is empty</p>
                </li>
              ) : (
                <>
                  {scheda.notaSpese.map(
                    (notaSpesa, i) =>
                      notaSpesa &&
                      i < 5 && (
                        <NotaSpesaItem
                          key={notaSpesa._id}
                          notaSpesa={notaSpesa}
                          user={user}
                          categories={categories}
                          onEdit={editNota}
                        />
                      )
                  )}
                </>
              )}
            </ul>
            <div className="row pt-0 px-3">
              <div className="col-12 d-flex">
                <div className="d-flex align-items-center">
                  <div className="">
                    <small className="text-dark-emphasis">
                      Showing 5 of {scheda.notaSpese.length}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="row pt-0 p-3">
            <div className="col-12 d-flex justify-content-end">
              {scheda.notaSpese.length > 0 && (
                <div
                  className="d-flex justify-content-center align-items-center text-dark btn btn-outline-dark btn-sm mb-0 me-3 px-4"
                  onClick={() => goToDettagolioScheda(scheda._id)}
                >
                  <p className="mb-0 text-nowrap">See all</p>
                </div>
              )}
              <div
                className="btn bg-gradient-dark btn-sm mb-0 px-4"
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
              variant="compact"
              showHigherExpencer={false}
              showUsersTotals={false}
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
            <NotaSpeseForm
              onSuccess={handleModalClose}
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
            <NotaSpeseForm
              onSuccess={handleModalClose}
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
          onConfirm={() => dispatch(deleteSchedaSpese(scheda._id))}
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

export default SingleSchedaNew;
