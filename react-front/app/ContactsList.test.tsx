import React from "react";
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactsList, {EditContactButton} from "@/app/ContactsList";


const inactiveContact = {
    uuid: "1",
    firstName: "Tom",
    lastName: "Smith",
    email: "test@test.com",
    phoneNo: "1234567890",
    active: false
}

const activeContact = {
    uuid: "1",
    firstName: "Tom",
    lastName: "Smith",
    email: "test@test.com",
    phoneNo: "1234567890",
    active: true
}

describe('ContactsList ', () => {
    it('with a valid contact prop renders a list representing the item and creates related form', async () => {

        const component = render(
            <ContactsList contacts={[{
                uuid: "1",
                firstName: "Tom",
                lastName: "Smith",
                email: "test@test.com",
                phoneNo: "1234567890"
            }]} handleClick={undefined}></ContactsList>
        );

        await screen.findByRole('table')

        // ASSERT
        expect(screen.getByText('Person'))
        expect(screen.getByText('Phone no.'))
        expect(screen.getByText('Email address'))

        expect(screen.getByDisplayValue('Tom Smith')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('test@test.com')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('1234567890')).toHaveAttribute('form', 'form1');

        expect(screen.getByRole('form')).toHaveAttribute('id', 'form1');
        expect(screen.getByRole('form')).toHaveAttribute('action', 'https://localhost:8080/contact');
    })

it('with an empty contacts prop list renders fallback info', async () => {

    const component = render(
        <ContactsList contacts={[]} handleClick={undefined}></ContactsList>
    );

    // ASSERT
    expect(screen.getByText('Person'))
    expect(screen.getByText('Phone no.'))
    expect(screen.getByText('Email address'))

    expect(screen.queryByRole('input', {name: 'Tom Smith'})).not.toBeInTheDocument();
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