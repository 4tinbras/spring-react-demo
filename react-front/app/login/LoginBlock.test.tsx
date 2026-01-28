import React from "react";
import {render, screen} from '@testing-library/react';
import LoginBlock from "@/app/login/LoginBlock";
import {AuthZContext, AuthZContextProps} from "@/app/StateManagement";
import {useSearchParams} from "next/navigation";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";
import {ErrorResp, TokenResponseDto} from "@/app/utils";

const server = setupServer(
    http.get<{}, never, TokenResponseDto | ErrorResp>('http://localhost:8020/realms/spreact/protocol/openid-connect/token', (request) => {
        // @ts-ignore
        if (request.request.body?.getReader().read().then(body => JSON.parse(body.value.toString()).get('code') === 'authZCode')) {
            return HttpResponse.json(
                {
                    "access_token": "header.body.signature",
                    "expires_in": 300,
                    "refresh_expires_in": 1800,
                    "refresh_token": "header.body.signature",
                    "token_type": "Bearer",
                    "not-before-policy": 0,
                    "session_state": "9a7ba32b-c506-c0ab-aedd-9b15910cb25a",
                    "scope": "email profile"
                })
        } else {
            return HttpResponse.json({error: 'Not authorised'}, {status: 401})
        }
    },),
)

beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of the tests
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const customRender = (ui: any, {providerProps, ...renderOptions}: {
    [x: string]: any,
    providerProps: AuthZContextProps
}) => {
    return render(
        <AuthZContext.Provider {...providerProps} value={providerProps}>{ui}</AuthZContext.Provider>,
        renderOptions,
    )
}

const initialStateProps: AuthZContextProps = {
    authZToken: "",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
}


const validTokenProps: AuthZContextProps = {
    authZToken: "accessToken",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
}

jest.mock('next/navigation');


describe('MyComponent', () => {
    it('renders button with initial instruction', async () => {

        const getMock: jest.Mock = jest.fn(paramName => undefined);
        (useSearchParams as jest.Mock).mockReturnValue({
            get: getMock,
        });


        customRender(<AuthZContext.Consumer>
            {value => <LoginBlock/>}
        </AuthZContext.Consumer>, {providerProps: initialStateProps, renderOptions: []})

        // isn't picked up
        // await screen.findByRole('form')

        await screen.findByText('Please submit form to initiate login')
        await screen.findByRole('button')

        // not picked up either, check how react actually resolves its htmlFor
        // expect(screen.getByLabelText('Username', {selector: 'input'})).toBeInTheDocument();

    });

    it('on successful query renders confirmation and button to continue', async () => {

        const getMock: jest.Mock = jest.fn(paramName => "authZCode");
        (useSearchParams as jest.Mock).mockReturnValue({
            get: getMock,
        });

        customRender(<AuthZContext.Consumer>
            {value => <LoginBlock/>}
        </AuthZContext.Consumer>, {providerProps: initialStateProps, renderOptions: []})

        // await screen.findByRole('form')

        await screen.findByText('Please submit form to finalise login')
        await screen.findByRole('button')
    });

    it('on successful return query renders confirmation of overall success', async () => {

        const getMock: jest.Mock = jest.fn(paramName => undefined);
        (useSearchParams as jest.Mock).mockReturnValue({
            get: getMock,
        });


        customRender(<AuthZContext.Consumer>
            {value => <LoginBlock/>}
        </AuthZContext.Consumer>, {providerProps: validTokenProps, renderOptions: []})

        // await screen.findByRole('form')

        await screen.findByText('You have already logged in!')
        await screen.findByRole('button')
    });

    it('on failed request renders form', async () => {

        customRender(<AuthZContext.Consumer>
            {value => <LoginBlock/>}
        </AuthZContext.Consumer>, {providerProps: validTokenProps, renderOptions: []})

        await screen.findByRole('button')
    });
});