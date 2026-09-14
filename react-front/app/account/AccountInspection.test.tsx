import {render, screen} from "@testing-library/react";
import AccountInspection from "@/app/account/AccountInspection";
import React from "react";
import {
    AccountsDispatchContext,
    AccountsProvider,
    accountsReducer,
    AuthZContext,
    AuthZContextProps
} from "@/app/StateManagement";
import {AccountBlockActions, FormStatus} from "@/app/utils";

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

const inspectedAccount = {uuid: "1", ownersFirstName: "Tom", ownersSurname: "Smith", contactDetails: []};

const validStatePropsWithInspection = {
    type: AccountBlockActions.SetInspectedAccount,
    payload: {inspectedAccount: inspectedAccount, status: FormStatus.Ok},
    inspectedAccount: inspectedAccount,
}

const validStatePropsWithInspectionAndAccounts = {
    type: AccountBlockActions.SetInspectedAccount,
    payload: {inspectedAccount: inspectedAccount, status: FormStatus.Ok},
    inspectedAccount: inspectedAccount,
    accounts: [inspectedAccount]
}

const endUserTokenPresentProps: AuthZContextProps = {
    authZToken: "accessToken",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
    tokenPayload: {"jti": "11", "scope": "someScope"},
    setTokenPayload: jest.fn(),
}

describe('AccountInspection ', () => {
    it('for an end-user view shows his own details', async () => {

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountInspection inspectorIsAdmin={false}/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {
                contactsProviderProps: validStatePropsWithInspection,
                authZProviderProps: endUserTokenPresentProps,
                renderOptions: []
            })

        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration')).not.toBeInTheDocument();
    })

    it('given an admin view shows his own details as well as admin options and no return to list button', async () => {

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountInspection inspectorIsAdmin={true}/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {
                contactsProviderProps: validStatePropsWithInspection,
                authZProviderProps: endUserTokenPresentProps,
                renderOptions: []
            })

        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration'));
        expect(screen.queryByText('Return to the list')).not.toBeInTheDocument();
    })

    it('given an admin view and list fetched it shows back to list button', async () => {

        customRender(<AccountsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <AccountInspection inspectorIsAdmin={true}/>}

                </AuthZContext.Consumer>}</AccountsDispatchContext.Consumer>,
            {
                contactsProviderProps: validStatePropsWithInspectionAndAccounts,
                authZProviderProps: endUserTokenPresentProps,
                renderOptions: []
            })

        expect(screen.queryByText('Tom'));
        expect(screen.queryByText('Smith'));
        expect(screen.queryByText('No Contact Details found'));
        expect(screen.queryByText('Personal details'));
        expect(screen.queryByText('Account configuration'));
        expect(screen.queryByText('Return to the list'));
    })
})