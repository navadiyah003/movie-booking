import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../components/UI/Loader";
import { getAllUserBookings } from "../../../lib/utils";
import DataTableUsersBookings from "../../../components/DataTableUsersBookings";
import { useAuth } from "../../../lib/hooks/useAuth";

const UserMovieBooking = () => {
    const [data, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const { token } = useAuth();
    useEffect(() => {
        const response = async () => {
            const data = await getAllUserBookings(userId, token);
            setResponse(data?.bookings);
            setLoading(false);
        };
        response();
    }, [userId]);
    return (
        <>
            <main className="movies-page">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">All Bookings</h1>
                    <Link
                        to="/admin/users"
                        className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        <div className="flex gap-2 items-center">
                            <div>All Users</div>
                        </div>
                    </Link>
                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableUsersBookings data={data} />
                    )}
                </div>
            </main>
        </>
    );
};

export default UserMovieBooking;
