'use client'

import {useAccounts, useAuthZ} from "@/app/StateManagement";
import {createRemoteJWKSet, JWTPayload, jwtVerify, JWTVerifyResult} from 'jose';
import {AccountBlockActions, FormStatus} from "@/app/utils";


export default async function AccountsBlock({}: {}) {

    const getAccountsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/accounts";
    const getAccountEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/account";
    const {authZToken} = useAuthZ();
    const accessToken = authZToken;
    const decryptedAccessToken: JWTPayload = await getValidatedJWT(accessToken);

    const {state, dispatchState} = useAccounts();

    const jwksUri = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}` + `${process.env.NEXT_PUBLIC_JWKS_ENDPOINT}`;
    const jwks = createRemoteJWKSet(new URL(jwksUri));

    console.log("validating jwt...");

    async function getValidatedJWT(accessToken: string): Promise<JWTPayload> {
        const options = {
            algorithms: ['RS256'],
            issuer: `${process.env.NEXT_PUBLIC_TOKEN_ISSUER}`,
            // audience: 'myaudience'
        };
        const result: JWTVerifyResult<JWTPayload> = await jwtVerify(accessToken, jwks, options);
        console.log("jwt payload:" + result.payload);
        return result.payload;
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
            {(decryptedAccessToken.scope as string).includes("admin") &&
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