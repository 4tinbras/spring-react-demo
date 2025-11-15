import React from "react";
import {render, screen} from '@testing-library/react';
import LoginBlock from "@/app/LoginBlock";

describe('MyComponent', () => {
    it('initially renders username and pass', async () => {

        render(
            <LoginBlock setAccessToken={undefined}></LoginBlock>
        );

        await screen.findByRole('navigation')
        await screen.findByRole('link', {name: 'example'})
    });

    it('on successful query renders confirmation', async () => {

        render(
            <LoginBlock setAccessToken={undefined}></LoginBlock>
        );

        await screen.findByRole('navigation')
        await screen.findByRole('link', {name: 'example'})
    });

    it('on failed request renders', async () => {

        render(
            <LoginBlock setAccessToken={undefined}></LoginBlock>
        );

        await screen.findByRole('navigation')
        await screen.findByRole('link', {name: 'example'})
    });
});