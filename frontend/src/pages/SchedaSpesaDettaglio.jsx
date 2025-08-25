import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { singleSchedaSpeseGet } from "../features/schedaSpese/schedaSpeseSlice";
import { FaArrowLeft } from "react-icons/fa";

import Spinner from "../components/utils/Spinner";
import SingleSchedaAllNote from "../components/SingleSchedaAllNote";

import StackedBarChart from "../components/charts/StackedBarChart";

function SchedaSpesaDettaglio() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const singleScheda = useSelector(
    (state) => state.schedaSpese.singleSchedaSpese
  );

  useEffect(() => {
    if (id) {
      dispatch(singleSchedaSpeseGet(id))
        .unwrap()
        .catch((error) =>
          console.error("Error fetching single scheda:", error)
        );
    }
    if (singleScheda) console.log(singleScheda, "xxxxxxxxxxxxxxxx");
  }, [id, dispatch]);

  const navigateBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="container ">
        <div className="row">
          <div className="col-12 col-md-8 m-auto">
            <div className="d-flex align-items-center mb-4 mt-0">
              <FaArrowLeft
                className="mb-0 me-3"
                onClick={() => navigateBack()}
              />

              <h2 className="mb-0 align-self-center">Expence detail</h2>
            </div>

            <div>
              {singleScheda ? (
                <>
                  <SingleSchedaAllNote
                    key={singleScheda._id}
                    scheda={singleScheda}
                  />

                  <StackedBarChart singleScheda={singleScheda} />
                </>
              ) : (
                <>
                  <Spinner />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SchedaSpesaDettaglio;
