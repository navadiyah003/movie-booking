
import React, { useEffect, useState } from 'react'
import { displayDate, displayTime, getCurrencyFormat } from '../../lib/utils';
import Axios from '../../lib/axiosInstance';
import { useAuth } from '../../lib/hooks/useAuth';
import { useParams } from 'react-router-dom';
import TicketModal from '../../components/UI/TicketModal';
import Loader from '../../components/UI/Loader';
import SomethingWentWrong from '../../components/UI/SomethingWentWrong';
import { BOOKING_STATUS } from '../../lib/consts';
import { toast } from 'react-toastify';
import LoadingButton from '../../components/UI/LoadingButton';

const BookingDetails = (props) => {
    const [bookingDetails, setBookingDetails] = useState({});
    const [viewTicket, setViewTicket] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [error, setError] = useState(false);
    const { token } = useAuth();
    const { bookingId } = useParams();
    const bookedSeats = bookingDetails?.seats?.map((a) => a.seatNo).join(', ');

    const getShowsDetails = () => {
        Axios('GET', `/user/get-booking-details/${bookingId}`, null, { authRequest: true, token: token })
            .then((response) => {
                if (response?.status === 200) {
                    setBookingDetails(response?.data?.booking)
                    console.log(response.data);
                }
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((error) => {
                setError(true);
                // toast.error(`${error.message}`);
            });
    }
    useEffect(() => {
        getShowsDetails()

    }, [])

    const closeTicketModal = () => {
        setViewTicket(false)
    }
    const openTicketModal = () => {
        setViewTicket(true)
    }
    const ticketDeatils = {
        title: bookingDetails?.movie?.title,
        poster: bookingDetails?.movie?.poster,
        releaseDate: bookingDetails?.movie?.releaseDate,
        showTitle: bookingDetails?.showtime?.title,
        showTime: bookingDetails?.showtime?.showStartTime,
        noOfSeatsBook: bookingDetails?.seats?.length,
        bookingId: bookingDetails?.bookingId,
        seatNo: bookedSeats,
        amount: bookingDetails?.totalPrice,
        language: bookingDetails?.movie?.language
    }
    const cancelTicketModal = () => {
        setCancelLoading(true);
        Axios('DELETE', `/show/${bookingDetails?._id}`, null, { authRequest: true, token: token })
            .then((response) => {
                if (response?.status === 200) {
                    console.log('response?.data', response?.data, response?.data?.data?.status);
                    setBookingDetails({ ...bookingDetails, status: response?.data?.data?.status });
                    toast.success('Booking cancelled successfully');
                    // navigate(-1);
                }
            })
            .finally(() => {
                setCancelLoading(false);
            })
            .catch((error) => {
                setError(true);
                // toast.error(`${error.message}`);
            });
    }
    const handleDownloadTickets = (data) => {
        const fileName = `${data.title.replace(' ', '-')}-${data.releaseDate}-IWS.pdf`;
        Axios('POST', '/user/ticket', data, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'blob',
            authRequest: true,
            token: token,
        })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.setAttribute('download', fileName);
                tempLink.click();
                URL.revokeObjectURL(url);
            })
            .finally(() => {

            })
            .catch((error) => {
                console.error('Error downloading PDF:', error);
            });
    }

    console.log('bookingDetails', bookingDetails);
    return (
        <div className="text-sm mx-auto container px-2 sm:px-6 lg:px-8 py-4 space-y-4 min-h-screen lg:mx-auto mt-3 pb-14 relative">
            {
                loading ? (
                    <Loader className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                ) : (
                    error ? (
                        <SomethingWentWrong className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                    ) : (
                        <div className={`bg-gray-800 text-skin-inverted rounded-lg p-4`}>
                            <div className={`block py-4 text-skin-inverted transition-all`}>
                                <div className='flex flex-col md:flex-row items-start gap-4'>
                                    <div className={`w-full md:w-1/3 h-[360px] max-h-[360px] relative overflow-hidden rounded-md shadow-lg border border-white/5`}>
                                        <img src={bookingDetails?.movie?.poster} alt={bookingDetails?.movie?.title} className={`w-full h-full absolute inset-0 object-cover bg-center z-[0] blur-lg ${BOOKING_STATUS.CANCEL === bookingDetails?.status ? 'grayscale' : 'grayscale-0'}`} />
                                        <img src={bookingDetails?.movie?.poster} alt={bookingDetails?.movie?.title} className={`w-full h-full absolute inset-0 object-contain bg-center z-[2] ${BOOKING_STATUS.CANCEL === bookingDetails?.status ? 'grayscale' : 'grayscale-0'}`} />
                                    </div>
                                    <div className='flex w-full flex-col justify-end'>
                                        <div className="">
                                            <h5 className="font-semibold w-full text-3xl uppercase line-clamp-1 leading-tight">
                                                {bookingDetails?.movie?.title}
                                            </h5>
                                            <span className="capitalize">({bookingDetails?.movie?.language})</span>
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <span className="text-lg font-semibold">Description</span>
                                            <p className="line-clamp-3">{bookingDetails?.movie?.description}</p>
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <span className="text-lg font-semibold">Movie Date</span>
                                            <p className="line-clamp-3">{displayDate(bookingDetails?.movie?.releaseDate)} | {displayTime(bookingDetails?.showtime?.showStartTime)}</p>
                                        </div>
                                        <div className="w-full md:w-1/3 grid grid-cols-2">
                                            <div className="mt-4 space-y-1">
                                                <span className="text-lg font-semibold">Seats</span>
                                                <p className="line-clamp-3">{`${bookingDetails?.seats?.map(seat => seat?.seatNo).join(', ')}`.trim()}</p>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                                <span className="text-lg font-semibold">Total</span>
                                                <p className="line-clamp-3">{getCurrencyFormat(bookingDetails?.totalPrice)}</p>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                                <span className="text-lg font-semibold">Status</span>
                                                <p className={`line-clamp-3 ${BOOKING_STATUS.CANCEL === bookingDetails?.status ? "text-red-500" : 'text-green-500'}`}>{(bookingDetails?.status)}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <button
                                                className={`text-skin-inverted border border-skin-base/70 hover:bg-skin-base/20 focus:ring-skin-base/70 bg-skin-base/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                                                onClick={openTicketModal}
                                            >
                                                View ticket
                                            </button>
                                            <button
                                                className={`text-skin-inverted border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                                                onClick={() => {
                                                    handleDownloadTickets(ticketDeatils)
                                                }}
                                            >
                                                Download ticket
                                            </button>
                                            {BOOKING_STATUS.CANCEL !== bookingDetails?.status && <LoadingButton
                                                className={`text-skin-inverted border border-red-800/70 hover:bg-red-800/20 focus:ring-red-800/70 !bg-red-800/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                                                onClick={cancelTicketModal}
                                                isLoading={cancelLoading}
                                                text='Cancel ticket'
                                            >
                                            </LoadingButton>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            {!error && viewTicket && (<TicketModal handleDownloadTickets={handleDownloadTickets} closeHandler={closeTicketModal} isOpen={viewTicket} ticket={ticketDeatils} />)}
        </div>
    );
};


export default BookingDetails