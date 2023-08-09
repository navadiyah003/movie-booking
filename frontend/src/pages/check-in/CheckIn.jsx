import React, { useEffect, useState } from 'react';
import SearchBox from '../../components/UI/SearchBox';
import UsersCheckInTable from '../../components/UsersCheckInTable';
import { FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../lib/hooks/useAuth';
import { displayTime } from '../../lib/utils';
import Axios from '../../lib/axiosInstance';
import { MdRadioButtonUnchecked } from 'react-icons/md';

const CheckIn = () => {
    // Replace these values with your actual data

    const [shows, setAllShows] = useState([])
    const [activeMovie, setActiveMovie] = useState([])
    const [selectedShow, setSelectedShow] = useState({})
    const { token } = useAuth();
    const getShowsRecords = (id) => {
        const show = shows.filter((show) => show._id === id)
        setSelectedShow(show[0])
    }
    useEffect(() => {
        Axios('GET', `movie/movie-shows-timings`, null, { authRequest: true, token: token })
            .then((res) => {
                console.log(res);
                setAllShows(res.data?.show);
                setActiveMovie(res.data?.movie[0]);
                setSelectedShow(res.data?.show[0])
            })
            .finally(() => {
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);
    return (
        <div className="container">
            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                <h1 className="text-xl md:text-2xl lg:text:3xl">Check-In</h1>
                <div>
                    <div className='font-semibold text-xl'>{activeMovie?.title}</div>
                    <div className='bg-green-300 text-black text-center rounded-md px-2 py-1'>{activeMovie?.status}</div>
                </div>
            </div>
            <div className="bg-white rounded-lg  mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Total Seats</span>
                    <span className="text-sm ">{selectedShow?.totalSeats || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Available Seats</span>
                    <span className="test-sm ">{(selectedShow?.totalSeats - (selectedShow?.reservedSeats + selectedShow?.bookedSeats)) || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Reserved Seats</span>
                    <span className="test-sm ">{selectedShow?.reservedSeats || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Booked Seats</span>
                    <span className="test-sm ">{selectedShow?.bookedSeats || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">People Inside Auditorium</span>
                    <span className="test-sm ">{selectedShow?.peopleInsideAuditorium || 0}</span>
                </div>

            </div>
            <div className='font-semibold text-xl mt-2'>Available Show Timings</div>
            {shows.length === 0 && <div className='p-3 flex justify-center items-center'>No shows Available</div>}
            <div className='my-3'>
                {shows?.map((show, index) => (
                    <button
                        key={index}
                        className={`${selectedShow?._id === show._id ? 'transition text-skin-inverted border hover:border-green-700 border-green-800 hover:bg-green-700 focus:ring-green-800/70 bg-green-800' : 'text-skin-base border border-skin-base hover:bg-skin-base/20 focus:ring-skin-muted'} focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                        onClick={() => getShowsRecords(show?._id)}
                    >
                        {selectedShow?._id === show?._id ? <FiCheckCircle size={15} /> : <MdRadioButtonUnchecked size={15} />}
                        {displayTime(show?.showStartTime)}
                    </button>
                ))}

            </div>
            <div>
                {selectedShow && Object.keys(selectedShow).length > 0 && <UsersCheckInTable show={selectedShow} showStartTime={selectedShow?.showStartTime} />}
            </div>
        </div>
    );
};

export default CheckIn;
