import React from "react";
import {fireEvent, render, screen} from '@testing-library/react'
import Home from "@/app/page";

describe('Home component ', () => {
    it('renders with default home tab', async () => {

        const component = render(
            <Home></Home>
        );

        await screen.findByText('Home');
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();

        expect(screen.getByRole('paragraph')).toHaveTextContent('Please authenticate yourself in login tab.')
        // expect(screen.getByRole('paragraph')).toHaveTextContent('No contacts found so far.')
    })

    it('correctly changes content based on navigation interactions', async () => {

        const component = render(
            <Home></Home>
        );

        await screen.findByText('Home');
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();

        // ACT
        const loginLink = screen.getByText('Login')
        fireEvent.click(loginLink);

        expect(screen.queryByRole('paragraph', {name: 'Please authenticate yourself in login tab.'})).not.toBeInTheDocument();
        // expect(screen.queryByRole('paragraph', {name: 'No contacts found so far.'})).not.toBeInTheDocument();

    })

});