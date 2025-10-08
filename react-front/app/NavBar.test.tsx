import React from "react";
import NavBar from "@/app/NavBar";
import {render, screen} from '@testing-library/react';

describe('MyComponent', () => {
    it('renders with link to example.com', async () => {

    render(
      <NavBar></NavBar>
    );

        await screen.findByRole('navigation')
        await screen.findByRole('link', {name: 'example'})
});
});