import {act, fireEvent, render, screen} from "@testing-library/react";
import {
    AccountsDispatchContext,
    AccountsProvider,
    accountsReducer,
    AuthZContext,
    AuthZContextProps
} from "@/app/StateManagement";
import React from "react";
import AccountsBlock from "@/app/account/AccountsBlock";
import {Account, AccountBlockActions, ErrorResp} from "@/app/utils";
import {JWTPayload, JWTVerifyResult} from "jose";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";

const server = setupServer();

const getAllAccounts = http.get<{}, never, Account[] | ErrorResp>('http://localhost:8080/accounts', function* (request) {
    let response: Account | ErrorResp;
    console.log('entered response mocking')

    if (request.request.headers.get('Authorization') === 'Bearer accessToken') {
        let response1 = {contactDetails: [1, 2], ownersFirstName: "Tom", ownersSurname: "Smith", uuid: "1"}
        let response2 = {contactDetails: [2, 3], ownersFirstName: "Joe", ownersSurname: "Doe", uuid: "2"}
        return HttpResponse.json([response1, response2])
    } else {
        console.log('setting response to invalid')
        return HttpResponse.json({error: 'Not authorised'}, {status: 401})
    }
},)

const getSingleAccount = http.get<{}, never, Account | ErrorResp>('http://localhost:8080/account/1', function* (request) {
    let response: Account | ErrorResp;
    console.log('entered response mocking')

    if (request.request.headers.get('Authorization') === 'Bearer accessToken') {
        let response = {contactDetails: [1, 2], ownersFirstName: "Tom", ownersSurname: "Smith", uuid: "1"}
        return HttpResponse.json(response)
    } else {
        console.log('setting response to invalid')
        return HttpResponse.json({error: 'Not authorised'}, {status: 401})
    }
},)

server.use(getSingleAccount);
server.use(getAllAccounts);


beforeAll(() => server.listen())
// TODO: that deregisters handlers declared with use(), so conflicts with current setup
// reset any request handlers that are declared as a part of the tests
// afterEach(() => server.resetHandlers())
afterAll(() => server.close())

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
        jwtVerify: jest.fn().mockResolvedValue(
            {
                payload: {
                    issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`,
                    jti: '11',
                },
                protectedHeader: {alg: "RS256"}
            }
        )
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

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsBlock/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {contactsProviderProps: validStateProps, authZProviderProps: endUserTokenPresentProps, renderOptions: []})


        expect(screen.getByText('Get your Account'));
        expect(screen.queryByText('Get All Accounts')).not.toBeInTheDocument();

        const contactsButton = screen.getByRole('button', {name: 'Get your Account'})

        act(() => {
            fireEvent.click(contactsButton)
        });

        await screen.findByText('Tom');
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration')).not.toBeInTheDocument();

    })

    it('for an administrative view shows all accounts retrieval button', async () => {

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsBlock/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {contactsProviderProps: validStateProps, authZProviderProps: adminTokenPresentProps, renderOptions: []})

        expect(screen.getByText('Get your Account'));
        expect(screen.getByText('Get All Accounts'));

        const contactsButton = screen.getByRole('button', {name: 'Get your Account'})

        act(() => {
            fireEvent.click(contactsButton)
        });

        await screen.findByText('Tom');
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration')).toBeInTheDocument();
    })

    it('for missing token shows info header', async () => {

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