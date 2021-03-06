import React, { useEffect, useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import DataTable from './DataTable';

const FAQ = () => {
    const [apiData, setApiData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate(i => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/faq', {
                    headers: { Authorization: token }
                });

                if (response) setIsLoading(false);

                setApiData(response.data.data);
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
            <DataTable apiData={apiData} forceUpdate={forceUpdate} />
        </>
    );
}

export default FAQ;