'use client'

import {useAccounts, useAuthZ} from "@/app/StateManagement";
import {createRemoteJWKSet, JWTPayload, jwtVerify} from 'jose';
import {AccountBlockActions, FormStatus} from "@/app/utils";
import {useState} from "react";


export default function AccountsBlock({}: {}) {

    const getAccountsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/accounts";
    const getAccountEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account";
    const {authZToken} = useAuthZ();
    const accessToken = authZToken;
    // const decryptedAccessToken: JWTPayload = getValidatedJWT(accessToken);

    const {state, dispatchState} = useAccounts();
    const [decryptedAccessToken, setDecryptedAccessToken] = useState<JWTPayload>();

    const jwksUri = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}` + `${process.env.NEXT_PUBLIC_JWKS_ENDPOINT}`;
    console.log("Checking jwks endpoint at: " + jwksUri);

    const jwks = createRemoteJWKSet(new URL(jwksUri));

    console.log("validating jwt...");

    getValidatedJWT(accessToken);

    function getValidatedJWT(accessToken: string): void {
        const options = {
            algorithms: ['RS256'],
            issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`
        };
        let outcome = jwtVerify(accessToken, jwks, options)
            .then(result => {
                console.log("jwt payload:" + result);
                setDecryptedAccessToken(result.payload)
                return result.payload;
            });
    }

    function handleGetAccounts(isFetchAll: boolean) {
        const endpoint = isFetchAll ? getAccountsEndpoint : getAccountEndpoint;
        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("Error response received", {cause: response});
            } else {
                return response.json();
            }
        }).then(body => {
            if (isFetchAll) {
                dispatchState({
                    type: AccountBlockActions.SetAccounts,
                    payload: {accounts: Array.isArray(body) ? body : null, status: FormStatus.Ok}
                });
            } else {
                dispatchState({
                    type: AccountBlockActions.SetInspectedAccount,
                    payload: {inspectedAccount: !Array.isArray(body) ? body : null, status: FormStatus.Ok}
                });
            }
        })
    }

    return (
        <>
            {(decryptedAccessToken?.scope as string).includes("admin") &&
                (<>
                    {/*    retrieve all accounts*/}
                    <button onClick={() => handleGetAccounts(false)} className={'button-primary'}>Get your Account
                    </button>
                    <button onClick={() => handleGetAccounts(true)} className={'button-primary'}>Get All Accounts
                    </button>
                </>)
                || (<>
                    {/*    retrieve only relevant account*/}
                    <button onClick={() => handleGetAccounts(false)} className={'button-primary'}>Get your Account
                    </button>
                </>)
            }
        </>
    )
}