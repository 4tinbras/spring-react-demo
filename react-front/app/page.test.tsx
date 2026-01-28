import React from "react";
import {render, screen} from '@testing-library/react'
import Home from "@/app/page";

describe('Home component ', () => {
    it('renders with default home tab', async () => {

        const component = render(
            <Home></Home>
        );

        await screen.findByText('Hello world!');
    })

});