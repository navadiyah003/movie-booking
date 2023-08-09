import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllUsers } from "../../../lib/utils";
import Loader from "../../../components/UI/Loader";
import DataTableUsers from "../../../components/DataTableUsers";
import { useAuth } from "../../../lib/hooks/useAuth";

const UsersPage = () => {
    const [data, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const response = async () => {
            const data = await getAllUsers(token)
            setResponse(data?.users);
            setLoading(false);
            console.log(data);
        };
        response();
    }, []);
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">Users</h1>
                    <Link
                        to=""
                        className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        <div className="flex gap-2 items-center">
                            <div>Add New Users</div>
                        </div>
                    </Link>
                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableUsers data={data} />
                    )}
                </div>
            </main>
        </>
    );
};

export default UsersPage;
