import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FlagList from './components/FlagList/FlagList';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import Activate from './pages/Activate/Activate';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Users from './pages/Users/Users';
import User from './pages/User/User';
import Manage from './pages/Manage/Manage';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import { AuthProvider } from './SoCs/AuthContext/AuthContext';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/Home" />} />
                    <Route path="/Home/" element={<Home />} />
                    <Route path="/SignUp/" element={<SignUp />} />
                    <Route path="/Activate/" element={<Activate />} />
                    <Route path="/Activate/:id" element={<Activate />} />
                    <Route path="/Login/" element={<Login />} />
                    <Route path="/Manage/" element={<Manage />}>
                        <Route index element={<Dashboard />} />
                        <Route path="Dashboard/" element={<Dashboard />} />
                        <Route path="Profile/" element={<Profile />} />
                        <Route path="Users/" element={<Users />} />
                        <Route path="Users/:id" element={<User />} />
                    </Route>
                    <Route index path="*" element={<PageNotFound />} />
                </Routes>
                <FlagList />
            </BrowserRouter>
        </AuthProvider>
    );
}
export default App;
