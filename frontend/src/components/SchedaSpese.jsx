import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getSchedaSpese } from "../features/schedaSpese/schedaSpeseSlice";
import SingleScheda from "./SingleScheda";

function SchedaSpese() {
  const dispatch = useDispatch();
  let lastElementID = '';
  const { schedaSpese, isLoading, isError, message } = useSelector(
    (state) => state.schedaSpese
  )

  useEffect(() => {
    dispatch(getSchedaSpese());

  }, []);

  const isLastElement = (arr) => {
    const lastElement= arr[arr.length - 1];
    console.log(lastElement._id, "isLastElement");
    return  lastElement._id;
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-danger">Error: {message}</p>;

  return (
    // console.log(schedaSpese, isLoading, isError, message, "schedaSpese"), // Debugging;

    <>
      <section>
        {schedaSpese.length > 0 ? (
          // {{schedaSpese.slice(-1)}}
            schedaSpese.map((scheda, i, arr) => (
              // <div  style={{ marginBottom: '100px'}} key={scheda._id}>
              <div  style={{ marginBottom: isLastElement(schedaSpese) === scheda._id ? '120px': ''}} key={scheda._id}>
               {scheda._id} - {lastElementID}
              <SingleScheda key={scheda._id} scheda={scheda}/>
            </div>
            ))
        ) : (
            <p>No schede available.</p>
        )}
      </section>
    </>
  );
}

export default SchedaSpese