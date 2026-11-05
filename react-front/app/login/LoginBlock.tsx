import {
    FieldsSubmissionType,
    FormStatus,
    genericFetch,
    ReducerAction,
    unpackAndSaveTokenResponse
} from "@/app/utilities/utils";
import React, {useReducer} from "react";
import {useSearchParams} from 'next/navigation'
import {useAuthZ} from "@/app/StateManagement";
import {createRemoteJWKSet} from "jose";
import {useLocalStorage} from 'usehooks-ts'
import {PrimaryButton} from "@/app/utilities/prefabComponents";

export default function LoginBlock({}: {}) {
    const AUTHORIZATION_SERVER_URL = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}`;
    const AUTHORIZATION_ENDPOINT_PATH = `${process.env.NEXT_PUBLIC_AUTHZ_ENDPOINT}`;
    const TOKEN_ENDPOINT_PATH = `${process.env.NEXT_PUBLIC_TOKEN_ENDPOINT}`;
    const OAUTH_CLIENT_NAME = `${process.env.NEXT_PUBLIC_OAUTH_CLIENT}`;

    const [scopes, setScopes] = useLocalStorage<string>('scopes', "openid profile");

    const onScopesChange = (e: any) => {
        setScopes(e.target.value);
    }

    // TODO: replace verifier with randomised S256 value
    const AUTHORIZATION_QUERY = "?client_id=" + OAUTH_CLIENT_NAME +
        "&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin" +
        "&grant_type=authorization_code&response_type=code" +
        "&code_challenge=My_Custom_CodeVerifier_But_Its_Length_Must_Be_AtLeast_43_Characters" +
        "&code_challenge_method=plain" +
        "&scope=" + scopes;
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
            ['client_id', OAUTH_CLIENT_NAME],
            ['redirect_uri', 'http://localhost:3000/login'],
            ['grant_type', 'authorization_code'],
            ['scope', scopes]
        ])]
    ])

    const searchParams = useSearchParams();
    const authzCodeValue = searchParams.get("code");

    const {
        authZToken, setAuthZToken, tokenPayload, setTokenPayload,
        refreshToken, setRefreshToken, refreshTokenPayload, setRefreshTokenPayload
    } = useAuthZ();
    const accessToken = authZToken;

    const options = {
        algorithms: ['RS256', 'HS512'], //hs512 doesn't work regardless of being listed here
        issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`
    };

    const jwksUri = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}` + `${process.env.NEXT_PUBLIC_JWKS_ENDPOINT}`;
    const jwks = createRemoteJWKSet(new URL(jwksUri));

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

                unpackAndSaveTokenResponse(tokenResponse, jwks, options, setAuthZToken, setTokenPayload, setRefreshToken, setRefreshTokenPayload);

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
                </>)
                || state === FormStatus.Failed && (<>
                    <p>Login failed. If problem persists - please try later.</p>
                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)
                || authzCodeValue !== undefined && authzCodeValue !== null && (<>

                    <h2>Please submit form to finalise login</h2>
                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)
                || (<>

                    <h2>Please submit form to initiate login</h2>
                    <label htmlFor={"scopes"}></label>
                    <input id={"scopes"} type={"text"} defaultValue={scopes} onChange={onScopesChange}/>
                    <LoginForm onSubmitHandler={onSubmitHandler}></LoginForm>
                </>)}
        </div>
    )
}

export function LoginForm({onSubmitHandler}: { onSubmitHandler: any }) {
    return (<>
        <form action={"/login"} id={'login-form'} onSubmit={onSubmitHandler}>
            <PrimaryButton initialButtonText={"Log in"}></PrimaryButton>
        </form>
    </>)
}