import React from "react";
import Modal from "react-bootstrap/Modal";

/**
 * DeleteConfirmModal - Reusable confirmation modal for delete operations
 */
const DeleteConfirmModal = ({
  show,
  onHide,
  title,
  itemName,
  itemType = "item", // "scheda" | "note" | "item"
  onConfirm,
  onCancel,
}) => {
  const getWarningText = () => {
    switch (itemType) {
      case "scheda":
        return (
          <p>
            Are you sure to delete this scheda <i>"{itemName}"</i>
            ,<br /> <b>this action can be undone</b>
          </p>
        );
      case "note":
        return (
          <p>
            Are you sure to delete this note <i>"{itemName}"</i>
            ,<br /> <b>this action can be undone</b>
          </p>
        );
      default:
        return (
          <p>
            Are you sure to delete <i>"{itemName}"</i>
            ,<br /> <b>this action can be undone</b>
          </p>
        );
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>
            Confirm to delete: <i>{title || itemName}</i>?
          </b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getWarningText()}
        <div className="row mt-4 mb-3">
          <div className="col-4">
            <button
              className="text-dark btn btn-outline-dark btn-sm mb-0 w-100"
              onClick={onCancel || onHide}
            >
              <p className="mb-0">cancel</p>
            </button>
          </div>
          <div className="col-8">
            <button
              type="submit"
              className="text-danger btn border border-1 border-danger w-100"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmModal;
