import React from "react";
import RandomColorCircle from "../utils/RandomColorCircle";
import { parseDate, getCategoryName } from "./utils/helpers";

/**
 * NotaSpesaItem - Reusable list item for displaying a single expense note
 */
const NotaSpesaItem = ({
  notaSpesa,
  user,
  categories,
  onEdit,
  showCategory = true,
}) => {
  const isOwnNote = notaSpesa?.inserimentoUser?.id === user?._id;
  const canEdit = notaSpesa.testo && isOwnNote;

  return (
    <li
      className={`list-group-item border-0 d-flex justify-content-between mb-2 ${
        isOwnNote ? "bg-light" : ""
      }`}
    >
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center">
          <RandomColorCircle
            letter={notaSpesa.inserimentoUser?.email}
            tooltip={notaSpesa.inserimentoUser?.email}
            email={notaSpesa.inserimentoUser?.email}
          />
        </div>
        <div
          role={canEdit ? "button" : undefined}
          className="d-flex flex-column pe-3"
          onClick={canEdit ? () => onEdit(notaSpesa) : undefined}
        >
          <h6 className="mb-1 text-dark text-sm">
            {notaSpesa.testo ? notaSpesa.testo : "Note not available"}
          </h6>
          <span className="text-xs">
            {parseDate(notaSpesa?.inserimentoData)}
          </span>
        </div>
        {showCategory && (
          <div className="pe-4">
            {notaSpesa.categoria !== "" && (
              <span
                className="badge bg-light text-dark border"
                style={{
                  fontSize: "0.7rem",
                  alignSelf: "flex-start",
                }}
              >
                <small className="mb-0 text-wrap">
                  {getCategoryName(categories, notaSpesa.categoria)}
                </small>
              </span>
            )}
          </div>
        )}
      </div>
      <div className="d-flex align-items-center text-dark text-sm font-weight-bold text-nowrap">
        € {notaSpesa?.importo?.toFixed(2)}
      </div>
    </li>
  );
};

export default NotaSpesaItem;
