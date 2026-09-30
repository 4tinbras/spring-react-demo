'use client'

import {useAccounts, useAuthZ} from "@/app/StateManagement";
import {AccountBlockActions, fetchThenHandleBody, FormStatus} from "@/app/utils";
import AccountInspection from "@/app/account/AccountInspection";
import AccountsList from "@/app/account/AccountsList";
import {useState} from "react";


export default function AccountsBlock({}: {}) {

    const getAccountsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/accounts";
    const getAccountEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account/1";
    const {authZToken, tokenPayload} = useAuthZ();
    const accessToken = authZToken;

    const {state, dispatchState} = useAccounts();
    const [isLastFetchInspection, setIsLastFetchInspection] = useState(false);

    function handleGetAccounts(isFetchAll: boolean) {
        const endpoint = isFetchAll ? getAccountsEndpoint : getAccountEndpoint;

        const handleAccountBody = (body: any) => {
            if (isFetchAll) {
                setIsLastFetchInspection(false);
                dispatchState({
                    type: AccountBlockActions.SetAccounts,
                    payload: {accounts: Array.isArray(body) ? body : null, status: FormStatus.Ok}
                });
            } else {
                setIsLastFetchInspection(true);
                dispatchState({
                    type: AccountBlockActions.SetInspectedAccount,
                    payload: {inspectedAccount: !Array.isArray(body) ? body : null, status: FormStatus.Ok}
                });
            }
        }

        fetchThenHandleBody(endpoint, 'GET', accessToken, handleAccountBody)
    }

    console.log(isLastFetchInspection)

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
                    {(state.inspectedAccount !== undefined && isLastFetchInspection) && (
                        <AccountInspection inspectorIsAdmin={true} accessToken={accessToken}></AccountInspection>
                    )}
                    {/*    hidden list element*/}
                    {(state.accounts !== undefined && !isLastFetchInspection) && (
                        <AccountsList></AccountsList>
                    )}
                </>)
                || (<>
                    {/*    retrieve only relevant account*/}
                    <button onClick={() => handleGetAccounts(false)} className={'button-primary'}>Get your Account
                    </button>

                    {state.inspectedAccount !== undefined && (
                        <AccountInspection inspectorIsAdmin={false} accessToken={accessToken}></AccountInspection>
                    )}
                </>)) || (
                <><h1>You need to login in first</h1></>)
            }
        </>
    )
}