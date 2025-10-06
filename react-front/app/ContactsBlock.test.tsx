import React from "react";
import ContactsBlock from "@/app/ContactsBlock";
import {fireEvent, render, screen} from '@testing-library/react'
import {http, HttpResponse} from 'msw'
import {setupServer} from "msw/node";


// declare which API requests to mock
const server = setupServer(
    // capture "GET /greeting" requests
    http.get('http://localhost:8080/contacts', () => {
        // respond using a mocked JSON body
        return HttpResponse.json(
            [{uuid: "1", firstName: "Tom", lastName: "Smith", email: "test@test.com", phoneNo: "1234567890"}])
    }),
)

// establish API mocking before all tests
beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

describe('ContactsBlock', () => {
    it('renders with link to example.com', async () => {

        //renders as if state was empty even though it always is there
        const component = render(
            <ContactsBlock></ContactsBlock>
        );

        expect(screen.getByRole('paragraph')).toHaveTextContent('No contacts found so far.')

        // ACT
        // await userEvent.click(screen.getByText('Get Contacts'))
        const button = screen.getByRole('button', {name: 'Get Contacts'})
        fireEvent.click(button);
        await screen.findByRole('table')

        // ASSERT
        expect(screen.getByText('Person'))
        expect(screen.getByText('Phone no.'))
        expect(screen.getByText('Email address'))

        expect(screen.getByDisplayValue('Tom Smith')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('test@test.com')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('1234567890')).toHaveAttribute('form', 'form1');
        expect(screen.getByRole('button', {name: 'Edit'}));

        //click edit to change state and assert that value has changed
    });

    it('error handling resets state', async () => {
    })
});