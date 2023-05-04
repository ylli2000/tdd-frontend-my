import { createContext, useContext, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { userDmo } from './AuthContext.model';

//the Context pattern
export const AuthContext = createContext();

export const RequireAuth = ({ children }) => {
    const { authed } = useContext(AuthContext);
    const location = useLocation();
    return authed ? children : <Navigate to="/Login/" replace state={{ path: location.pathname }} />;
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(userDmo());
    const assignAuth = (dto) => {
        //loginDto
        setAuth({
            ...dto,
            authed: true,
        });
    };
    const clearAuth = () => {
        setAuth(userDmo());
    };
    return <AuthContext.Provider value={{ ...auth, assignAuth, clearAuth }}>{children}</AuthContext.Provider>;
};
