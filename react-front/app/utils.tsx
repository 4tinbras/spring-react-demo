import React, {FormEventHandler, SetStateAction} from "react";

export const enum Discriminator {
    ContactDto = 'ContactDto',
    ContactState = 'ContactState',
    ContactViewModel = 'ContactViewModel',
    ReducerAction = 'ReducerAction',
    ErrorResp = 'ErrorResp',
    FormState = 'FormState',
    TokenResponseDto = 'TokenResponseDto'
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

export interface TokenResponseDto {
    readonly discriminator?: Discriminator.TokenResponseDto;
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
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
    HeaderParams = 'HeaderParams',
    None = 'None',
}

export const genericSubmitForm = (
    url: string,
    fields: string[],
    responseData: any,
    setStateData: React.Dispatch<SetStateAction<any>>,
    dispatch: React.Dispatch<ReducerAction>,
    fieldsSubmissionType: FieldsSubmissionType,
    additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map<FieldsSubmissionType, Map<string, string>>(),
    method: string = 'GET',
): [FormEventHandler, []] => {

    const fetchData = async (formData: Map<string, string>): Promise<void> => {
        await fetchDataWrapper(url, formData, setStateData, dispatch, fieldsSubmissionType, additionalData, method);
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        onSubmitFetchData(fields, fetchData, e);
    }

    return [onSubmit, responseData];
};

export async function fetchDataWrapper(
    url: string,
    formData: Map<string, string>,
    setStateData: React.Dispatch<SetStateAction<any>>,
    dispatch: React.Dispatch<ReducerAction>,
    fieldsSubmissionType: FieldsSubmissionType,
    additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map<FieldsSubmissionType, Map<string, string>>(),
    method: string = 'GET',
): Promise<void> {
    dispatch({type: FormStatus.Pending.toString(), payload: null});

    try {
        additionalData.set(fieldsSubmissionType, formData)

        const response = genericFetch(url, additionalData, method);

        let data;

        response.then(result => data = result.json());

        setStateData(data);
        dispatch({type: FormStatus.Ok.toString(), payload: null});
    } catch (err: any) {
        setStateData(err);
        dispatch({type: FormStatus.Failed.toString(), payload: []});
    }
}

export function onSubmitFetchData(fields: string[], fetchData: (formData: Map<string, string>) => Promise<void>, e: any): Promise<void> {
    const result: Map<string, string> = new Map<string, string>();

    fields.forEach((field) =>
        result.set(field, e.target[field].value));

    return fetchData(result);
}

export async function genericFetch(
    url: string,
    additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map<FieldsSubmissionType, Map<string, string>>(),
    method: string = 'GET',
): Promise<Response> {

    let requestConfs: RequestInit = {
        method: method,
        headers: {
            Accept: "*",
            "Access-Control-Allow-Origin": "*",
            credentials: 'include',
        },
        body: additionalData.has(FieldsSubmissionType.UrlFormParams) ?
            new URLSearchParams([...additionalData.get(FieldsSubmissionType.UrlFormParams) as Map<string, string>])
            : additionalData.has(FieldsSubmissionType.JsonFormParams) ?
                JSON.stringify(Object.fromEntries(additionalData.get(FieldsSubmissionType.JsonFormParams) as Map<string, string>))
                : undefined
    }


    // TODO: refactor to a list that gets expanded with spread operator in original definition
    additionalData.get(FieldsSubmissionType.HeaderParams)?.entries().forEach(([key, value]) => {
        // @ts-ignore
        requestConfs.headers[key] = value;
    });

    if (additionalData.has(FieldsSubmissionType.QueryParams)) {
        const queryParams = additionalData.get(FieldsSubmissionType.QueryParams) as Map<string, string>;
        url += "?";
        queryParams.forEach((value, key) => url += key + '=' + value + '&');

        url = url.endsWith('&') ? url.substring(0, url.length - 1) : url;
    }

    return await fetch(url, requestConfs);
}
