import React, { createContext, useState } from 'react';
import { AUTH_USER_LOCALSTORAGE } from '../lib/consts';
const UserContext = createContext();
const defaultUser = {
    isAuthenticated: false,
    user: null,
    token: null,
};
const UserProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem(AUTH_USER_LOCALSTORAGE)) || defaultUser;
    const [authUser, setAuthUser] = useState(user);
    // Handler function to set user credentials
    const login = (credentials) => {
        const newUser = { ...credentials, isAuthenticated: true };
        setAuthUser(newUser);
        localStorage.setItem(AUTH_USER_LOCALSTORAGE, JSON.stringify(newUser));
    };
    const logout = () => {
        setAuthUser(defaultUser);
        localStorage.removeItem(AUTH_USER_LOCALSTORAGE);
    }

    return (
        <UserContext.Provider value={{ authUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
export { UserContext, UserProvider };
