import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';

const AuthentiCate = ({ children }) => {
    const { isAuthenticated } = useAuth();
    // TODO: Roal check
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='app-wrapper'>
            {children}
        </div>
    )
}

export default AuthentiCate