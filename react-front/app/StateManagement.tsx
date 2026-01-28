'use client';
import React, {createContext, Dispatch, SetStateAction, useContext, useState} from 'react';

export const ContactsDispatchContext = createContext(null);


export type AuthZContextProps = {
    authZToken: string;
    setAuthZToken: Dispatch<SetStateAction<string>>;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

// Create context
export const AuthZContext = createContext<AuthZContextProps | undefined>(undefined);

// Create a provider component
export const AuthZProvider = ({children}: { children: any }) => {
    const [authZToken, setAuthZToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('HOME');

    return (
        // @ts-ignore
        <AuthZContext.Provider value={{authZToken, setAuthZToken}}>
            {children}
        </AuthZContext.Provider>
    );
};

// Custom hook to use the context
export const useAuthZ = () => {
    const consumer = useContext(AuthZContext);

    if (!consumer) {
        throw new Error("This function is valid only within scope of AuthZContextProvider");
    }

    return consumer;
}