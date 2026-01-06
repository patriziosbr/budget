import React from "react";
import Form from "react-bootstrap/Form";
import {
  FaPencilAlt,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaTrash,
  FaUserPlus,
} from "react-icons/fa";
import RandomColorCircle from "../utils/RandomColorCircle";

/**
 * SchedaHeader - Reusable header component for scheda cards
 * Handles title display/editing and action buttons
 */
const SchedaHeader = ({
  scheda,
  user,
  userById,
  // Title editing props
  isEditing,
  titolo,
  erroLength,
  onLongPress,
  onChange,
  cancelEdit,
  updateSchedataTitolo,
  // Action handlers
  onShare,
  onDelete,
  // Optional: click handler for title (for navigation in list view)
  onTitleClick,
  // Optional: show shared users avatars
  showSharedAvatars = false,
  // Optional: custom column widths
  titleColClass = "col-6",
  actionsColClass = "col-6",
}) => {
  return (
    <div className="card-header border-0 bg-white py-2 px-3">
      <div className="row">
        {!isEditing && (
          <>
            <div className={titleColClass}>
              <div
                className="d-flex text-dark-emphasis"
                onClick={onTitleClick}
                style={{ cursor: onTitleClick ? "pointer" : "default" }}
              >
                {/* Show shared users avatars if enabled */}
                {showSharedAvatars && (
                  <>
                    {scheda?.condivisoConList?.length > 0 &&
                      scheda?.condivisoConList?.map((sharedEl) => (
                        <React.Fragment key={sharedEl._id}>
                          {sharedEl.email !== user.email && (
                            <div style={{ height: "", width: "15px" }} className={"mt-2 me-1"}>
                              <RandomColorCircle
                                letter={sharedEl?.email}
                                tooltip={sharedEl?.email}
                                email={sharedEl?.email}
                                className={"circle-small"}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    {/* Show owner for shared users */}
                    {userById[scheda.user]?._id !== user._id && (
                      <div style={{ height: "", width: "15px" }}  className={"mt-2"}>
                        <RandomColorCircle
                          letter={userById[scheda.user]?.email}
                          tooltip={userById[scheda.user]?.email}
                          email={userById[scheda.user]?.email}
                          className={"circle-small"}
                        />
                      </div>
                    )}
                  </>
                )}

                <h3
                  style={{
                    textTransform: "Capitalize",
                    cursor: onTitleClick ? "pointer" : "default",
                  }}
                  className={`mb-0 w-100 ${showSharedAvatars ? "ms-3 pb-2 hover border-bottom" : ""}`}
                >
                  {scheda.titolo}
                </h3>
              </div>
            </div>
            <div className={`${actionsColClass} d-flex justify-content-end align-items-center text-dark-emphasis`}>
              <div
                style={{
                  gridTemplateColumns:
                    user._id === scheda.user ? "1fr 1fr 1fr" : "1fr 1fr",
                }}
                className="d-grid gap-4"
              >
                <div
                  style={{ cursor: "pointer" }}
                  className="d-flex justify-content-center align-items-center text-dark-emphasis"
                  onClick={onLongPress}
                >
                  <FaPencilAlt size={15} />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  className="d-flex justify-content-center align-items-center text-dark-emphasis"
                  onClick={onShare}
                >
                  <FaUserPlus size={15} />
                </div>
                {user._id === scheda.user && (
                  <div
                    style={{ cursor: "pointer" }}
                    className="d-flex justify-content-center align-items-center text-danger"
                    onClick={onDelete}
                  >
                    <FaTrash size={15} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Editing mode */}
        {isEditing && (
          <>
            <div className="col-8">
              <Form.Group>
                <Form.Control
                  className="d-flex align-self-center"
                  type="titolo"
                  id="titolo"
                  maxLength="21"
                  name="titolo"
                  value={titolo}
                  placeholder="titolo"
                  onChange={onChange}
                />
              </Form.Group>
            </div>
            <div className="col-4 d-flex justify-content-end align-items-center">
              <div
                role="button"
                className="d-flex justify-content-center align-items-center w-100"
              >
                <FaRegTimesCircle
                  size={15}
                  onClick={cancelEdit}
                  className="w-100"
                />
              </div>
              <div
                role="button"
                className="d-flex justify-content-center align-items-center w-100"
              >
                <FaRegCheckCircle
                  size={15}
                  onClick={updateSchedataTitolo}
                  className="w-100"
                />
              </div>
            </div>
            <div>
              {erroLength && (
                <small className="text-danger">Limit characters reached</small>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SchedaHeader;
