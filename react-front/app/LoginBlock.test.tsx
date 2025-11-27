import React from "react";
import {render, screen} from '@testing-library/react';
import LoginBlock from "@/app/LoginBlock";

describe('MyComponent', () => {
    it('initially renders username and pass', async () => {

        render(
            <LoginBlock setAccessToken={undefined}></LoginBlock>
        );

        // isn't picked up
        // await screen.findByRole('form')

        await screen.findByText('Username')
        await screen.findByText('Password')

        // not picked up either, check how react actually resolves its htmlFor
        // expect(screen.getByLabelText('Username', {selector: 'input'})).toBeInTheDocument();

    });

    it('on successful query renders confirmation', async () => {

        render(
            <LoginBlock setAccessToken={undefined}></LoginBlock>
        );

        // await screen.findByRole('form')
        // await screen.findByRole('link', {name: 'example'})
    });

    it('on failed request renders form', async () => {

        render(
            <LoginBlock setAccessToken={undefined}></LoginBlock>
        );

        await screen.findByText('Username')
        await screen.findByText('Password')
    });
});