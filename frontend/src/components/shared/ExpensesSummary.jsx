import React from "react";
import { getTotale } from "./utils/helpers";

/**
 * ExpensesSummary - Reusable component for displaying expense statistics
 */
const ExpensesSummary = ({
  scheda,
  expencersWithTotals,
  maxExpencer,
  expencersDiff,
  // Layout options
  showHigherExpencer = true,
  showUsersTotals = true,
  showCompare = true,
  variant = "default", // "default" | "compact"
}) => {
  if (!scheda.notaSpese || scheda.notaSpese.length === 0) {
    return null;
  }

  const hasMultipleUsers = expencersWithTotals && expencersWithTotals.length > 1;
  const hasExpencersDiff =
    expencersDiff[0] && expencersDiff[0]?.userHigh !== "Users spent equal";

  if (variant === "compact") {
    return (
      <>
        <div className="row px-3">
          <div className="col-md-6 col-6">
            {showCompare && hasExpencersDiff && (
              <div className="col-12 my-2">
                <div className="card">
                  <div className="card-body">
                    <h6>Compair</h6>
                    {expencersDiff.map((item, index) => (
                      <p className="mb-0 text-sm" key={index}>
                        <b>{item.userHigh}</b> VS <b>{item.userLess}</b> spent
                        over <b>€ {item.diff}</b>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-6 col-6">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="text-center mb-0">Total</h6>
                <span className="text-xs">&nbsp;</span>
                <hr className="horizontal dark mt-0 mb-2" />
                <h5 className="mb-0">€ {getTotale(scheda.notaSpese)}</h5>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default (full) variant
  return (
    <>
      <div className="row px-3">
        {showCompare && hasExpencersDiff && (
          <div className="col-12 my-2">
            <div className="card">
              <div className="card-body">
                <h6>Compair</h6>
                {expencersDiff.map((item, index) => (
                  <p className="mb-0 text-sm" key={index}>
                    <b>{item.userHigh}</b> VS <b>{item.userLess}</b> spent over{" "}
                    <b>€ {item.diff}</b>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {showHigherExpencer && maxExpencer && (
          <div className="col-md-6 col-6">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="text-center mb-0">Higher expence</h6>
                <span className="text-xs">
                  <b>{maxExpencer?.userName ?? maxExpencer}</b>
                </span>
                <hr className="horizontal dark my-1" />
                <h5 className="mb-0">€ {maxExpencer?.totalExp.toFixed(2)}</h5>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-6 col-6">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-center mb-0">Total</h6>
              <span className="text-xs">&nbsp;</span>
              <hr className="horizontal dark mt-0 mb-2" />
              <h5 className="mb-0">€ {getTotale(scheda.notaSpese)}</h5>
            </div>
          </div>
        </div>
      </div>

      {showUsersTotals && hasMultipleUsers && (
        <div className="row px-3 mb-5">
          <div className="col-12 mt-2">
            <div className="card">
              <div className="card-body">
                <h6>Users totals</h6>
                {expencersWithTotals.map((item) => (
                  <p className="mb-0 text-sm" key={item.userId}>
                    {item.userName}: <b>€ {item.totalExp.toFixed(2)}</b>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpensesSummary;
