import React, {Dispatch, FormEventHandler, SetStateAction} from "react";
import {decodeJwt, JWTPayload, jwtVerify, RemoteJWKSet} from "jose";
import {ZodSafeParseError, ZodType} from "zod";

export const enum Discriminator {
    ContactDto = 'ContactDto',
    ContactState = 'ContactState',
    ContactViewModel = 'ContactViewModel',
    ReducerAction = 'ReducerAction',
    ErrorResp = 'ErrorResp',
    FormState = 'FormState',
    TokenResponseDto = 'TokenResponseDto',
    Account = 'Account'
}

export interface ContactState {
    readonly discriminator?: Discriminator.ContactState;
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    active: boolean;
    account: string;
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

export interface Account {
    readonly discriminator?: Discriminator.Account;
    uuid: string;
    ownersFirstName: string;
    ownersSurname: string;
    contactDetails: ContactState[];
    accountType: string,
    accountState: string
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
    Failed = "FAILED",
    Initial = "INITIAL",
}

export const enum ContactBlockActions {
    SetContacts = 'SET_CONTACTS',
    SetLoading = 'SET_LOADING',
    SetAll = 'SET_ALL',
}

export const enum AccountBlockActions {
    SetInspectedAccount = 'SET_INSPECTED_ACCOUNT',
    SetLoading = 'SET_LOADING',
    SetAccounts = 'SET_ACCOUNTS',
}

export const enum AccountBlockView {
    AccountsList = 'ACCOUNT_LIST',
    InspectedAccount = 'INSPECTED_ACCOUNT',
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
    dispatch: React.Dispatch<ReducerAction>,
    fieldsSubmissionType: FieldsSubmissionType,
    additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map<FieldsSubmissionType, Map<string, string>>(),
    method: string = 'GET',
    validator: ZodType | undefined = undefined,
    setErrorState: Dispatch<SetStateAction<ZodSafeParseError<any>>> | undefined = undefined
): FormEventHandler => {

    const fetchData = async (formData: Map<string, string>): Promise<void> => {
        await fetchDataWrapper(url, formData, dispatch, fieldsSubmissionType, additionalData, method);
    };

    const onSubmit = (e: any) => {
        e.preventDefault();

        const keyValueMap = createFieldValueMap(fields, e);

        if(validator !== undefined) {
            const object = Object.fromEntries(keyValueMap);
            // validate with zod; if fails - set state and return earlier
            const validationOutcome = validator.safeParse(object);
            if (!validationOutcome.success) {
                setErrorState(validationOutcome.error);   // set state in parent to trigger rerendering with error prompt
                return;
            }
        }

        fetchData(keyValueMap);
    }

    return onSubmit;
};

function createFieldValueMap(fields: string[], e: any) {
    const keyValueMap: Map<string, string> = new Map<string, string>();
    fields.forEach((field) => {
            // TODO: preprocessing to allow lists as value of the form since native field[] isn't viable; native solution would be better
            //TODO: optional retrieval is suboptimal;
            let value = e.target[field]?.value;
            if (field === 'contactDetails' && value != undefined) {
                value = (value as string).split(",");
            }
            // it came off the back of the changes to new record form that somehow broke form for blank uuid
            keyValueMap.set(field, value)
        }
    );

    return keyValueMap;
}

export async function fetchDataWrapper(
    url: string,
    formData: Map<string, string>,
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

        response.then(async result => {
            data = await result.json();

            dispatch({type: FormStatus.Ok.toString(), payload: data});
        });
    } catch (err: any) {
        dispatch({type: FormStatus.Failed.toString(), payload: []});
    }
}

export function onSubmitFetchData(fields: string[], fetchData: (formData: Map<string, string>) => Promise<void>, e: any): Promise<void> {
    const result: Map<string, string> = new Map<string, string>();

    fields.forEach((field) => {
        // TODO: preprocessing to allow lists as value of the form since native field[] isn't viable; native solution would be better
        //TODO: optional retrieval is suboptimal;
        let value = e.target[field]?.value;
        if (field === 'contactDetails' && value != undefined) {
            value = (value as string).split(",");
        }
        // it came off the back of the changes to new record form that somehow broke form for blank uuid
            result.set(field, value)
        }
    );

    return fetchData(result);
}

export async function genericFetch(
    url: string,
    additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map<FieldsSubmissionType, Map<string, string>>(),
    method: string = 'GET',
): Promise<Response> {


    const optionalHeaderParams = additionalData.get(FieldsSubmissionType.HeaderParams);

    const requestConfs: RequestInit = {
        method: method,
        headers: {
            Accept: "*",
            "Access-Control-Allow-Origin": "*",
            credentials: 'include',
            ...optionalHeaderParams !== undefined && Object.fromEntries(optionalHeaderParams)
        },
        body: additionalData.has(FieldsSubmissionType.UrlFormParams) ?
            new URLSearchParams([...additionalData.get(FieldsSubmissionType.UrlFormParams) as Map<string, string>])
            : additionalData.has(FieldsSubmissionType.JsonFormParams) ?
                JSON.stringify(Object.fromEntries(additionalData.get(FieldsSubmissionType.JsonFormParams) as Map<string, string>))
                : undefined
    }

    if (additionalData.has(FieldsSubmissionType.QueryParams)) {
        const queryParams = additionalData.get(FieldsSubmissionType.QueryParams) as Map<string, string>;
        url += "?";
        queryParams.forEach((value, key) => url += key + '=' + value + '&');

        url = url.endsWith('&') ? url.substring(0, url.length - 1) : url;
    }

    return await fetch(url, requestConfs);
}

export function fetchThenHandleBody(endpoint: string, method: string, accessToken: string, handleBody: (formData: any) => void): Promise<void | Response> {
    return fetch(endpoint, {
        method: method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error response received", {cause: response});
        } else {
            return response.json();
        }
    }).then(body => handleBody(body))
}

export function unpackAndSaveTokenResponse(tokenResponse: Promise<Response>, jwks: RemoteJWKSet, options: any,
                                           setAuthZToken: Dispatch<SetStateAction<string>>,
                                           setTokenPayload: Dispatch<SetStateAction<JWTPayload>>,
                                           setRefreshToken: Dispatch<SetStateAction<string>>,
                                           setRefreshTokenPayload: Dispatch<SetStateAction<JWTPayload>>) {
    tokenResponse.then(async (result: Response) => {
        const data: TokenResponseDto = await result.json();

        setAuthZToken(data.access_token);
        setRefreshToken(data.refresh_token);

        //decode token and validate
        let outcome = jwtVerify(data.access_token, jwks, options);
        outcome.then(result => {
            return result.payload;
        }).then(payload => {
            setTokenPayload(payload)
        });

        // keycloak doesn't give an option of changing signing key from HS512 and library seems to block it
        // so no verification is possible
        setRefreshTokenPayload(decodeJwt(data.refresh_token));

        // let refreshOutcome = jwtVerify(data.refresh_token, jwks, options);
        // refreshOutcome.then(result => {
        //     return result.payload;
        // }).then(payload => {
        //     setRefreshTokenPayload(payload)
        // });
    });
}
