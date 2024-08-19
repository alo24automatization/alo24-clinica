import React, { useEffect, useState } from 'react'
import Admin from './Admin'
import { AdminLogin } from './AdminLogin'

const AdminRoutes = () => {

    const adminData = JSON.parse(localStorage.getItem('AdminData'));

    const [isAuthenticated, setIsAuthenticated] = useState(!!adminData?.token)
    const [user, setUser] = useState(adminData?.user);


    if (isAuthenticated && user?.type === 'Admin') {
        return <Admin setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
    } else {
        return <AdminLogin setIsAuthenticated={setIsAuthenticated} setUserData={setUser} />
    }

}

export default AdminRoutes