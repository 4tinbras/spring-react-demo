import React from "react";
import ContactsBlock from "@/app/ContactsBlock";
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {http, HttpResponse} from 'msw'
import {setupServer} from "msw/node";


// const mockFetch = jest.fn(
//     () => {return {uuid: "1", firstName: "Tom", lastName: "Smith", email: "test@test.com", phoneNo: "1234567890"};});

// declare which API requests to mock
const server = setupServer(
    // capture "GET /greeting" requests
    http.get('http://localhost:8080/contacts', () => {
        // respond using a mocked JSON body
        return HttpResponse.json(
            {uuid: "1", firstName: "Tom", lastName: "Smith", email: "test@test.com", phoneNo: "1234567890"})
    }),
)

// establish API mocking before all tests
beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

describe('MyComponent', () => {
    it('renders with link to example.com', async () => {

        //renders as if state was empty even though it always is there
        const component = render(
            <ContactsBlock></ContactsBlock>
        );

        fetch('http://localhost:8080/contacts')
            .then(response => response.json())
            .then(body => {
                // console.log(body)
            });

        expect(screen.getByRole('paragraph')).toHaveTextContent('No contacts found so far.')

        // ACT
        await userEvent.click(screen.getByText('Get Contacts'))
        // fireEvent.click(screen.getByText('Get Contacts'))
        await screen.findByRole('table')

        // ASSERT
        expect(screen.getByRole('th')).toHaveTextContent('Person')
        expect(screen.getByRole('th')).toHaveTextContent('Phone no.')
        expect(screen.getByRole('th')).toHaveTextContent('Email address')
        // expect(screen.getByRole('button')).toBeDisabled()

        //assert that shows empty list

        //change state and assert that
    });
});