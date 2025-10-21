import React from "react";
import {render, screen} from '@testing-library/react'
import ContactsList, {EditContactButton} from "@/app/ContactsList";
import {FormStatus} from "@/app/utils";


const inactiveContact = {
    active: false,
    contact: {
        uuid: "1",
        firstName: "Tom",
        lastName: "Smith",
        email: "test@test.com",
        phoneNo: "1234567890",
        active: false
    },
    formStatus: FormStatus.Editing
}

const activeContact = {
    active: true,
    contact: {
        uuid: "1",
        firstName: "Tom",
        lastName: "Smith",
        email: "test@test.com",
        phoneNo: "1234567890",
        active: true
    },
    formStatus: FormStatus.Editing
}

describe('ContactsList ', () => {
    it('with a valid contact prop renders a list representing the item and creates related form', async () => {

        const component = render(
            <ContactsList contacts={[{
                active: false,
                contact: {
                    uuid: "1",
                    firstName: "Tom",
                    lastName: "Smith",
                    email: "test@test.com",
                    phoneNo: "1234567890",
                    active: false
                },
                formStatus: FormStatus.Editing
            }]} handleClick={undefined}></ContactsList>
        );

        await screen.findByRole('table')

        // ASSERT
        expect(screen.getByText('First Name'))
        expect(screen.getByText('Last Name'))
        expect(screen.getByText('Phone no.'))
        expect(screen.getByText('Email address'))

        expect(screen.getByDisplayValue('Tom')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('Smith')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('test@test.com')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('1234567890')).toHaveAttribute('form', 'form1');

        expect(screen.getByRole('form')).toHaveAttribute('id', 'form1');
    })

it('with an empty contacts prop list renders fallback info', async () => {

    const component = render(
        <ContactsList contacts={[]} handleClick={undefined}></ContactsList>
    );

    // ASSERT
    expect(screen.getByText('First Name'))
    expect(screen.getByText('Last Name'))
    expect(screen.getByText('Phone no.'))
    expect(screen.getByText('Email address'))

    expect(screen.queryByRole('input', {name: 'Tom Smith'})).not.toBeInTheDocument();
})
});

describe('EditContactButton ', () => {
    it('displays edit when inactive', async () => {
        const inactiveStateButton = render(
            <EditContactButton contactvm={inactiveContact} onClick={(event) => {
                return null
            }}></EditContactButton>
        );

        expect(screen.getByRole('button')).toHaveTextContent('Edit');
    });


    it('displays save when active', async () => {
        const activeStateButton = render(
            <EditContactButton contactvm={activeContact} onClick={(event) => {
                return null
            }}></EditContactButton>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Save');
    });
});