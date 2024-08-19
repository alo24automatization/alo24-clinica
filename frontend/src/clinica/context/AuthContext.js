// import { createContext } from 'react';

import { createContext } from "react";

function noop() { }


export const AuthContext = createContext({
    token: null,
    userId: null,
    user: null,
    clinica:null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})
