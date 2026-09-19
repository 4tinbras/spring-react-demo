'use client'

import {useAccounts} from "@/app/StateManagement";
import {useState} from "react";
import {fetchThenHandleBody} from "@/app/utils";
import {FieldError, useForm} from "react-hook-form";
import {accountsValidation} from "@/app/validation/validationUtils";
import {zodResolver} from "@hookform/resolvers/zod";
import * as zod from "zod";
import {ErrorDescriptor, ErrorLevel} from "@/app/error/ErrorBlock";


export default function AccountInspection({inspectorIsAdmin, accessToken}:
                                          { inspectorIsAdmin: boolean, accessToken: string }) {
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
            <button onClick={(event) => onSubmitEdit(event)}>Edit</button>

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
            <Form inspectorIsAdmin={inspectorIsAdmin} accessToken={accessToken}></Form>
        )}
    </>)
}


function Form({inspectorIsAdmin, accessToken}: { inspectorIsAdmin: boolean, accessToken: string }) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<zod.infer<typeof accountsValidation>>({resolver: zodResolver(accountsValidation)});

    const postAccountEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account/1";

    const handleBody = (body: any) => {
    }

    const onSubmit = async (event: any) => {
        event.preventDefault();

        fetchThenHandleBody(postAccountEndpoint, 'POST', accessToken, handleBody);
        console.log("SUCCESS");
    }
    // const foundErrors = Object.values(errors).map((errorItem: FieldError) => {
    //     console.log("ref: " + errorItem.ref);
    //     console.log("root: " + errorItem.root);
    //     console.log("types: " + errorItem.types);
    //     console.log("message: " + errorItem.message);
    //     // const errorDescriptor: ErrorDescriptor = {
    //     //     // @ts-ignore
    //     //     message: errorItem.message,
    //     //     relatedField: errorItem.ref?.toString()
    //     // }
    //     return undefined;
    // });

    Object.entries(errors).map(([key, value]) => {
        console.log("ref: " + (value as FieldError).ref)

        const temp: ErrorDescriptor = {
            id: key,
            // @ts-ignore
            message: (value as FieldError).message,
            errorLevel: ErrorLevel.HardException,
            relatedField: key
        }

        return temp;
    })

    return (
        <form id={"edit-block"} onSubmit={handleSubmit(onSubmit)}>
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
                    <button>Save</button>
                </fieldset>) || (
                <fieldset>
                    <label htmlFor={"ownersFirstNameField"}>Account holder's first name</label>
                    <input id={"ownersFirstNameField"} type={"text"} {...register("ownersFirstName")}/>
                    <label htmlFor={"ownersSurnameField"}>Account holder's surname</label>
                    <input id={"ownersSurnameField"} type={"text"} {...register("ownersSurname")}/>
                    <button>Save</button>
                </fieldset>
            )}
            {/*<ErrorBlock errors={}></ErrorBlock>*/}
        </form>
    )
}