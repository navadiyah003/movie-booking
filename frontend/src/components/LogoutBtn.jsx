import { useContext } from 'react';
import { BiLogOutCircle } from 'react-icons/bi'
import { UserContext } from '../context/userContext';

const LogoutBtn = () => {
    const userContext = useContext(UserContext);
    const handleLogout = () => {
        userContext.logout();   // Context API
    }
    return (
        <>
            <button
                className="flex items-center w-full space-x-2 py-2 px-4 transition duration-200 hover:bg-red-700/20 "
                onClick={handleLogout}
            >
                <span><BiLogOutCircle size={20} /></span>
                <span>Logout</span>
            </button>
        </>
    )
}

export default LogoutBtn