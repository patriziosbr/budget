import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RandomColorCircle from "../utils/RandomColorCircle";
import EmailShareList from "../utils/EmailShareList";

/**
 * ShareModal - Reusable modal for sharing a scheda with other users
 */
const ShareModal = ({
  show,
  onHide,
  scheda,
  user,
  userById,
  // Share form props
  condivisoConList,
  isFormModified,
  onAddEmail,
  onValidateEmail,
  onRemoveEmail,
  onRemoveSharedUser,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Share "{scheda.titolo}"</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-3" onSubmit={onSubmit}>
          <EmailShareList
            emailList_tmp={condivisoConList}
            onAddEmail={onAddEmail}
            onValidateEmail={onValidateEmail}
            onRemoveEmail={onRemoveEmail}
            emailListParent={scheda.condivisoConList}
          />
          <h6>Shared users</h6>
          <div>
            {/* Show admin user (owner or current user) */}
            {user._id !== scheda.user ? (
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex align-items-center">
                  <RandomColorCircle
                    letter={userById[scheda.user]?.email}
                    tooltip={userById[scheda.user]?.email}
                    email={userById[scheda.user]?.email}
                  />
                  <p className="ms-2 m-0">{userById[scheda.user]?.email}</p>
                </div>
                <div>
                  <p className="m-0">Admin</p>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex align-items-center">
                  <RandomColorCircle
                    letter={user?.email[0]}
                    tooltip={user?.email}
                    email={user?.email}
                  />
                  <p className="ms-2 m-0">{user.email} (you)</p>
                </div>
                <div>
                  <p className="m-0">Admin</p>
                </div>
              </div>
            )}

            {/* List of shared users */}
            {scheda.condivisoConList.map((userMail) => (
              <div className="d-flex align-items-center mb-3" key={userMail._id}>
                <div className="d-flex align-items-center me-2">
                  <RandomColorCircle
                    letter={userMail.email[0]}
                    tooltip={userMail.email}
                    email={userMail.email}
                  />
                </div>
                <div>
                  <p className="m-0">
                    {userMail.email}{" "}
                    {user.email === userMail.email ? "(you)" : ""}
                  </p>
                  {user.email !== userMail.email && (
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => {
                        if (e.target.value === "1") {
                          onRemoveSharedUser(userMail);
                        }
                      }}
                    >
                      <option>
                        {userMail.role === "write" && "Read and write/Editor"}
                      </option>
                      <option className="text-danger" value="1">
                        Remove
                      </option>
                    </Form.Select>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="d-flex align-item-center justify-content-end mt-4">
            {!isFormModified && (
              <Button
                className="btn bg-gradient-dark btn btn-outline-dark btn-sm w-100"
                onClick={onClose}
              >
                Fine
              </Button>
            )}
            {isFormModified && (
              <Button
                type="submit"
                className="btn bg-gradient-dark btn btn-outline-dark btn-sm w-100"
              >
                Salva
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
