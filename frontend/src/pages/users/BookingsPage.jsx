import React, { useEffect, useState } from 'react'
import Axios from '../../lib/axiosInstance'
import { useAuth } from '../../lib/hooks/useAuth';
import { displayDate, displayTime, getCurrencyFormat, isPastDate, lowResImageUrl } from '../../lib/utils';
import { Link } from 'react-router-dom';
import Loader from '../../components/UI/Loader';
import SomethingWentWrong from '../../components/UI/SomethingWentWrong';
import { MdOpenInNew } from "react-icons/md";
import { BOOKING_STATUS } from '../../lib/consts';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const upCommingShows = bookings?.filter((booking) => !isPastDate(booking?.movie?.releaseDate) && booking?.status !== BOOKING_STATUS.VISITED);
    const previousShows = bookings?.filter((booking) => isPastDate(booking?.movie?.releaseDate));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        Axios('GET', `/user/get-all-booked-movie/${user?._id}`, null, { authRequest: true, token: token })
            .then((response) => {
                if (response?.status === 200) {
                    setBookings(response?.data?.bookings)
                }
            })
            .finally(() => {
                setLoading(false);
            })
            .catch(() => {
                setError(true);
            });
    }, []);

    return (
        <div className="text-sm mx-auto container px-2 sm:px-6 lg:px-8 py-4 space-y-4 min-h-screen lg:mx-auto mt-3 pb-14 relative">
            <h1 className="text-xl md:text-2xl lg:text-3xl p-3 text-white rounded-sm font-semibold mb-4">Booking History</h1>
            {
                loading ? (
                    <Loader className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                ) : (
                    <div className='space-y-4'>
                        {
                            (bookings.length === 0 || error) && <SomethingWentWrong text={`${error ? "Something went wrong, Please try again!" : "No Previous Bookings to display!"}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        }

                        {/* Up-comming Movies */}
                        {
                            upCommingShows.length > 0 && (
                                <div className="bg-gray-800 text-skin-inverted rounded-lg p-4">
                                    <h6 className="text-lg font-semibold">Upcomming Shows</h6>
                                    <div className='py-2 divide-y divide-gray-500 space-y-4'>
                                        {
                                            upCommingShows?.map((booking) => {
                                                return (
                                                    <div className={`block py-4 text-skin-inverted transition-all`}>
                                                        <div className='flex flex-col md:flex-row items-start gap-4'>
                                                            <div className={`w-full md:w-1/3 h-[360px] max-h-[360px] relative overflow-hidden rounded-md shadow-lg border border-white/5`}>
                                                                <img src={booking?.movie?.poster} alt={booking?.movie?.title} className="w-full h-full absolute inset-0 object-cover bg-center z-[0] blur-lg" />
                                                                <img src={booking?.movie?.poster} alt={booking?.movie?.title} className="w-full h-full absolute inset-0 object-contain bg-center z-[2]" />
                                                            </div>
                                                            <div className='flex w-full flex-col justify-end'>
                                                                <div className="">
                                                                    <h5 className="font-semibold w-full text-3xl uppercase line-clamp-1 leading-tight">
                                                                        {booking?.movie?.title}
                                                                    </h5>
                                                                    <span className="capitalize">({booking?.movie?.language})</span>
                                                                </div>
                                                                <div className="mt-4 space-y-1">
                                                                    <span className="text-lg font-semibold">Description</span>
                                                                    <p className="line-clamp-3">{booking?.movie?.description}</p>
                                                                </div>
                                                                <div className="mt-4 space-y-1">
                                                                    <span className="text-lg font-semibold">Movie Date</span>
                                                                    <p className="line-clamp-3">{displayDate(booking?.movie?.releaseDate)} | {displayTime(booking?.showtime?.showStartTime)}</p>
                                                                </div>
                                                                <div className="w-full md:w-1/3 grid grid-cols-2">
                                                                    <div className="mt-4 space-y-1">
                                                                        <span className="text-lg font-semibold">Seats</span>
                                                                        <p className="line-clamp-3">{`${booking?.seats?.map(seat => seat?.seatNo).join(', ')}`.trim()}</p>
                                                                    </div>
                                                                    <div className="mt-4 space-y-1">
                                                                        <span className="text-lg font-semibold">Total</span>
                                                                        <p className="line-clamp-3">{getCurrencyFormat(booking?.totalPrice)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 space-y-1">
                                                                    <Link
                                                                        to={`/user/bookings/${booking?._id}`}
                                                                        className="text-skin-inverted bg-skin-base focus:ring-skin-muted focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2"
                                                                    >
                                                                        <MdOpenInNew size={15} />
                                                                        View Details
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }

                        {/* Previous Bookings */}
                        {
                            previousShows.length > 0 && (
                                <div className="bg-gray-800 text-skin-inverted rounded-lg p-4">
                                    <h6 className="text-lg font-semibold mb-3">Previous Shows</h6>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {
                                            previousShows?.map((booking) => {
                                                return (
                                                    <>
                                                        <Link to={`/user/bookings/${booking?._id}`} className={`booking rounded block bg-gray-700/30 py-4 px-2 text-gray-100 group transition-all`}>
                                                            <div className='flex items-start gap-4'>
                                                                <div className='w-40 h-full overflow-hidden rounded shadow-lg border border-white/5'>
                                                                    <img src={lowResImageUrl(booking?.movie?.poster)} alt='not-found' className='transition delay-150 grayscale group-hover:grayscale-0' />
                                                                </div>
                                                                <div className='flex w-full flex-col justify-end'>
                                                                    <div className="font-semibold w-full text-lg line-clamp-1">
                                                                        <h5 className='uppercase'>{booking?.movie?.title}</h5>
                                                                    </div>
                                                                    <p className="text-xs inline-block">({booking?.movie?.language})</p>
                                                                    <div className="mt-1">
                                                                        <span className="text-md font-semibold">Booking Date</span>
                                                                        <p className="line-clamp-1">{displayDate(booking?.createdAt)}</p>
                                                                    </div>
                                                                    <div className="w-full md:w-3/4 grid grid-cols-2">
                                                                        <div className="mt-1">
                                                                            <span className="text-md font-semibold">Seats</span>
                                                                            <p className="line-clamp-1">{`${booking?.seats?.map(seat => seat?.seatNo).join(', ')}`.trim()}</p>
                                                                        </div>
                                                                        <div className="mt-1">
                                                                            <span className="text-md font-semibold">Total</span>
                                                                            <p className="line-clamp-1">{getCurrencyFormat(booking?.totalPrice)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default BookingsPage;