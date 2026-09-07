'use client'
import {AccountsProvider, accountsReducer} from "@/app/StateManagement";
import AccountsBlock from "./AccountsBlock";
import {FormStatus} from "@/app/utils";


export default function AccountsPage({}: {}) {

    return (
        <>
            <AccountsProvider initialState={{accounts: [], status: FormStatus.Initial}} reducer={accountsReducer}>
                <AccountsBlock></AccountsBlock>
            </AccountsProvider>
        </>
    )
}