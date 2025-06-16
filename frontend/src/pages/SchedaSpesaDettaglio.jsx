import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { singleSchedaSpeseGet } from '../features/schedaSpese/schedaSpeseSlice'
import { FaArrowLeft } from "react-icons/fa";

function SchedaSpesaDettaglio() {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Get the singleSchedaSpese from the Redux store
    const singleScheda = useSelector((state) => state.schedaSpese.singleSchedaSpese);

    useEffect(() => {
        if (id) {
            dispatch(singleSchedaSpeseGet(id))
                .unwrap()
                .catch((error) => console.error('Error fetching single scheda:', error));
        }
    }, [id, dispatch]);

    const navigateBack = () => {
        window.history.back();
    }

    return (
        <>
        <div>
            <div className='d-flex align-items-center'>
                <FaArrowLeft className='mb-0 me-3' onClick={()=>navigateBack()}/>
                <h1 className='mb-0'>Dettaglio Scheda Spesa</h1>
            </div>
            <div>
                {singleScheda ? (
                    <pre>{JSON.stringify(singleScheda, null, 2)}</pre>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
        </>
    );
}

export default SchedaSpesaDettaglio