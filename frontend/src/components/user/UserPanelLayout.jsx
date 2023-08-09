import { Navigate } from 'react-router-dom';
import NavBar from "../NavBar"
import { useAuth } from "../../lib/hooks/useAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPanelLayout = ({ children }) => {
    const { isAdmin } = useAuth();
    if (isAdmin) {
        return <Navigate to="/admin" />;
    }
    return (
        <>
            <NavBar />
            <main className="w-full min-h-screen bg-gray-700 pt-20">
                {children}
            </main>
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

export default UserPanelLayout;