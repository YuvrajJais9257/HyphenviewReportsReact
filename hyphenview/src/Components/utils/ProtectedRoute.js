import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ Component }) => {
    // const token = Cookies.get('token');
    // const value = token ? JSON.parse(token) : null;
    const user = JSON.parse(localStorage.getItem('profile'));
    const location = useLocation();

    if (!user || !user.group_id) {
        return <Navigate to="/app" state={{ from: location }} replace />;
    }

    return <Component />;
};

export default ProtectedRoute;
