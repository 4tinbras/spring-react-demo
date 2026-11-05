'use client'

import {useAccounts} from "@/app/StateManagement";
import {Account, AccountBlockActions, FormStatus} from "@/app/utilities/utils";
import React, {MouseEventHandler} from "react";


export default function AccountsList() {

    const {state, dispatchState} = useAccounts();

    const handleEditButtonClick = (event: any, account: Account) => {

        dispatchState({
            type: AccountBlockActions.SetInspectedAccount,
            payload: {inspectedAccount: account, status: FormStatus.Ok}
        });
    }


    const getUuidWithFallback = (account: Account): string => {
        return account.uuid !== "" ? account.uuid
            : (Math.max(...state.accounts.values().map(
                (item: Account): number => {
                    const uuid = parseInt(item.uuid, 10);
                    return !isNaN(uuid) ? uuid : 0;
                })
            ) + 1).toString();

    }


    const listItems = state.accounts?.map((account: Account) => {
            //if has uuid (retrieved from backend) use it, otherwise generate subsequent number (to avoid clashes on multiple additions)
            const key = getUuidWithFallback(account);

            return <AccountRecord key={`${key}records`} uuid={key} account={account}
                               handleClick={handleEditButtonClick}></AccountRecord>

        }
    );

    return (<>
        {state.inspectedAccount !== undefined && (
            <button onClick={(event) => handleEditButtonClick(event, state.inspectedAccount)}>
                Return to the inspection
            </button>
        )}
        <div className={"display-colour-alternating-grid four-col-grid"}>
            <span>First Name</span>
            <span>Last Name</span>
            <span>Linked contact details</span>
            <span></span>
            {listItems}
        </div>
    </>)
}


export function AccountRecord({uuid, account, handleClick}: {
    uuid: string,
    account: Account,
    handleClick: any
}) {
    return (<>
        <span>{account.ownersFirstName}</span>
        <span>{account.ownersSurname}</span>
        {/*// @ts-ignore*/}
        <span>{account.contactDetails?.at(0) !== undefined ? account.contactDetails?.at(0).uuid : ""}</span>
        <EditAccountButton uuid={uuid}
                               onClick={(event) => handleClick(event, account)}>
        </EditAccountButton>
    </>)
}

export function EditAccountButton({uuid, onClick}:
                                  { uuid: string, onClick: MouseEventHandler }) {
    return <button onClick={onClick} key={`Edit${uuid}`}
                   form={`form${uuid}`}>{`Edit`}</button>;
}