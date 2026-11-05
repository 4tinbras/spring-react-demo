'use client';
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useEffectEvent,
    useReducer,
    useState
} from 'react';
import {
    Account,
    AccountBlockActions,
    AccountBlockView,
    ContactBlockActions,
    ContactViewModel,
    FieldsSubmissionType,
    FormStatus,
    genericFetch,
    ReducerAction,
    unpackAndSaveTokenResponse
} from "@/app/utilities/utils";
import {createRemoteJWKSet, JWTPayload} from "jose";
import {useLocalStorage} from "usehooks-ts";

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
    inspectedAccount: Account,
    showedView: AccountBlockView
}

export type AccountsContextProps = {
    state: AccountsState,
    dispatchState: Dispatch<ReducerAction>
}

export const AccountsDispatchContext = createContext<AccountsContextProps | undefined>(undefined);

export const accountsReducer = (state: AccountsState, action: ReducerAction) => {
// @ts-ignore
    if (Object.values(FormStatus).includes(action.type)) {
        return {...state}
    } else { // @ts-ignore
        if (Object.values(AccountBlockActions).includes(action.type)) {
            switch (action.type) {
                case AccountBlockActions.SetAccounts: {
                    return {...state, accounts: action.payload.accounts, showedView: AccountBlockView.AccountsList}
                }
                case AccountBlockActions.SetLoading: {
                    return {...state, status: action.payload.status}
                }
                case AccountBlockActions.SetInspectedAccount: {
                    return {
                        ...state,
                        inspectedAccount: action.payload.inspectedAccount,
                        showedView: AccountBlockView.InspectedAccount
                    }
                }
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
    tokenPayload: JWTPayload | undefined;
    setTokenPayload: Dispatch<SetStateAction<JWTPayload>>;

    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;

    refreshToken: string;
    setRefreshToken: Dispatch<SetStateAction<string>>;
    refreshTokenPayload: JWTPayload | undefined;
    setRefreshTokenPayload: Dispatch<SetStateAction<JWTPayload>>;
}

export const AuthZContext = createContext<AuthZContextProps | undefined>(undefined);

// Create a provider component
export const AuthZProvider = ({children}: { children: any }) => {
    const [authZToken, setAuthZToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('HOME');
    const [tokenPayload, setTokenPayload] = useState<JWTPayload>();
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [refreshTokenPayload, setRefreshTokenPayload] = useState<JWTPayload>();

    // ___________________________
    const OAUTH_CLIENT_NAME = `${process.env.NEXT_PUBLIC_OAUTH_CLIENT}`;
    const AUTHORIZATION_SERVER_URL = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}`;
    const TOKEN_ENDPOINT_PATH = `${process.env.NEXT_PUBLIC_TOKEN_ENDPOINT}`;
    const FIVE_MINS_MARGIN = 5 * 60 * 1000;
    const [scopes, setScopes] = useLocalStorage<string>('scopes', "openid profile");

    const options = {
        algorithms: ['RS256', 'HS512'], //hs512 doesn't work regardless of being listed here
        issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`
    };

    const jwksUri = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}` + `${process.env.NEXT_PUBLIC_JWKS_ENDPOINT}`;
    const jwks = createRemoteJWKSet(new URL(jwksUri));

    const onTick = useEffectEvent(() => {
        // dropped milliseconds as tokens do not track it and change in length breaks logic
        const nowInEpoch = Math.floor(new Date().getTime() / 1000);
        // if access token soon expires and refresh token is valid
        if (nowInEpoch + FIVE_MINS_MARGIN > tokenPayload?.exp && tokenPayload?.exp < refreshTokenPayload?.exp) {
            // refresh tokens
            const postTokenAdditionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map([
                [FieldsSubmissionType.UrlFormParams, new Map([
                    ['client_id', OAUTH_CLIENT_NAME],
                    ['redirect_uri', 'http://localhost:3000/login'],
                    ['grant_type', 'refresh_token'],
                    ['scope', scopes],
                    ['refresh_token', refreshToken]
                ])]
            ])

            const tokenResponse = genericFetch(AUTHORIZATION_SERVER_URL + TOKEN_ENDPOINT_PATH,
                postTokenAdditionalData, 'POST');
            unpackAndSaveTokenResponse(tokenResponse, jwks, options, setAuthZToken, setTokenPayload, setRefreshToken, setRefreshTokenPayload);
        }
    });

    useEffect(() => {
        const keepTokenRefreshed = setInterval(() => {
            onTick();
        }, 60 * 1000); //once per minute
        return () => {
            clearInterval(keepTokenRefreshed);
        };
    }, []);
    // ______________________________

    return (
        // @ts-ignore
        <AuthZContext.Provider value={{
            authZToken, setAuthZToken, tokenPayload, setTokenPayload,
            refreshToken, setRefreshToken, refreshTokenPayload, setRefreshTokenPayload
        }}><>
            {children}
        </>
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