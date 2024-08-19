import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import Filials from './Filials'
import RegisterClinica from './RegisterClinica'
import TransferLabTables from './TransferLabTables'
import Users from './Users'

const Admin = ({ setIsAuthenticated, setUser }) => {
    return (
        <>
            <Navbar setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            <Switch>
                <Route path="/alotrade" exact>
                    <RegisterClinica />
                </Route>
                <Route path="/alotrade/users">
                    <Users />
                </Route>
                <Route path="/alotrade/filials">
                    <Filials />
                </Route>
                <Route path="/alotrade/transfer_tables">
                    <TransferLabTables />
                </Route>
            </Switch>
        </>
    )
}

export default Admin