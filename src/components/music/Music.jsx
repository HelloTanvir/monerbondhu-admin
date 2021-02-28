import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import DataTable from './DataTable';

const Music = () => {
    const [apiData, setApiData] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const [update, setUpdate] = useState(0);

    const forceUpdate = () => setUpdate(i => i + 1);

    useEffect(() => {
        const apiResponse = async () => {
            const token = `Bearer ${localStorage.getItem('token')}`;

            setIsLoading(true);

            try {
                const response = await axios.get('/music', {
                    headers: { Authorization: token }
                });

                if (response) setIsLoading(false);

                setApiData({
                    meditation: [...response.data.meditation.free, ...response.data.meditation.paid],
                    music: [...response.data.music.free, ...response.data.music.paid],
                    stress: [...response.data.stress.free, ...response.data.stress.paid],
                    sleep: [...response.data.sleep.free, ...response.data.sleep.paid]
                });
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
            <DataTable apiData={apiData} forceUpdate={forceUpdate} />
        </>
    );
}

export default Music;