import {FieldsSubmissionType, FormStatus, genericFetch, ReducerAction, TokenResponseDto} from "@/app/utils";
import React, {useReducer} from "react";
import {useSearchParams} from 'next/navigation'
import {useAuthZ} from "@/app/StateManagement";

export default function LoginBlock({}: {}) {
    const AUTHORIZATION_SERVER_URL = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}`;
    const AUTHORIZATION_ENDPOINT_PATH = `${process.env.NEXT_PUBLIC_AUTHZ_ENDPOINT}`;
    const TOKEN_ENDPOINT_PATH = `${process.env.NEXT_PUBLIC_TOKEN_ENDPOINT}`;
    // TODO: replace verifier with randomised S256 value
    const AUTHORIZATION_QUERY = "?client_id=spreact-client&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&grant_type=authorization_code&response_type=code&code_challenge=My_Custom_CodeVerifier_But_Its_Length_Must_Be_AtLeast_43_Characters&code_challenge_method=plain";
    const AUTHORIZATION_URL = AUTHORIZATION_SERVER_URL + AUTHORIZATION_ENDPOINT_PATH + AUTHORIZATION_QUERY;

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

    const postTokenAdditionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map([
        [FieldsSubmissionType.UrlFormParams, new Map([
            ['client_id', 'spreact-client'],
            ['redirect_uri', 'http://localhost:3000/login'],
            ['grant_type', 'authorization_code'],
        ])]
    ])

    const searchParams = useSearchParams();
    const authzCodeValue = searchParams.get("code");

    const {authZToken, setAuthZToken} = useAuthZ();
    const accessToken = authZToken;

    const onSubmitHandler = (e: any) => {
        e.preventDefault();

        if (authzCodeValue === undefined || authzCodeValue === null || authzCodeValue?.length == 0) {
            window.location.replace(AUTHORIZATION_URL);
        } else {

            try {

                postTokenAdditionalData.get(FieldsSubmissionType.UrlFormParams)?.set('code', authzCodeValue!);
                postTokenAdditionalData.get(FieldsSubmissionType.UrlFormParams)?.set('code_verifier',
                    'My_Custom_CodeVerifier_But_Its_Length_Must_Be_AtLeast_43_Characters');
                const tokenResponse = genericFetch(AUTHORIZATION_SERVER_URL + TOKEN_ENDPOINT_PATH,
                    postTokenAdditionalData, 'POST');

                tokenResponse.then(async (result: Response) => {
                    const data: TokenResponseDto = await result.json();

                    setAuthZToken(data.access_token);
                });

            } catch (err: any) {
                dispatch({type: FormStatus.Failed.toString(), payload: null});
            }
        }
    }

    // @ts-ignore
    return (
        <div>
            {//state === FormStatus.Ok &&
                accessToken.length > 0 && (<>
                    <h2>You have already logged in!</h2>
                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)
                || state === FormStatus.Failed && (<>
                    <text>Login failed. If problem persists - please try later.</text>
                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)
                || authzCodeValue !== undefined && authzCodeValue !== null && (<>

                    <h2>Please submit form to finalise login</h2>
                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)
                || (<>

                    <h2>Please submit form to initiate login</h2>

                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)}
        </div>
    )
}

export function LoginForm({onSubmitHandler}: { onSubmitHandler: any }) {
    return (<>
        {/*TODO: allow customisation of default values i.e. scope*/}
        <form action={"/login"} id={'login-form'} onSubmit={onSubmitHandler}>
            {/*<label htmlFor={'scope'}>scope</label>*/}
            {/*<input type={'text'} name={'scope'}/>*/}
            <button type='submit'>Log in</button>
        </form>
    </>)
}