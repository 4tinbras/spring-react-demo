'use client'

import {useAccounts, useAuthZ} from "@/app/StateManagement";
import {AccountBlockActions, FormStatus} from "@/app/utils";
import AccountInspection from "@/app/account/AccountInspection";
import AccountsList from "@/app/account/AccountsList";


export default function AccountsBlock({}: {}) {

    const getAccountsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/accounts";
    const getAccountEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account/1";
    const {authZToken, tokenPayload} = useAuthZ();
    const accessToken = authZToken;
    // const decryptedAccessToken: JWTPayload = getValidatedJWT(accessToken);

    const {state, dispatchState} = useAccounts();

    function handleGetAccounts(isFetchAll: boolean) {
        const endpoint = isFetchAll ? getAccountsEndpoint : getAccountEndpoint;
        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("Error response received", {cause: response});
            } else {
                return response.json();
            }
        }).then(body => {
            if (isFetchAll) {
                dispatchState({
                    type: AccountBlockActions.SetAccounts,
                    payload: {accounts: Array.isArray(body) ? body : null, status: FormStatus.Ok}
                });
            } else {
                dispatchState({
                    type: AccountBlockActions.SetInspectedAccount,
                    payload: {inspectedAccount: !Array.isArray(body) ? body : null, status: FormStatus.Ok}
                });
            }
        })
    }

    return (
        <>
            {tokenPayload !== undefined && ((tokenPayload?.scope as string).includes("admin") &&
                (<>
                    {/*    option to retrieve all accounts*/}
                    <button onClick={() => handleGetAccounts(false)} className={'button-primary'}>Get your Account
                    </button>
                    <button onClick={() => handleGetAccounts(true)} className={'button-primary'}>Get All Accounts
                    </button>

                    {/*    hidden inspection element*/}
                    {state.inspectedAccount !== undefined && (
                        <AccountInspection inspectedAccount={state.inspectedAccount}
                                           inspectorIsAdmin={true}></AccountInspection>
                    )}
                    {/*    hidden list element*/}
                    {state.accounts !== undefined && (
                        <AccountsList accounts={state.accounts}></AccountsList>
                    )}
                </>)
                || (<>
                    {/*    retrieve only relevant account*/}
                    <button onClick={() => handleGetAccounts(false)} className={'button-primary'}>Get your Account

                        {state.inspectedAccount !== undefined && (
                            <AccountInspection inspectedAccount={state.inspectedAccount}
                                               inspectorIsAdmin={false}></AccountInspection>
                        )}
                    </button>
                </>)) || (
                <><h1>You need to login in first</h1></>)
            }
        </>
    )
}