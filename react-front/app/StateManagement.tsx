'use client';
import React, {createContext, Dispatch, SetStateAction, useContext, useReducer, useState} from 'react';
import {ContactBlockActions, ContactViewModel, FormStatus, ReducerAction} from "@/app/utils";

export type ContactsState = {
    status: FormStatus,
    contacts: ContactViewModel[]
}

export type ContactsContextProps = {
    state: ContactsState,
    dispatchState: Dispatch<ReducerAction>
}

export const ContactsDispatchContext = createContext<ContactsContextProps | undefined>(undefined);

export const contactsReducer = (state: ContactsState, action: ReducerAction) => {
    // @ts-ignore
    if (Object.values(FormStatus).includes(action.type)) {
        return {...state}
        // @ts-ignore
    } else if (Object.values(ContactBlockActions).includes(action.type)) {
        switch (action.type) {
            case ContactBlockActions.SetContacts: {
                return {...state, contacts: action.payload.contacts};
            }
            case ContactBlockActions.SetLoading: {
                return {...state, status: action.payload.status};
            }
            case ContactBlockActions.SetAll: {
                return {...state, ...action.payload}
            }
            default: {
                console.log("hit default clause, which should not happen")
                return {...state}
            }
        }
    }
    console.log("hit default clause, which should not happen")
    return {...state}
}

const initialContactsState: ContactsState = {contacts: [], status: FormStatus.Initial}

export const ContactsProvider =
    ({children, reducer, initialState}:
     { children: any, reducer: (state: ContactsState, action: ReducerAction) => any, initialState: ContactsState }) => {

        const [state, dispatchState] = useReducer(reducer, initialState)

        return (
            // @ts-ignore
            <ContactsDispatchContext.Provider value={{state, dispatchState}}>
                {children}
            </ContactsDispatchContext.Provider>
        );
    };

export const useContacts = () => {
    const consumer = useContext(ContactsDispatchContext);

    if (!consumer) {
        throw new Error("This function is valid only within scope of ContactsDispatchContextProvider");
    }

    return consumer;
}

// ______________________________________________________________________


export type AuthZContextProps = {
    authZToken: string;
    setAuthZToken: Dispatch<SetStateAction<string>>;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

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