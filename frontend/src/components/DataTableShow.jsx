import { useEffect, useState } from "react";
import Axios from "../lib/axiosInstance";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../lib/consts";
import { CustomDataTable as DataTable } from "./DataTable";
import { useAuth } from "../lib/hooks/useAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdAirlineSeatReclineExtra, MdEdit } from "react-icons/md";
import { displayTime } from "../lib/utils";

const DataTableShow = ({ data, movieId, className }) => {
    const { token } = useAuth();
    const [showsData, setShowsData] = useState(data);
    const handleShowStatusChange = (row) => {
        const newStatus = row.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;

        Axios('PUT', `show/chnageShowStatus/${movieId}/${row._id}`, { status: newStatus }, { authRequest: true, token: token })
            .then((res) => {
                if (res.data?.show) {
                    const newShow = res.data?.show;
                    const newShowList = showsData.map(prevData => {
                        return (prevData.title === newShow.title) ? { ...prevData, status: newShow.status } : prevData;
                    });
                    setShowsData(newShowList);
                    toast.success(`${newShow.title} status changed to ${newShow.status}`)
                }
            }).catch(err => {
                toast.error(`${err.message}`);
            });
    }
    const columns = [
        {
            name: 'Show',
            selector: row => row.title,
        },
        {
            name: 'Start Time',
            selector: row => displayTime(row.showStartTime),
        },
        {
            name: 'End Time',
            selector: row => displayTime(row.showEndTime),
        },
        {
            name: 'Action',
            cell: row => (
                <div className="space-x-4">
                    <Link to={`/admin/shows/edit-show?showId=${row._id}&showTitle=${row.title}&movieId=${movieId}`} className="inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white" title="Edit"><MdEdit size={15} /></Link>

                    {(row?.status === STATUS_ACTIVE && row?.showStartTime !== '--:--' && row?.showEndTime !== '--:--') && <Link to={`/admin/shows/edit-show/seats?movieId=${movieId}&showId=${row._id}`} className="text-lg inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white" title="Seats"><MdAirlineSeatReclineExtra size={15} /></Link>}
                </div>
            ),
        },
        {
            name: "Enable",
            selector: 'status',
            sortable: true,
            cell: (row) => (
                <button
                    title={`${row.status === STATUS_ACTIVE
                        ? "Deactive this show"
                        : "Activeate this show"
                        } `}
                    name={`enable-show--${row._id}`}
                    className={`text-xs ${row.status === STATUS_ACTIVE ? "bg-green-300 hover:bg-green-600 hover:text-white" : "bg-yellow-300 hover:bg-yellow-600 hover:text-white"
                        } inline-block py-2 px-4 rounded-lg transition duration-200 text-black cursor-pointer w-24 disabled:opacity-70 disabled:cursor-not-allowed`}
                    defaultChecked={row.status === STATUS_ACTIVE ? true : false}
                    onClick={(e) => handleShowStatusChange(row)}
                    disabled={(row?.showStartTime === '--:--' && row?.showEndTime === '--:--')}
                >
                    {row.status}
                </button>
            ),
        }
    ];

    useEffect(() => {
        setShowsData(data);
    }, [data]);

    return (
        <>
            <DataTable
                columns={columns}
                data={showsData}
                className={className}
            />
        </>
    )
}

export default DataTableShow;