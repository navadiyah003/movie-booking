import { CustomDataTable as DataTable } from "./DataTable";
import { displayDate } from "../lib/utils";

const DataTableUsersBookings = ({ data, className }) => {
    const columns = [
        {
            name: 'Date',
            cell: row => displayDate(row?.showtime?.movie?.releaseDate),
        },
        {
            name: 'Movie',
            cell: row => (
                <span title={row?.movie?.title}>
                    {row?.movie?.title}
                </span>
            ),
        },
        {
            name: 'Start Time',
            cell: row => row?.showtime?.showStartTime,
        },
        {
            name: 'End Time',
            cell: row => row?.showtime?.showEndTime,
        },
        {
            name: 'Seats',
            cell: row => row?.showtime?.bookedSeats,
        },
        {
            name: 'Booked seats',
            cell: row => {
                const allSeats = row?.seats?.map((a) => a.seatNo).join(", ")
                return <span title={allSeats}>{allSeats}</span>
            },
        },
        {
            name: 'Total Amount',
            sortable: true,
            selector: row => row?.totalPrice,
            cell: row => row?.totalPrice,
            minWidth: '300px'
        },
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                className={className}
                pagination
            />
        </>
    )
}

export default DataTableUsersBookings;
