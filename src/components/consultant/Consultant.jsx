import React, { useEffect, useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import DataTable from './DataTable';

const Consultant = () => {
    const [apiData, setApiData] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // these two will force component to update
    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate(i => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/consultent', {
                    headers: { Authorization: token }
                });

                if (response) setIsLoading(false);

                setApiData(response.data.data);
                setDesignations(response.data.designations);
            } catch (err) {
                setIsLoading(false);
                alert(err.response.data.message || 'Something went wrong');
            }
        }
        apiResponse();
    }, [update]);

    return (
        <>
            <Loader open={isLoading} />
            <DataTable apiData={apiData} designations={designations} forceUpdate={forceUpdate} />
        </>
    );
}

export default Consultant;