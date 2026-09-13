'use client'

import {useAccounts} from "@/app/StateManagement";


export default function AccountInspection({inspectorIsAdmin}: {
    inspectorIsAdmin: boolean
}) {
    const {state, dispatchState} = useAccounts();

    return (<>
        <h1>Account</h1>
        <div id={'personal-details-inspection-block'}>
            {}
            <h2>Personal details</h2>
            <span>{state.inspectedAccount.ownersFirstName}</span>
            <span>{state.inspectedAccount.ownersSurname}</span>
            <br/>
            {/*query for contact details*/}
            <span>No Contact Details found</span>
            {/*<span>{state.payload.inspectedAccount.contactDetails}</span>*/}
        </div>
        {inspectorIsAdmin && (
            <div id={'admin-details-inspection-block'}>
                <h2>Account configuration</h2>
                {/* TODO:   form to edit account
                dropdown to change account state
                dropdown to change account type
            */}
            </div>
        )
        }
    </>)
}