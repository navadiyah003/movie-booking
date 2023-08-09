import { USER_ADMIN_ROLE } from '../consts';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

export const useAuth = () => {
    const userContext = useContext(UserContext);
    try {
        return {
            ...userContext.authUser,
            isAdmin: userContext.authUser.user && userContext.authUser.user.role === USER_ADMIN_ROLE,
            login: userContext?.login,
            logout: userContext?.logout
        }
    } catch (err) {
        return {
            isAuthenticated: false,
            user: null,
            token: null,
            isAdmin: false
        };
    }
}