import Axios from "../../lib/axiosInstance";
import { MAX_SEATS_PER_BOOKING, SEATS, USER_ADMIN_ROLE, USER_EMPLOYEE_ROLE } from "../../lib/consts";
import { getCurrencyFormat, getSeatPriceObj, getSeatsForShow, organizeSeatsByStatus } from "../../lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../UI/Loader";
import Modal from "../UI/Modal";

const ShowSeats = ({ movieId, showId, authUser, priceList }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatsList, setSeats] = useState(null);
    const [loading, setLoading] = useState({ booking: false, reserved: false, seats: true });
    const [isOpenReserveSeatModal, setIsOpenReserveSeatModal] = useState(false);
    const [isOpenSelectedSeatModal, setIsOpenSelectedSeatModal] = useState(false);
    const [isOpenReserveConfirmSeatModal, setHandleCloseReservedConfirmModal] = useState(false);
    const [selectedReservedSeate, setSelectedReservedSeate] = useState('');
    const seatsByStatus = organizeSeatsByStatus(seatsList?.seats);

    const fetchFreshData = async () => {
        if (authUser?.user?.role !== USER_ADMIN_ROLE) setLoading({ ...loading, seats: true });
        const seats = await getSeatsForShow(movieId, showId, authUser?.token);
        if (seats) setSeats(seats);
        setLoading({ booking: false, reserved: false, seats: false });
        setSelectedSeats([]);
    }
    const handleSelect = (e, seatNo) => {
        e.preventDefault();
        // If seat is booked, then do not allow to select
        if (seatsByStatus?.BOOKED?.seatNo?.includes(seatNo)) return;

        if (seatsByStatus?.RESERVED?.seatNo.includes(seatNo)) {
            setIsOpenReserveSeatModal(true);
            setSelectedReservedSeate(seatNo);
        }

        if (selectedSeats.includes(seatNo)) {
            const newSelectedSeats = selectedSeats.filter(
                (selectedSeat) => selectedSeat !== seatNo
            );
            setSelectedSeats(newSelectedSeats);
        } else {
            if (authUser?.user?.role === USER_ADMIN_ROLE) {
                setSelectedSeats([...selectedSeats, seatNo]);
            }
            else if (authUser?.user?.role === USER_EMPLOYEE_ROLE && selectedSeats.length < MAX_SEATS_PER_BOOKING) {
                setSelectedSeats([...selectedSeats, seatNo]);
            }
            else {
                toast.warning(`You can only select ${MAX_SEATS_PER_BOOKING} seats`);
            }
        }
    };
    const handleCloseReservedModal = () => {
        setIsOpenReserveSeatModal(false)
        setSelectedSeats([])
    }
    const handleCloseReservedConfirmModal = () => {
        setHandleCloseReservedConfirmModal(false)
        setSelectedSeats([])
    }

    const getSeatStatusColor = (seatNo) => {
        if (seatsList?.totalSeats) {
            if (seatsByStatus?.BOOKED?.seatNo.includes(seatNo)) {
                return 'bg-skin-seat-booked cursor-not-allowed';
            }
            if (seatsByStatus?.RESERVED?.seatNo.includes(seatNo)) {
                if (authUser?.user?.role !== USER_ADMIN_ROLE) return 'bg-skin-seat-booked cursor-not-allowed'
                return 'bg-skin-seat-reserved';
            }
        }
        if (selectedSeats.includes(seatNo)) {
            return 'bg-skin-seat-selected';
        }
        const availableTextColor = authUser?.user?.role === USER_ADMIN_ROLE ? '' : 'text-white'
        return `${availableTextColor} border transition bg-green-800/20 hover:bg-green-800/40 border-green-800/70 focus:ring-green-800/70`;
    }

    const getTotalSelectedPrice = (seatsObj) => {
        return seatsObj?.reduce((total, seat) => total + seat.price, 0);
    };

    const handleSave = async () => {
        if (selectedSeats.length > 0) {
            setLoading(prev => { return { ...prev, booking: true } });
            const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
            const seats = {
                movieId,
                showtimeId: showId,
                seatIds: seatPriceObj,
                userId: authUser.user._id,
                totalPrice: getTotalSelectedPrice(seatPriceObj)
            };

            // API call to save seats
            Axios('POST', `/booking/book-movie/${movieId}`, seats, { authRequest: true, token: authUser.token })
                .then((res) => {
                    if (res?.status === 201) {
                        toast.success(`${res?.data?.message}`);
                    }
                })
                .finally(() => {
                    setLoading(prev => { return { ...prev, booking: false } });
                    setIsOpenSelectedSeatModal(false);
                    fetchFreshData();
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }
    const handleSaveReserve = async () => {
        if (selectedSeats.length > 0) {
            setLoading(prev => { return { ...prev, reserved: true } });
            const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
            const seats = {
                movieId,
                showtimeId: showId,
                seatIds: seatPriceObj,
                userId: authUser.user._id,
                totalPrice: getTotalSelectedPrice(seatPriceObj)
            };

            // API call to save seats
            Axios('POST', `/booking/reserve-seats/${movieId}`, seats, { authRequest: true, token: authUser.token })
                .then((res) => {
                    if (res?.status === 201) {
                        toast.success(`${res?.data?.message}`);
                    }
                    handleCloseReservedConfirmModal()
                })
                .finally(() => {
                    setLoading(prev => { return { ...prev, reserved: false } });
                    fetchFreshData();
                    handleCloseReservedConfirmModal()
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }

    const handleMakeAvailable = async () => {
        setLoading({ ...loading, reserved: true });
        Axios('DELETE', `/show/${movieId}/${showId}/${selectedReservedSeate}`, null, { authRequest: true, token: authUser?.token })
            .then((res) => {
                console.log('res', res);
            })
            .finally(() => {
                fetchFreshData();
                setSelectedReservedSeate('');
                setIsOpenReserveSeatModal(false);
            })
            .catch((err) => {
                console.log('err', err);
            });
    }

    useEffect(() => {
        fetchFreshData();
    }, [movieId, showId, authUser, priceList]);

    return (
        <>
            <div className="seats-wrapper">
                <div className="info-wrapper py-3">
                    {/* Info and color code elements */}
                    <div className="w-[95%] mx-auto color-code-wrapper flex justify-center items-center gap-x-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-sm text-skin-inverted border border-green-800/70 bg-green-800/20" />
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-skin-seat-selected rounded-sm" />
                            <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-skin-seat-booked rounded-sm" />
                            <span>Booked</span>
                        </div>
                        {
                            authUser?.user?.role === USER_ADMIN_ROLE && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-skin-seat-reserved rounded-sm" />
                                    <span>Reserved</span>
                                </div>
                            )
                        }
                    </div>
                    <div className="m-2 ">
                        <div className="flex justify-center items-center font-semibold text-lg mb-1">Seats Price List</div>
                        <div className="w-full mx-auto color-code-wrapper flex justify-center items-center gap-x-3 text-sm">
                            <div className="flex rounded-md items-center flex-col md:flex-row gap-2 border border-skin-base px-2">
                                <span className="font-semibold">A - C </span>
                                <div className="w-fit h-fit p-1 rounded-sm " >{getCurrencyFormat(priceList?.priceRow_a_to_c)}</div>
                            </div>
                            <div className="flex rounded-md items-center flex-col md:flex-row gap-2 border border-skin-base px-2">
                                <span className="font-semibold">D - H</span>
                                <div className="w-fit h-fit  p-1 " >{getCurrencyFormat(priceList?.priceRow_d_to_h)}</div>
                            </div>
                            <div className="flex rounded-md items-center flex-col md:flex-row gap-2 border border-skin-base px-2">
                                <span className="font-semibold">I - N</span>
                                <div className="w-fit h-fit  p-1 " >{getCurrencyFormat(priceList?.priceRow_i_to_n)}</div>
                            </div>

                        </div>
                    </div>

                </div>

                {
                    loading.seats ? (
                        <div className="flex justify-center items-center h-96">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="seats overflow-hidden flex justify-center">
                                <div className="wrapper-1 overflow-x-auto">
                                    <div className="seats-container mt-5 w-max">
                                        <div className="screen mb-6 h-6 bg-skin-muted/50 text-center">
                                            Screen
                                        </div>
                                        {Object.keys(SEATS).map((row) => {
                                            const seats = SEATS[row];
                                            return (
                                                <div
                                                    key={row}
                                                    className={`row row-${row} my-1 flex justify-center items-center gap-5`}
                                                >
                                                    <div
                                                        className={`seats-${row} flex gap-2 justify-around items-center`}
                                                    >
                                                        {seats.map((seat) => {
                                                            const seatNo = `${row}${seat}`;
                                                            return (
                                                                <>
                                                                    <button
                                                                        key={seatNo}
                                                                        className={`seat w-7 h-7 ${getSeatStatusColor(seatNo)} p-1 rounded-md text-center text-xs seat-${seatNo} disabled:cursor-not-allowed`}
                                                                        onClick={(e) => handleSelect(e, seatNo)}
                                                                    >
                                                                        {seatNo}
                                                                    </button>
                                                                </>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-stretch md:justify-center items-stretch gap-2 w-full px-0 py-4 md:py-3">
                                <button
                                    className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed"
                                    type="submit"
                                    onClick={() => setIsOpenSelectedSeatModal(true)}
                                    disabled={selectedSeats.length === 0 || loading.booking || loading.reserved || loading.seats}
                                >
                                    {loading.booking && <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />}
                                    Book Selected Seats
                                </button>
                                {
                                    authUser?.user?.role === USER_ADMIN_ROLE && (
                                        <button
                                            className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed"
                                            type="submit"
                                            onClick={() => { setHandleCloseReservedConfirmModal(true) }}
                                            disabled={selectedSeats.length === 0 || loading.booking || loading.reserved || loading.seats}
                                        >
                                            {loading.reserved && <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />}
                                            Reserve Selected Seats
                                        </button>
                                    )
                                }
                            </div>
                        </>
                    )
                }
                <Modal
                    isOpen={isOpenReserveSeatModal}
                    closeHandler={handleCloseReservedModal}
                    config={{
                        title: `Make seat no. "${selectedReservedSeate}" as Available`,
                        text: 'This will mark this seat as Available for everyone',
                        buttonText: 'Make Available',
                        buttonHandler: handleMakeAvailable,
                        loading: loading.reserved,
                        buttonClassName: 'bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed'
                    }}
                />
                <Modal
                    isOpen={isOpenReserveConfirmSeatModal}
                    closeHandler={handleCloseReservedConfirmModal}
                    config={{
                        title: <span>Seat no. "<span className="text-skin-base">{selectedSeats?.sort()?.join(', ')}</span>"</span>,
                        text: 'Are you sure you want to reserved these seats?',
                        buttonText: 'Make Reserved',
                        buttonHandler: handleSaveReserve,
                        loading: loading.reserved,
                        buttonClassName: 'bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed'
                    }}
                />
                <Modal
                    isOpen={isOpenSelectedSeatModal}
                    closeHandler={setIsOpenSelectedSeatModal}
                    config={{
                        title: <span>Seat no. "<span className="text-skin-base">{selectedSeats?.sort()?.join(', ')}</span>"</span>,
                        text: 'Are you sure you want to book these seats?',
                        buttonText: 'Book Now',
                        buttonHandler: handleSave,
                        loading: loading.booking,
                        buttonClassName: 'bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed'
                    }}
                />
            </div>
        </>
    );
};

export default ShowSeats;
