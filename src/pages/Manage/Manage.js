import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { RequireAuth } from '../../SoCs/AuthContext/AuthContext';

const Manage = () => {
    return (
        <RequireAuth>
            <Navbar />
            <Outlet />
        </RequireAuth>
    );
};

export default Manage;
