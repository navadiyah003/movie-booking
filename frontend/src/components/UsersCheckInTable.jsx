import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Axios from "../lib/axiosInstance";
import Clipboard from "clipboard";
import { displayDate, displayTime } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

import { AiOutlineCopy } from 'react-icons/ai'
import { toast } from "react-toastify";
import { BOOKING_STATUS } from "../lib/consts";
const UsersCheckInTable = ({ show, showStartTime}) => {
    const [data, setData] = useState([])
    const [tempData, setTempData] = useState([])
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();

    const chnageBookingStatus = (id, status) => {
        Axios('PUT', `booking/chnage-booking-status/${id}`, { newStatus: status }, { authRequest: true, token: token })
            .then((res) => {
                if (res.status === 200) {
                    const updatedBookings = data.map((booking) => {
                        if (booking.bookingId === id) {
                            console.log(booking.bookingId, id);
                            return { ...booking, status: res?.data?.status };
                        }
                        return booking;
                    });
                    setData(updatedBookings)
                }

            })
            .finally(() => {
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        setLoading(true);
        Axios('GET', `show/show-info/${show?._id}`, null, { authRequest: true, token: token })
            .then((res) => {
                setData(res.data?.bookings);
                console.log(res.data);
                setTempData(res.data?.bookings);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });

    }, [show]);

    // Function to handle copy button click
    const handleCopyClick = (event, bookingId) => {
        // Copy the bookingId to the clipboard
        const clipboard = new Clipboard('.copy-button', {
            text: () => bookingId
        });

        // Trigger the copy action
        clipboard.onClick(event);
        toast.success("Copied")
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.user?.name,
        },
        {
            name: 'Booking Id',
            selector: row => (
                <div className="flex gap-1 text-red-600 font-semibold cursor-pointer items-center" onClick={(e) => handleCopyClick(e, row.bookingId)}>
                    <span>{row.bookingId}</span>
                    <AiOutlineCopy title="Copy" className="text-blue-500" >Copy</AiOutlineCopy>
                </div>
            ),
        },
        {
            name: 'Time',
            sortable: true,
            selector: row => `${displayTime(showStartTime)}`,
        },
        {
            name: 'Amount',
            sortable: true,
            selector: row => <div className="text-green-600">₹ {row.totalPrice}</div>,
        },
        // {
        //     name: 'Total Booked Seats',
        //     sortable: true,
        //     minwidth:'400px',
        //     cell: row => row.seats?.length,
        // },
        {
            name: 'Booked seats',
            cell: row => {
                const allSeats = row?.seats?.map((a) => a.seatNo).join(", ")
                return <span title={allSeats}>{allSeats}</span>
            },
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => (
                <div className="space-x-4 flex justify-center">
                    <div className={`${row.status === BOOKING_STATUS.VISITED && "bg-green-400 text-black "} ${row.status === BOOKING_STATUS.BOOKED && "bg-yellow-300 text-black "} ${row.status === BOOKING_STATUS.CANCEL && "bg-red-400 text-black"} p-2 rounded-lg transition duration-200 border text-center `} >{row?.status}</div>
                </div>
            ),
        },

        {
            name: 'Actions',
            minWidth: '150px',
            cell: row => (
                <div className="space-x-4 flex justify-center">
                    <button disabled={row.status === BOOKING_STATUS.CANCEL} onClick={() => {
                        const status = (row.status === BOOKING_STATUS.VISITED ? BOOKING_STATUS.BOOKED : BOOKING_STATUS.VISITED)
                        chnageBookingStatus(row?.bookingId, status)
                    }} className={`${row.status === BOOKING_STATUS.VISITED && "border-red-400 text-red-700 hover:bg-red-500 hover:text-white "}  ${row.status === BOOKING_STATUS.BOOKED && "border-green-600 text-green-700 hover:bg-green-300 disabled:opacity-50 hover:text-black "} p-2 disabled:opacity-50 rounded-lg transition duration-200 border  text-center`} >{row.status === BOOKING_STATUS.VISITED ? "Mark As Booked" : "Mark As Visited"}</button>
                </div>
            ),
        },
    ];

    return (
        <>
            <SearchBox placeholder="Enter booking id ....." data={tempData} setIsLoading={setLoading} setData={setData} />
            <DataTable
                columns={columns}
                data={data}
                // className={className}
                pagination
                paginationPerPage={20}
                title="Shows All Bookings"
                progressPending={isLoading}
            />
        </>
    )
}

export default UsersCheckInTable;
