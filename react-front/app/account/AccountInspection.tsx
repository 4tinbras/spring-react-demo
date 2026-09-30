'use client'

import {AccountsDispatchContext, useAccounts} from "@/app/StateManagement";
import {useContext, useState} from "react";
import {Account, FieldsSubmissionType, genericSubmitForm} from "@/app/utils";
import {FieldError, useForm} from "react-hook-form";
import {accountsValidation} from "@/app/validation/validationUtils";
import {zodResolver} from "@hookform/resolvers/zod";
import * as zod from "zod";
import ErrorBlock, {ErrorDescriptor, ErrorLevel} from "@/app/error/ErrorBlock";


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
                <span className={"display-block full-width"}>{state.inspectedAccount.ownersFirstName}</span>
                <span className={"display-block full-width"}>{state.inspectedAccount.ownersSurname}</span>
                <br/>
                {/*query for contact details*/}
                <span className={"display-block full-width"}>No Contact Details found</span>
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
            <Form inspectorIsAdmin={inspectorIsAdmin} accessToken={accessToken}
                  originalAccount={state.inspectedAccount}></Form>
        )}
    </>)
}


function Form({inspectorIsAdmin, accessToken, originalAccount}: {
    inspectorIsAdmin: boolean,
    accessToken: string,
    originalAccount: Account
}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<zod.infer<typeof accountsValidation>>({resolver: zodResolver(accountsValidation)});

    const postAccountEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account";
    const fieldsArray = ['ownersFirstName', 'ownersSurname', 'contactDetails', 'uuid', 'accountType', 'accountState'];

    // @ts-ignore
    const {dispatchState} = useContext(AccountsDispatchContext);

    const handleBody = (body: any) => {
    }

    const onSubmit = async (data: any, event: any) => {
        event.preventDefault();

        let additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map([
            [FieldsSubmissionType.HeaderParams, new Map([
                ['Content-Type', 'application/json'],
                ['Authorization', `Bearer ${accessToken}`]
            ])]
        ])

        const innerSubmit = genericSubmitForm(`${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account",
            fieldsArray,
            dispatchState,
            FieldsSubmissionType.JsonFormParams,
            additionalData,
            'POST'
        );

        innerSubmit(event);

        console.log("SUCCESS");
    }

    let errorIndex = 0
    const errorList: ErrorDescriptor[] = Object.entries(errors).map(([key, value]) => {
        console.log("ref: " + (value as FieldError).ref)

        const temp: ErrorDescriptor = {
            id: errorIndex.toString(),
            // @ts-ignore
            message: (value as FieldError).message,
            errorLevel: ErrorLevel.HardException,
            relatedField: key
        }
        errorIndex++;
        return temp;
    })

    return (
        <form id={"edit-block"} onSubmit={handleSubmit(onSubmit)}>
            {inspectorIsAdmin && (
                <fieldset>
                    <input hidden id={"uuid"} type={"text"} value={originalAccount.uuid}
                           {...register("id")}/>
                    <label htmlFor={"ownersFirstName"} className={"full-width display-block"}>Account holder's first
                        name</label>
                    <input id={"ownersFirstName"} type={"text"} defaultValue={originalAccount.ownersFirstName}
                           {...register("ownersFirstName")}/>
                    <label htmlFor={"ownersSurname"} className={"full-width display-block"}>Account holder's
                        surname</label>
                    <input id={"ownersSurname"} type={"text"} defaultValue={originalAccount.ownersSurname}
                           {...register("ownersSurname")}/>
                    <input hidden id={"contactDetails"} type={"text"}
                        // defaultValue={originalAccount.contactDetails.map(item => item != undefined ? item.toString() : "[]")}
                           value={"[]"}
                           {...register("contactDetails")}/>
                    {/* TODO:   form to edit account state; change to:
                    dropdown to change account state
                    dropdown to change account type
                    */}
                    <input hidden id={"accountType"} type={"text"} value={"END_USER"} {...register("accountType")}/>
                    <input hidden id={"accountState"} type={"text"} value={"OK"} {...register("accountState")}/>
                    <button>Save</button>
                </fieldset>) || (
                <fieldset>
                    <input hidden id={"uuid"} type={"text"} value={originalAccount.uuid}
                           {...register("id")}/>
                    <label htmlFor={"ownersFirstName"} className={"full-width display-block"}>Account holder's first
                        name</label>
                    <input id={"ownersFirstName"} type={"text"} defaultValue={originalAccount.ownersFirstName}
                           {...register("ownersFirstName")}/>
                    <label htmlFor={"ownersSurname"} className={"full-width display-block"}>Account holder's
                        surname</label>
                    <input id={"ownersSurname"} type={"text"} defaultValue={originalAccount.ownersSurname}
                           {...register("ownersSurname")}/>
                    <input hidden id={"contactDetails"} type={"text"}
                        // defaultValue={originalAccount.contactDetails.map(item => item != undefined ? item.toString() : "[]")}
                           value={"[]"}
                           {...register("contactDetails")}/>
                    {/* TODO:   form to edit account state; ensure it's not necessary for end-user inspection or unmodifiable
                    */}
                    <input hidden id={"accountType"} type={"text"} value={"END_USER"} {...register("accountType")}/>
                    <input hidden id={"accountState"} type={"text"} value={"OK"} {...register("accountState")}/>
                    <button>Save</button>
                </fieldset>
            )}
            <ErrorBlock errors={errorList}></ErrorBlock>
        </form>
    )
}