import React from 'react'
import { useAuth } from '../lib/hooks/useAuth';
import AdminPanelLayout from '../components/admin/AdminPanelLayout';
import UserPanelLayout from '../components/user/UserPanelLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    const { isAdmin } = useAuth();
    return (
        <>
            {
                isAdmin ? (
                    <AdminPanelLayout>{children}</AdminPanelLayout>
                ) : (
                    <UserPanelLayout>{children}</UserPanelLayout>
                )
            }
            <ToastContainer
                position="top-right"
                autoClose={4000}
                limit={1}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </>
    )
}

export default Layout