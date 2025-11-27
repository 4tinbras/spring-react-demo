import React, {FormEventHandler, SetStateAction} from "react";

export const enum Discriminator {
    ContactDto = 'ContactDto',
    ContactState = 'ContactState',
    ContactViewModel = 'ContactViewModel',
    ReducerAction = 'ReducerAction',
    ErrorResp = 'ErrorResp',
    FormState = 'FormState'
}

export interface ContactState {
    readonly discriminator?: Discriminator.ContactState;
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    active: boolean;
}

export interface ContactDto {
    readonly discriminator?: Discriminator.ContactDto;
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
}

export interface ErrorResp {
    readonly discriminator?: Discriminator.ErrorResp;
    error: string;
}

export interface ContactViewModel {
    readonly discriminator?: Discriminator.ContactViewModel;
    contact: ContactState;
    active: boolean;
    formStatus: FormStatus;
}

export interface FormState {
    readonly discriminator?: Discriminator.FormState;
    state: FormStatus;
    errors: string[];
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
    readonly discriminator?: Discriminator.ReducerAction;
    type: string;
    payload: any;
}

export const enum FieldsSubmissionType {
    QueryParams = 'QueryParams',
    UrlFormParams = 'UrlFormParams',
    JsonFormParams = 'JsonFormParams',
    None = 'None',
}

export const genericSubmitForm = (
    url: string,
    fields: string[],
    responseData: any,
    setStateData: React.Dispatch<SetStateAction<any>>,
    dispatch: React.Dispatch<ReducerAction>,
    additionalHeaders: Map<string, string> = new Map<string, string>(),
    fieldsSubmissionType: FieldsSubmissionType = FieldsSubmissionType.JsonFormParams
): [FormEventHandler, string, []] => {

    const fetchData = async (formData: any) => {
        dispatch({type: FormStatus.Pending.toString(), payload: null});
        console.log(formData);

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

            if (fieldsSubmissionType === FieldsSubmissionType.QueryParams) {
                url += "?";
                fields.forEach(key => url += key + '=' + formData[key] + '&');
                url = url.substring(0, url.length - 1);
            }

            const response = await fetch(url, requestConfs);

            const data = await response.json();

            setStateData(data);
            dispatch({type: FormStatus.Ok.toString(), payload: null});
        } catch (err: any) {
            setStateData(err);
            dispatch({type: FormStatus.Failed.toString(), payload: []});
        }
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        //TODO: isn't always necessary
        const formData = fields.reduce((formData, field) => ({
            ...formData,
            [field]: e.target[field].value,
        }), {});
        fetchData(formData);
    }

    return [onSubmit, status, responseData];
};