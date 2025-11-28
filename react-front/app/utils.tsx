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
    fieldsSubmissionType: FieldsSubmissionType = FieldsSubmissionType.JsonFormParams,
    additionalRequestParams: Map<string, string> = new Map<string, string>()
): [FormEventHandler, []] => {

    const fetchData = async (formData: any): Promise<void> => {
        await fetchDataWrapper(url, fields, formData, setStateData, dispatch, additionalHeaders, fieldsSubmissionType, additionalRequestParams);
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        onSubmitFetchData(fields, fetchData, e);
    }

    return [onSubmit, responseData];
};

export async function fetchDataWrapper(
    url: string,
    fields: string[],
    formData: any,
    setStateData: React.Dispatch<SetStateAction<any>>,
    dispatch: React.Dispatch<ReducerAction>,
    additionalHeaders: Map<string, string> = new Map<string, string>(),
    fieldsSubmissionType: FieldsSubmissionType = FieldsSubmissionType.JsonFormParams,
    additionalRequestParams: Map<string, string> = new Map<string, string>()
): Promise<void> {
    dispatch({type: FormStatus.Pending.toString(), payload: null});

    try {
        //TODO: try using spread syntax | constructing/deconstructing to pass in function wuth varargs and execute it
        const response = genericFetch(url, fields, additionalHeaders, fieldsSubmissionType, additionalRequestParams, formData);

        let data;

        response.then(result => data = result.json());

        setStateData(data);
        dispatch({type: FormStatus.Ok.toString(), payload: null});
    } catch (err: any) {
        setStateData(err);
        dispatch({type: FormStatus.Failed.toString(), payload: []});
    }
}

export function onSubmitFetchData(fields: string[], fetchData: (formData: any) => Promise<void>, e: any): Promise<void> {

    const formData = fields.reduce((formData, field) => ({
        ...formData,
        [field]: e.target[field].value,
    }), {});
    return fetchData(formData);
}

export async function genericFetch(
    url: string,
    fields: string[],
    additionalHeaders: Map<string, string> = new Map<string, string>(),
    fieldsSubmissionType: FieldsSubmissionType = FieldsSubmissionType.JsonFormParams,
    additionalRequestParams: Map<string, string> = new Map<string, string>(),
    formData: any
): Promise<Response> {
    let requestConfs: RequestInit = {
        method: "POST",
        headers: {
            Accept: "*",
            "Access-Control-Allow-Origin": "*",
        },
        body: fieldsSubmissionType === FieldsSubmissionType.QueryParams ? undefined
            : fieldsSubmissionType === FieldsSubmissionType.UrlFormParams ? new URLSearchParams(formData)
                : JSON.stringify(formData)
    }
    additionalHeaders.entries().forEach(([key, value]) => {
        // @ts-ignore
        requestConfs.headers[key] = value;
    });

    if (fieldsSubmissionType === FieldsSubmissionType.QueryParams) {
        url += "?";
        fields.forEach(key => url += key + '=' + formData[key] + '&');
        additionalRequestParams.forEach(key => url += key + '=' + formData[key] + '&');
        url = url.at(url.length) === '&' ? url.substring(0, url.length - 1) : url;
    }

    return await fetch(url, requestConfs);
}