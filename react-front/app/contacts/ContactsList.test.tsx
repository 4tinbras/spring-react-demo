import React from "react";
import {render, screen} from '@testing-library/react'
import ContactsList, {EditContactButton} from "@/app/contacts/ContactsList";
import {ContactBlockActions, FormStatus} from "@/app/utils";
import {ContactsDispatchContext, ContactsProvider, contactsReducer} from "@/app/StateManagement";


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

const customRender = (ui: any, {providerProps, ...renderOptions}: {
    [x: string]: any,
    providerProps: any
}) => {
    return render(
        <ContactsProvider initialState={providerProps} reducer={contactsReducer}>{ui}</ContactsProvider>,
        renderOptions,
    )
}

const validStateProps = {
    type: ContactBlockActions.SetContacts, payload: {contacts: [inactiveContact]}
}

describe('ContactsList ', () => {
    it('with a valid contact and active state renders list and sets readOnly attribute and creates related form', async () => {

        customRender(<ContactsDispatchContext.Consumer>
            {value => <ContactsList contacts={[inactiveContact]} accessToken={""}></ContactsList>}
        </ContactsDispatchContext.Consumer>, {providerProps: validStateProps, renderOptions: []})

        await screen.findByRole('table');


        // ASSERT
        expect(screen.getByDisplayValue('Tom')).toHaveAttribute('readonly', '');

        assertStandardValues();
    })

    it('with a valid contact and active state renders list and does not set readOnly attribute and creates related form', async () => {

        customRender(<ContactsDispatchContext.Consumer>
            {value => <ContactsList contacts={[{
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
            }]} accessToken={""}></ContactsList>}
        </ContactsDispatchContext.Consumer>, {providerProps: validStateProps, renderOptions: []})

        await screen.findByRole('table');

        // ASSERT
        expect(screen.getByDisplayValue('Tom')).not.toHaveAttribute('readonly');

        assertStandardValues();
    })

it('with an empty contacts prop list renders fallback info', async () => {

    customRender(<ContactsDispatchContext.Consumer>
        {value => <ContactsList contacts={[]} accessToken={""}></ContactsList>}
    </ContactsDispatchContext.Consumer>, {providerProps: validStateProps, renderOptions: []})

    // ASSERT
    expect(screen.getByText('First Name'));
    expect(screen.getByText('Last Name'));
    expect(screen.getByText('Phone no.'));
    expect(screen.getByText('Email address'));

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

function assertStandardValues() {
    expect(screen.getByText('First Name'));
    expect(screen.getByText('Last Name'));
    expect(screen.getByText('Phone no.'));
    expect(screen.getByText('Email address'));

    expect(screen.getByDisplayValue('Tom')).toHaveAttribute('form', 'form1');
    expect(screen.getByDisplayValue('Smith')).toHaveAttribute('form', 'form1');
    expect(screen.getByDisplayValue('test@test.com')).toHaveAttribute('form', 'form1');
    expect(screen.getByDisplayValue('1234567890')).toHaveAttribute('form', 'form1');

    expect(screen.getByRole('form')).toHaveAttribute('id', 'form1');

    expect(screen.getByText('Add new record'));
}