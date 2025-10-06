import React from "react";
import ContactsBlock from "@/app/ContactsBlock";
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {http, HttpResponse} from 'msw'
import {setupServer} from "msw/node";
import ContactsList from "@/app/ContactsList";


describe('ContactsList ', () => {
    it('with a valid contact prop renders a list representing the item', async () => {

        //renders as if state was empty even though it always is there
        const component = render(
            <ContactsList contacts={[{uuid: "1", firstName: "Tom", lastName: "Smith", email: "test@test.com", phoneNo: "1234567890"}]}></ContactsList>
        );

        await screen.findByRole('table')

        // ASSERT
        expect(screen.getByText('Person'))
        expect(screen.getByText('Phone no.'))
        expect(screen.getByText('Email address'))

        expect(screen.getByText('Tom Smith'))
    })

it('with an empty contacts prop list renders fallback info', async () => {

    //renders as if state was empty even though it always is there
    const component = render(
        <ContactsList contacts={[]}></ContactsList>
    );

    // ASSERT
    expect(screen.getByText('Person'))
    expect(screen.getByText('Phone no.'))
    expect(screen.getByText('Email address'))

    expect(screen.queryByRole('Tom Smith')).toBeNull()
})
});

describe('EditContactButton ', () => {
    it('displays edit when inactive', async () => {
        const inactiveStateButton = render(
            <EditContactButton redirectionUrl={`/edit/1`} contact={inactiveContact}
                               onClick={undefined}></EditContactButton>
        );

        expect(screen.getByRole('button')).toHaveTextContent('Edit');
    });


    it('displays save when active', async () => {
        const activeStateButton = render(
            <EditContactButton redirectionUrl={`/edit/1`} contact={activeContact}
                               onClick={undefined}></EditContactButton>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Save');
    });
});