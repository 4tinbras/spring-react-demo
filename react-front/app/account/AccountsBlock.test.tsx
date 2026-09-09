import {render, screen} from "@testing-library/react";
import {
    AccountsDispatchContext,
    AccountsProvider,
    accountsReducer,
    AuthZContext,
    AuthZContextProps
} from "@/app/StateManagement";
import React from "react";
import AccountsBlock from "@/app/account/AccountsBlock";
import {AccountBlockActions} from "@/app/utils";
import {JWTPayload, jwtVerify, JWTVerifyResult} from "jose";

const correctValidatedJWTPayload: JWTVerifyResult<JWTPayload> = {
    payload: {
        issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`,
        jti: '11',
    },
    protectedHeader: {alg: "RS256"}
}

jest.mock('jose', () => {
    return {
        createRemoteJWKSet: jest.fn(),
        // jwtVerify: jest.fn(),
        // jwtVerify: jest.fn(() =>  correctValidatedJWTPayload ),
        // jwtVerify: jest.fn((one, two, three) =>  correctValidatedJWTPayload ),
        // jwtVerify: jest.fn(() => new Promise<JWTVerifyResult<JWTPayload>>(() => correctValidatedJWTPayload)),
        jwtVerify: jest.fn().mockResolvedValue(
            {
                payload: {
                    issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`,
                    jti: '11',
                },
                protectedHeader: {alg: "RS256"}
            }
        )
        // jwtVerify: jest.fn(() =>
        //     new Promise<JWTVerifyResult<JWTPayload>>((one, two, three) => correctValidatedJWTPayload )),
        // then: jest.fn(result => {
        //     console.log("jwt payload:" + result);
        //     return result.payload;
        // }),
    }
});


const customRender = (ui: React.ReactElement,
                      {contactsProviderProps, authZProviderProps, ...renderOptions}: {
                          [x: string]: any,
                          authZProviderProps: AuthZContextProps
                      }) => {
    return render(
        <AccountsProvider initialState={contactsProviderProps} reducer={accountsReducer}>
            <AuthZContext.Provider {...authZProviderProps} value={authZProviderProps}>{ui}
            </AuthZContext.Provider>
        </AccountsProvider>,
        renderOptions,
    )
}

const validStateProps = {
    type: AccountBlockActions.SetAccounts, payload: {accounts: []}
}

const tokenMissingProps: AuthZContextProps = {
    authZToken: "",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
    tokenPayload: undefined,
    setTokenPayload: jest.fn(),
}

const endUserTokenPresentProps: AuthZContextProps = {
    authZToken: "accessToken",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
    tokenPayload: {"jti": "11", "scope": "someScope"},
    setTokenPayload: jest.fn(),
}

const adminTokenPresentProps: AuthZContextProps = {
    authZToken: "accessToken",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
    tokenPayload: {"jti": "11", "scope": "someScope admin"},
    setTokenPayload: jest.fn(),
}

describe('AccountsBlock ', () => {
    it('for an end-user view shows his own account retrieval button', async () => {

        console.log(jwtVerify("1", {}, {}))

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsBlock/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {contactsProviderProps: validStateProps, authZProviderProps: endUserTokenPresentProps, renderOptions: []})


        expect(screen.getByText('Get your Account'));
        expect(screen.queryByText('Get All Accounts')).not.toBeInTheDocument();
    })

    it('for an administrative view shows all accounts retrieval button', async () => {
        console.log(jwtVerify("1", {}, {}))

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsBlock/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {contactsProviderProps: validStateProps, authZProviderProps: adminTokenPresentProps, renderOptions: []})

        expect(screen.getByText('Get your Account'));
        expect(screen.getByText('Get All Accounts'));
    })

    it('for missing token shows info header', async () => {
        console.log(jwtVerify("1", {}, {}))

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsBlock/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {contactsProviderProps: validStateProps, authZProviderProps: tokenMissingProps, renderOptions: []})

        expect(screen.getByText('You need to login in first'));
        expect(screen.queryByText('Get All Accounts')).not.toBeInTheDocument();
        expect(screen.queryByText('Get your Account')).not.toBeInTheDocument();
    })
})