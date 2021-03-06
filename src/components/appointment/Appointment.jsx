import React, { useEffect, useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import DataTable from './DataTable';

const Appointment = () => {
    const [apiData, setApiData] = useState([]);
    const [consultants, setConsultants] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate(i => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response1 = await axios.get('/consultent/appointment', {
                    headers: { Authorization: token }
                });

                const response2 = await axios.get('/consultent', {
                    headers: { Authorization: token }
                });

                if (response1 && response2) setIsLoading(false);

                setApiData(response1.data);
                setConsultants(response2.data.data);
            } catch (err) {
                setIsLoading(false);
                alert(err?.response?.data?.message ?? 'Something went wrong');
            }
        }
        apiResponse();
    }, [update]);

    return (
        <>
            <Loader open={isLoading} />
            <DataTable
                apiData={apiData}
                consultants={consultants}
                forceUpdate={forceUpdate}
            />
        </>
    );
}

export default Appointment;