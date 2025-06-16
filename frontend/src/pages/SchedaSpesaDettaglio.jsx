import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { singleSchedaSpeseGet } from '../features/schedaSpese/schedaSpeseSlice'

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

    return (
        <div>
            <h1>Dettaglio Scheda Spesa</h1>
            <p>ID Scheda: {id}</p>
            {singleScheda ? (
                <pre>{JSON.stringify(singleScheda, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
            {/* Additional details can be added here */}
        </div>
    );
}

export default SchedaSpesaDettaglio