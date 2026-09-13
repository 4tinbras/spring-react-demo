import {render, screen} from "@testing-library/react";
import React from "react";
import {
    AccountsDispatchContext,
    AccountsProvider,
    accountsReducer,
    AuthZContext,
    AuthZContextProps
} from "@/app/StateManagement";
import {Account, AccountBlockActions} from "@/app/utils";
import AccountsList from "@/app/account/AccountsList";


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

const firstValidAccount: Account = {
    uuid: "11",
    ownersSurname: "Smith",
    ownersFirstName: "Tom",
    contactDetails: []
}

const secondValidAccount: Account = {
    uuid: "21",
    ownersSurname: "Doe",
    ownersFirstName: "Joe",
    contactDetails: []
}

const validStatePropsWithAccounts = {
    type: AccountBlockActions.SetAccounts, payload: {accounts: [firstValidAccount, secondValidAccount]}
}

const validStatePropsWithoutAccounts = {
    type: AccountBlockActions.SetAccounts, payload: {accounts: []}
}

const endUserTokenPresentProps: AuthZContextProps = {
    authZToken: "accessToken",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
    tokenPayload: {"jti": "11", "scope": "someScope"},
    setTokenPayload: jest.fn(),
}

describe('AccountsList ', () => {
    it('given no previous inspection it renders list with edit button and without back to inspection button', async () => {
        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsList/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {
                contactsProviderProps: validStatePropsWithAccounts,
                authZProviderProps: endUserTokenPresentProps,
                renderOptions: []
            })

        expect(screen.queryByText('First Name'));
        expect(screen.queryByText('Last Name'));
        expect(screen.queryByText('Linked contact details'));
        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Doe'));
    })

    it('given previous inspection it renders list with edit button and with back to inspection button', async () => {

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsList/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {
                contactsProviderProps: validStatePropsWithAccounts,
                authZProviderProps: endUserTokenPresentProps,
                renderOptions: []
            })

        expect(screen.queryByText('First Name'));
        expect(screen.queryByText('Last Name'));
        expect(screen.queryByText('Linked contact details'));
        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Doe'));
    })

    it('given no items render empty list and suggests repeated fetch', async () => {
        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountsList/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {
                contactsProviderProps: validStatePropsWithoutAccounts,
                authZProviderProps: endUserTokenPresentProps,
                renderOptions: []
            })


        expect(screen.queryByText('First Name'));
        expect(screen.queryByText('Last Name'));
        expect(screen.queryByText('Linked contact details'));
        expect(screen.queryByText('Tom')).not.toBeInTheDocument();
        expect(screen.queryByText('Doe')).not.toBeInTheDocument();

    })
})