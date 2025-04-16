import renderer from 'react-test-renderer';
import {expect, it} from "@jest/globals";
import React from "react";
import NavBar from "@/app/NavBar";
import { render } from '@testing-library/react';

describe('MyComponent', () => {
it('renders with link to example.com', () => {

    render(
      <NavBar></NavBar>
    );
});
});