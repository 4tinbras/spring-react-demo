import {render} from "@testing-library/react";
import {AccountsDispatchContext, AccountsProvider, accountsReducer} from "@/app/StateManagement";
import React from "react";
import AccountsBlock from "@/app/account/AccountsBlock";
import {AccountBlockActions} from "@/app/utils";

jest.mock('jose', () => ({
    jwtVerify: () => "eyJleHAiOjE3ODg3ODU4MTYsImlhdCI6MTc4ODc4NTUxNiwiYXV0aF90aW1lIjoxNzg4Nzg1NTE0LCJqdGkiOiJvbnJ0YWM6ZDU2MWQ1OGUtZjVlMC1hNTQwLTU2NjgtNWM2ZDc2Njg5YTZhIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDIwL3JlYWxtcy9zcHJlYWN0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImExMjA4YTQ2LTNkZDItNDNiMS05YTIxLWIyM2YyNDdmNTQxZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InNwcmVhY3QtY2xpZW50Iiwic2lkIjoiZGY2OWYyYjgtNjcxNS02MjE1LTMxMjYtN2M2NGY0NTkwOWNjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3d3dy5rZXljbG9hay5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3ByZWFjdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiSm9lIERvZSIsInByZWZlcnJlZF91c2VybmFtZSI6InNwcmVhY3QtdmFuaWxsYSIsImdpdmVuX25hbWUiOiJKb2UiLCJmYW1pbHlfbmFtZSI6IkRvZSIsImVtYWlsIjoiam9lZG9lQGV4YW1wbGUuY29tIn0"
}));


const customRender = (ui: any, {providerProps, ...renderOptions}: {
    [x: string]: any,
    providerProps: any
}) => {
    return render(
        <AccountsProvider initialState={providerProps} reducer={accountsReducer}>{ui}</AccountsProvider>,
        renderOptions,
    )
}

const validStateProps = {
    type: AccountBlockActions.SetAccounts, payload: {accounts: []}
}

describe('AccountsBlock ', () => {
    it('for an end-user view shows his own account', async () => {
        customRender(<AccountsDispatchContext.Consumer>
            {value => <AccountsBlock></AccountsBlock>}
        </AccountsDispatchContext.Consumer>, {providerProps: validStateProps, renderOptions: []})
    })

    it('for an administrative view shows all accounts', async () => {

    })
})