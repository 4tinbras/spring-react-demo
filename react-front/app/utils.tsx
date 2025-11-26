import React, {FormEventHandler, SetStateAction} from "react";

export interface ContactState {
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    active: boolean;
}

export interface ContactViewModel {
    contact: ContactState;
    active: boolean;
    formStatus: FormStatus;
}

export const enum FormStatus {
    Editing = "EDITING",
    Pending = "PENDING",
    Ok = "OK",
    Failed = "FAILED"
}

export const enum ContactBlockActions {
    SetContacts = 'SET_CONTACTS',
    SetLoading = 'SET_LOADING',
    SetAll = 'SET_ALL',
}

export interface ReducerAction {
    type: string;
    payload: any;
}

export const genericSubmitForm = (
    url: string,
    fields: string[],
    responseData: any,
    setStateData: React.Dispatch<SetStateAction<any>>,
    dispatch: React.Dispatch<ReducerAction>,
    additionalHeaders: Map<string, string> = new Map<string, string>(),
): [FormEventHandler, string, []] => {

    const fetchData = async (formData: any) => {
        dispatch({type: FormStatus.Pending.toString(), payload: null});

        try {
            let requestConfs: RequestInit = {
                method: "POST",
                headers: {
                    Accept: "*",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(formData)
            }
            additionalHeaders.entries().forEach(([key, value]) => {
                // @ts-ignore
                requestConfs.headers[key] = value;
            });

            const response = await fetch(url, requestConfs);

            const data = await response.json();

            setStateData(data);
            dispatch({type: FormStatus.Ok.toString(), payload: null});
        } catch (err: any) {
            setStateData(err);
            dispatch({type: FormStatus.Failed.toString(), payload: null});
        }
    };

    const onSubmit = (e: any) => {
        e.preventDefault();


        const formData = fields.reduce((formData, field) => ({
            ...formData,
            [field]: e.target[field].value,
        }), {});
        fetchData(formData);
    }

    return [onSubmit, status, responseData];
};