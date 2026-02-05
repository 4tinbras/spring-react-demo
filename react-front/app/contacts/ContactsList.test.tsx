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

        assertStandardContactListValues();
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

        assertStandardContactListValues();
    })

    it('with an empty contacts prop list does not show table and shows new record button', async () => {

    customRender(<ContactsDispatchContext.Consumer>
        {value => <ContactsList contacts={[]} accessToken={""}></ContactsList>}
    </ContactsDispatchContext.Consumer>, {providerProps: validStateProps, renderOptions: []})

    // ASSERT
        expect(screen.queryByDisplayValue('First Name')).not.toBeInTheDocument();
        expect(screen.queryByDisplayValue('Last Name')).not.toBeInTheDocument();
        expect(screen.queryByDisplayValue('Phone no.')).not.toBeInTheDocument();
        expect(screen.queryByDisplayValue('Email address')).not.toBeInTheDocument();

        expect(screen.queryByRole('form')).not.toBeInTheDocument();

        expect(screen.getByText('Add new record'))
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

export function assertStandardContactListValues() {
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