import {FieldsSubmissionType, FormStatus, genericSubmitForm, ReducerAction} from "@/app/utils";
import React, {useReducer, useState} from "react";

export default function LoginBlock({setAccessToken}: { setAccessToken: any }) {
    const FIELDS_ARRAY = ['username', 'password'];

    const initialState = FormStatus.Editing;

    const reducer = (state: any, action: ReducerAction) => {
        // @ts-ignore
        if (Object.values(FormStatus).includes(action.type)) {
            switch (action.type) {
                case FormStatus.Ok: {
                    return {...state, errors: []};
                }
                case FormStatus.Pending: {
                    return {...state, errors: []};
                }
                case FormStatus.Editing: {
                    return {...state, errors: action.payload.errors};
                }
                case FormStatus.Failed: {
                    return {...state, errors: action.payload.errors}
                }
                default: {
                    console.log("hit default clause, which should not happen")
                    return {...state}
                }
            }
        }
        console.log("hit default clause, which should not happen")
        return {...state}
    }

    const [state, dispatch] = useReducer(reducer, initialState)


    const [responseData, setData] = useState<[]>([]);

    let additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map([
        [FieldsSubmissionType.QueryParams, new Map([
            ['client_id', 'spreact-conf'],
            ['redirect_uri', 'http%3A%2F%2Flocalhost%3A8020'],
            ['grant_type', 'authorization_code'],
            ['response_type', 'code']
        ])]
    ])

    // @ts-ignore
    const [onSubmit, refStatus, data] = genericSubmitForm(`${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}`,
        [],
        responseData,
        setData,
        dispatch,
        FieldsSubmissionType.None,
        additionalData,
        'GET'
    );

    const promisedSubmit = new Promise((resolve, reject) => {
        resolve(onSubmit);
    })

    // @ts-ignore
    return (
        <div>
            {state === FormStatus.Ok && (<></>)
                || (
                    <form id={'login-form'} onSubmit={onSubmit}>
                        <label htmlFor={'username'}>Username</label>
                        <input type={'text'} name={'username'}/>
                        <label htmlFor={'password'}>Password</label>
                        <input type={'password'} name={'password'}/>
                        <button type='submit'>Log in</button>
            </form>
                )}
        </div>)
}