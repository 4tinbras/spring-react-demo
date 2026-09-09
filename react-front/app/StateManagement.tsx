'use client';
import React, {createContext, Dispatch, SetStateAction, useContext, useReducer, useState} from 'react';
import {Account, ContactBlockActions, ContactViewModel, FormStatus, ReducerAction} from "@/app/utils";
import {JWTPayload} from "jose";

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

export type AccountsState = {
    status: FormStatus,
    accounts: Account[],
    inspectedAccount?: Account
}

export type AccountsContextProps = {
    state: AccountsState,
    dispatchState: Dispatch<ReducerAction>
}

export const AccountsDispatchContext = createContext<AccountsContextProps | undefined>(undefined);

export const accountsReducer = (state: AccountsState, action: ReducerAction) => {
// @ts-ignore
    if (Object.values(FormStatus).includes(action.type)) {
        switch (action.type) {
            case FormStatus.Ok: {
            }
        }
    }
}

export const AccountsProvider =
    ({children, reducer, initialState}:
     { children: any, reducer: (state: AccountsState, action: ReducerAction) => any, initialState: AccountsState }) => {

        const [state, dispatchState] = useReducer(reducer, initialState)

        return (
            // @ts-ignore
            <AccountsDispatchContext.Provider value={{state, dispatchState}}>
                {children}
            </AccountsDispatchContext.Provider>
        );
    };

export const useAccounts = () => {
    const consumer = useContext(AccountsDispatchContext);

    if (!consumer) {
        throw new Error("This function is valid only within scope of AccountsDispatchContextProvider");
    }

    return consumer;
}

// ______________________________________________________________________


export type AuthZContextProps = {
    authZToken: string;
    setAuthZToken: Dispatch<SetStateAction<string>>;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    tokenPayload: JWTPayload | undefined;
    setTokenPayload: Dispatch<SetStateAction<JWTPayload>>;
}

export const AuthZContext = createContext<AuthZContextProps | undefined>(undefined);

// Create a provider component
export const AuthZProvider = ({children}: { children: any }) => {
    const [authZToken, setAuthZToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('HOME');
    const [tokenPayload, setTokenPayload] = useState<JWTPayload>();

    return (
        // @ts-ignore
        <AuthZContext.Provider value={{authZToken, setAuthZToken, tokenPayload, setTokenPayload}}>
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