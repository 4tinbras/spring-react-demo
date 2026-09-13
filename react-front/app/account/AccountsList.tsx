'use client'

import {useAccounts} from "@/app/StateManagement";
import {Account, AccountBlockActions, FormStatus} from "@/app/utils";
import {Table} from "reactstrap";
import React, {MouseEventHandler} from "react";


export default function AccountsList() {

    const {state, dispatchState} = useAccounts();

    //TODO: it needs to propagate clicked form so that parent could replace list with inspection view
    // probably from that point onward both pages should include link to switch between views
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

            return <tr key={`${key}`}>
                <AccountRecord key={`${key}records`} uuid={key} account={account}
                               handleClick={handleEditButtonClick}></AccountRecord>
                {/*needs to set status text based on cell state*/}
            </tr>;
        }
    );

    return (<>
        <Table className={"table-striped-columns"}>
            <caption>
                Registered accounts
            </caption>
            <thead>
            <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Linked contact details</th>
            </tr>
            </thead>
            <tbody>
            {listItems}
            </tbody>
        </Table>
    </>)
}


export function AccountRecord({uuid, account, handleClick}: {
    uuid: string,
    account: Account,
    handleClick: any
}) {
    return (<>
        <td><span>{account.ownersFirstName}</span></td>
        <td><span>{account.ownersSurname}</span></td>
        <td><span>{account.contactDetails}</span></td>
        <td><EditAccountButton uuid={uuid} account={account}
                               onClick={(event) => handleClick(event, account)}></EditAccountButton></td>
    </>)
}

export function EditAccountButton({uuid, account, onClick}:
                                  { uuid: string, account: Account, onClick: MouseEventHandler }) {
    return <button onClick={onClick} key={`Edit${uuid}`}
                   form={`form${uuid}`}>{`Edit`}</button>;
}