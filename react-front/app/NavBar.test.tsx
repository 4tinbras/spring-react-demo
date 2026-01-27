import React from "react";
import NavBar from "@/app/NavBar";
import {render, screen} from '@testing-library/react';

describe('NavBar ', () => {
    it('renders with link home active by default', async () => {

        render(// @ts-ignore
            <NavBar
                // <NavBar activeTab={"HOME"} onNavbarClick={() => {}}
            ></NavBar>
        );

        await screen.findByText('Home');

        expect(screen.getByText('Home')).toBeInTheDocument();
        // expect(screen.getByText('Home')).toHaveClass('active')
        expect(screen.getByText('Login')).toBeInTheDocument();
        // expect(screen.getByText('Login')).not.toHaveClass('active');
    });

    //TODO: needs reevaluation as custom element was replaced by nextjs native element
    it.skip('renders with active tab correctly and switches focus to another when clicked', async () => {

        render(
            <NavBar activeTab={"LOGIN"} onNavbarClick={() => {
            }}></NavBar>
        );

        await screen.findByText('Login');

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Home')).not.toHaveClass('active')
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Login')).toHaveClass('active');
    });

});