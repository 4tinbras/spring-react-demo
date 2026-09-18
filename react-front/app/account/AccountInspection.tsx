'use client'

import {useAccounts} from "@/app/StateManagement";
import {useState} from "react";
import {Account} from "@/app/utils";
import {useForm} from "react-hook-form";


export default function AccountInspection({inspectorIsAdmin}: {
    inspectorIsAdmin: boolean
}) {
    const {state, dispatchState} = useAccounts();
    const [editionMode, setEditionMode] = useState(false);


    function onSubmitEdit(event: any) {
        event.preventDefault();

        setEditionMode(!editionMode);
    }

    return (<>
        <h1>Account</h1>

        {!editionMode && (<>
        <div id={'personal-details-inspection-block'}>
            {inspectorIsAdmin && state.accounts !== undefined && state.accounts.length > 0 && (
                <button disabled={true}>Return to the list</button>
            )}
            {!editionMode && (<button onSubmit={onSubmitEdit}>Edit</button>)}

            <h2>Personal details</h2>


            <div id={"info-block"}>
                <span>{state.inspectedAccount.ownersFirstName}</span>
                <span>{state.inspectedAccount.ownersSurname}</span>
                <br/>
                {/*query for contact details*/}
                <span>No Contact Details found</span>
                {/*<span>{state.payload.inspectedAccount.contactDetails}</span>*/}
            </div>
        </div>
        {inspectorIsAdmin && (
            <div id={'admin-details-inspection-block'}>
                <h2>Account configuration</h2>
                {/* TODO:   form to edit account state
                field to show account state
                field to show account type
            */}
            </div>
        )}
        </>) || (
            <Form inspectorIsAdmin={inspectorIsAdmin}></Form>
        )}
    </>)
}


function Form({inspectorIsAdmin}: { inspectorIsAdmin: boolean }) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<Account>();

    const onSubmit = async (data: Account) => {
        console.log("SUCCESS", data);
    }

    // const foundErrors = Object.values(errors).map((errorItem: FieldError) => {
    //     errorItem.
    //     return undefined;
    // });

    return (
        <form id={"edit-block"}>
            {inspectorIsAdmin && (
                <fieldset>
                    <label htmlFor={"ownersFirstNameField"}>Account holder's first name</label>
                    <input id={"ownersFirstNameField"} type={"text"} {...register("ownersFirstName")}/>
                    <label htmlFor={"ownersSurnameField"}>Account holder's surname</label>
                    <input id={"ownersSurnameField"} type={"text"} {...register("ownersSurname")}/>
                    {/* TODO:   form to edit account state
                    dropdown to change account state
                    dropdown to change account type
                    */}
                    <button onSubmit={handleSubmit(onSubmit)}>Save</button>
                </fieldset>) || (
                <fieldset>
                    <label htmlFor={"ownersFirstNameField"}>Account holder's first name</label>
                    <input id={"ownersFirstNameField"} type={"text"} {...register("ownersFirstName")}/>
                    <label htmlFor={"ownersSurnameField"}>Account holder's surname</label>
                    <input id={"ownersSurnameField"} type={"text"} {...register("ownersSurname")}/>
                    <button onSubmit={handleSubmit(onSubmit)}>Save</button>
                </fieldset>
            )}
            {/*<ErrorBlock errors={}></ErrorBlock>*/}
        </form>
    )
}