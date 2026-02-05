import React from "react";
import ContactsBlock from "@/app/contacts/ContactsBlock";
import {fireEvent, render, screen} from '@testing-library/react'
import {http, HttpResponse} from 'msw'
import {setupServer} from "msw/node";
import {ContactDto, ErrorResp, FormStatus} from "@/app/utils";
import {
    AuthZContext,
    AuthZContextProps,
    ContactsDispatchContext,
    ContactsProvider,
    contactsReducer,
    ContactsState
} from "@/app/StateManagement";


const server = setupServer(
    http.get<{}, never, ContactDto[] | ErrorResp>('http://localhost:8080/contacts', function* (request) {
        let response: ContactDto | ErrorResp;
        console.log('entered response mocking')

        if (request.request.headers.get('Authorization') === 'Bearer accessToken') {
            response = {uuid: "1", firstName: "Tom", lastName: "Smith", email: "test@test.com", phoneNo: "1234567890"};
            yield HttpResponse.json([response])
            response = {error: 'Not found'};
            yield HttpResponse.json(response, {status: 404})
        } else {
            console.log('setting response to invalid')
            return HttpResponse.json({error: 'Not authorised'}, {status: 401})
        }
    },),
)

beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of the tests
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


const initialContactsState: ContactsState = {contacts: [], status: FormStatus.Initial}

const customRender = (ui: React.ReactElement,
                      {contactsProviderProps, authZProviderProps, ...renderOptions}: {
                          [x: string]: any,
                          authZProviderProps: AuthZContextProps
                      }) => {
    return render(
        <ContactsProvider initialState={contactsProviderProps} reducer={contactsReducer}>
            <AuthZContext.Provider {...authZProviderProps} value={authZProviderProps}>{ui}
            </AuthZContext.Provider>
        </ContactsProvider>,
        renderOptions,
    )
}

const validTokenProps: AuthZContextProps = {
    authZToken: "accessToken",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
}

const invalidTokenProps: AuthZContextProps = {
    authZToken: "",
    setAuthZToken: jest.fn(),
    activeTab: "",
    setActiveTab: jest.fn(),
}

describe('ContactsBlock', () => {


    it('renders with no contacts found if access token valid but no data retrieved', async () => {

        customRender(<ContactsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
            {value => <ContactsBlock/>}

                </AuthZContext.Consumer>}</ContactsDispatchContext.Consumer>,
            {contactsProviderProps: initialContactsState, authZProviderProps: validTokenProps, renderOptions: []})

        expect(screen.getByRole('paragraph')).toHaveTextContent('No contacts found so far.')

        // ACT
        const contactsButton = screen.getByRole('button', {name: 'Get Contacts'})
        fireEvent.click(contactsButton);

        await screen.findByText('Loading...')

        await screen.findByRole('table')

        // ASSERT

        expect(screen.queryByRole('paragraph', {name: 'Loading...'})).not.toBeInTheDocument();
        expect(screen.queryByRole('paragraph', {name: 'No contacts found so far.'})).not.toBeInTheDocument();

        expect(screen.getByText('First Name'))
        expect(screen.getByText('Last Name'))
        expect(screen.getByText('Phone no.'))
        expect(screen.getByText('Email address'))

        expect(screen.getByDisplayValue('Tom')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('Smith')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('test@test.com')).toHaveAttribute('form', 'form1');
        expect(screen.getByDisplayValue('1234567890')).toHaveAttribute('form', 'form1');

        validateEditSaveButton()
        validateAddNewRecordButton()
    });

    it('renders with login request if no access token', async () => {

        customRender(<ContactsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <ContactsBlock/>}

                </AuthZContext.Consumer>}</ContactsDispatchContext.Consumer>,
            {contactsProviderProps: initialContactsState, authZProviderProps: invalidTokenProps, renderOptions: []})

        expect(screen.getByRole('paragraph')).toHaveTextContent('Please authenticate yourself in login tab.')
    })

    //TODO: separately run - it passes; run as suite enters jest mock only once during execution of first test
    it('error handling resets state and erases table', async () => {

        customRender(<ContactsDispatchContext.Consumer>
                {value => <AuthZContext.Consumer>
                    {value => <ContactsBlock/>}

                </AuthZContext.Consumer>}</ContactsDispatchContext.Consumer>,
            {contactsProviderProps: initialContactsState, authZProviderProps: validTokenProps, renderOptions: []})

        expect(screen.getByRole('paragraph')).toHaveTextContent('No contacts found so far.')

        const contactsButton = screen.getByRole('button', {name: 'Get Contacts'})
        fireEvent.click(contactsButton);

        await screen.findByText('Loading...')

        await screen.findByRole('table')

        expect(screen.queryByRole('paragraph', {name: 'Loading...'})).not.toBeInTheDocument();
        expect(screen.queryByRole('paragraph', {name: 'No contacts found so far.'})).not.toBeInTheDocument();

        expect(screen.getByText('First Name'))

        fireEvent.click(contactsButton);

        await screen.findByText('No contacts found so far.');

        expect(screen.queryByRole('paragraph', {name: 'Loading...'})).not.toBeInTheDocument();
        expect(screen.queryByText('First Name')).not.toBeInTheDocument();
    })
});

//________________________________
//TODO: ideally all below would live in ContactsList, but they don't seem to play nicely with its context setup

function validateEditSaveButton() {

    expect(screen.getByRole('button', {name: 'Edit'}));
    expect(screen.queryByRole('button', {name: 'Save'})).not.toBeInTheDocument();
    const editButton = screen.getByRole('button', {name: 'Edit'})
    fireEvent.click(editButton);

    expect(screen.getByRole('button', {name: 'Save'}));
    expect(screen.queryByRole('button', {name: 'Edit'})).not.toBeInTheDocument();
}

function validateAddNewRecordButton() {
    const newRecordButton = screen.getByText('Add new record');

    fireEvent.click(newRecordButton);
    expect(screen.getAllByRole('form')).toHaveLength(2)
    expect(screen.getByDisplayValue('firstname_placeholder')).toHaveAttribute('form', 'form2');
    expect(screen.getByDisplayValue('surname_placeholder')).toHaveAttribute('form', 'form2');
    expect(screen.getByDisplayValue('phone_number_placeholder')).toHaveAttribute('form', 'form2');
    expect(screen.getByDisplayValue('email_placeholder')).toHaveAttribute('form', 'form2');
}