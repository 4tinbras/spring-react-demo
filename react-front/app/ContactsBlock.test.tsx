import React from "react";
import ContactsBlock from "@/app/ContactsBlock";
import {fireEvent, render, screen} from '@testing-library/react'
import {http, HttpResponse} from 'msw'
import {setupServer} from "msw/node";


// declare which API requests to mock
const server = setupServer(
    http.get('http://localhost:8080/contacts', () => {
        return HttpResponse.json(
            [{uuid: "1", firstName: "Tom", lastName: "Smith", email: "test@test.com", phoneNo: "1234567890"}])
    }),
)

// establish API mocking before all tests
beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of the tests
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

describe('ContactsBlock', () => {
    it('renders with link to example.com', async () => {

        const component = render(
            <ContactsBlock></ContactsBlock>
        );

        expect(screen.getByRole('paragraph')).toHaveTextContent('No contacts found so far.')

        // ACT
        const contactsButton = screen.getByRole('button', {name: 'Get Contacts'})
        fireEvent.click(contactsButton);

        //TODO: doesn't seem to be captured; visually it does flicker in and out; perhaps gets reduced in test case

        // await screen.findByRole('paragraph', {name: 'Loading...'})
        await screen.findByRole('table')

        expect(screen.queryByRole('paragraph', {name: 'Loading...'})).not.toBeInTheDocument();
        expect(screen.queryByRole('paragraph', {name: 'No contacts found so far.'})).not.toBeInTheDocument();

        // ASSERT
        expect(screen.getByText('First Name'))
        expect(screen.getByText('Last Name'))
        expect(screen.getByText('Phone no.'))
        expect(screen.getByText('Email address'))

        expect(screen.getByDisplayValue('Tom')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('Smith')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('test@test.com')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('1234567890')).toHaveAttribute('form', 'form1');
        expect(screen.getByRole('button', {name: 'Edit'}));
        expect(screen.queryByRole('button', {name: 'Save'})).not.toBeInTheDocument();

        const editButton = screen.getByRole('button', {name: 'Edit'})
        fireEvent.click(editButton);
        expect(screen.getByRole('button', {name: 'Save'}));
        expect(screen.queryByRole('button', {name: 'Edit'})).not.toBeInTheDocument();
    });

    it('error handling resets state', async () => {
    })
});

describe('Reducer', () => {
    it('correctly return updates', async () => {
        //TODO: add unit test coverage
    })
});