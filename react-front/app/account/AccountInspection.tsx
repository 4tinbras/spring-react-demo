'use client'

import {Account} from "@/app/utils";


export default function AccountInspection({inspectedAccount, inspectorIsAdmin}: {
    inspectedAccount: Account,
    inspectorIsAdmin: boolean
}) {

    console.log('returning: ' + inspectedAccount.ownersFirstName);
    console.log('returning: ' + inspectedAccount.ownersSurname);
    console.log('returning: ' + inspectedAccount.contactDetails);

    return (<>
        <h1>Account</h1>
        <div id={'personal-details-inspection-block'}>
            <h2>Personal details</h2>
            <span>{inspectedAccount.ownersFirstName}</span>
            <span>{inspectedAccount.ownersSurname}</span>
            <br/>
            {/*query for contact details*/}
            <span>No Contact Details found</span>
            {/*<span>{inspectedAccount.contactDetails}</span>*/}
        </div>
        {inspectorIsAdmin && (
            <div id={'admin-details-inspection-block'}>
                <h2>Account configuration</h2>
                {/*    form to edit account
                dropdown to change account state
                dropdown to change account type
            */}
            </div>
        )
        }
    </>)
}