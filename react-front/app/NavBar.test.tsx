import React from "react";
import NavBar from "@/app/NavBar";
import {render, screen} from '@testing-library/react';
import {AuthZContext, AuthZContextProps} from "@/app/StateManagement";

const customRender = (ui: any, {providerProps, ...renderOptions}: {
    [x: string]: any,
    providerProps: AuthZContextProps
}) => {
    return render(
        <AuthZContext.Provider {...providerProps} value={providerProps}>{ui}</AuthZContext.Provider>,
        renderOptions,
    )
}

const activeHomeProps: AuthZContextProps = {
    authZToken: "",
    setAuthZToken: jest.fn(),
    activeTab: "HOME",
    setActiveTab: jest.fn(),
}

const activeLoginProps: AuthZContextProps = {
    authZToken: "",
    setAuthZToken: jest.fn(),
    activeTab: "LOGIN",
    setActiveTab: jest.fn(),
}


describe('NavBar ', () => {
    it('renders with link home active by default', async () => {

        customRender(<AuthZContext.Consumer>
            {value => <NavBar/>}
        </AuthZContext.Consumer>, {providerProps: activeHomeProps, renderOptions: []})

        await screen.findByText('Home');

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Home')).toHaveClass('active')
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Login')).not.toHaveClass('active');
    });

    it('renders with active login based on state', async () => {

        customRender(<AuthZContext.Consumer>
            {value => <NavBar/>}
        </AuthZContext.Consumer>, {providerProps: activeLoginProps, renderOptions: []})

        await screen.findByText('Login');

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Home')).not.toHaveClass('active')
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Login')).toHaveClass('active');
    });

});