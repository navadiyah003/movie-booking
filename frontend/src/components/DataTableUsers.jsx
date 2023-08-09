import { useState } from "react";
import { Link } from "react-router-dom";
import { CustomDataTable as DataTable } from "./DataTable";
import { MdEdit } from "react-icons/md";
import SearchBox from "./UI/SearchBox";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "./UI/Modal";

const DataTableUsers = ({ data, className }) => {
    const [userList, setUsersList] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({ user: "", show: false })
    const columns = [
        {
            name: 'Emp Id',
            sortable: true,
            selector: row => row.empId,
            cell: row => <Link to={`/admin/users/booking/${row._id}`} className="underline text-blue-500">{row.empId}</Link>,
        },
        {
            name: 'Name',
            cell: row => <div className="w-72 md:w-80">{row.name}</div>,
        },
        {
            name: 'Email',
            cell: row => <div className="w-72">{row.email}</div>,
        },
        {
            name: 'Mobile',
            cell: row => <div>{row.mobile}</div>,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="space-x-4">
                    <button to="#" className="inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white" title="Edit"><MdEdit size={15} /></button>

                    <button onClick={() => openConfirmModal(row.name)} className="text-lg inline-block p-2 rounded-lg transition duration-200 border border-red-500 text-center text-red-500 font-serif hover:bg-red-500 hover:text-white" title="Remove"><AiOutlineDelete size={15} /></button>
                </div>
            ),
        },
    ];
    const onOkConfirmDelete = () => {
        console.log("Api called for delete");
        closeConfirmModal()
    }
    const confirmConfig = {
        title: 'Are you sure you want to remove this user ?',
        buttonText: 'Ok',
        text: showDeleteConfirm ? `Name : ${showDeleteConfirm.movie}` : "",
        buttonHandler: onOkConfirmDelete
    }
    const closeConfirmModal = () => {
        setShowDeleteConfirm({
            movie: "",
            show: false
        })
    }
    const openConfirmModal = (text) => {
        setShowDeleteConfirm({
            movie: text,
            show: true
        })
    }


    return (
        <>
            <SearchBox data={data} setData={setUsersList} setIsLoading={setIsLoading} />
            <DataTable
                columns={columns}
                data={userList}
                className={className}
                pagination
                paginationPerPage={20}
                title="Users List"
                progressPending={isLoading}
            />
            {showDeleteConfirm && <Modal isOpen={showDeleteConfirm.show} closeHandler={closeConfirmModal} config={confirmConfig} />}
        </>
    )
}

export default DataTableUsers;
