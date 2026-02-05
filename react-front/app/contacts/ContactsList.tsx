import {Table} from "reactstrap";
import React, {MouseEventHandler, useContext, useState} from "react";
import {
    ContactBlockActions,
    ContactState,
    ContactViewModel,
    FieldsSubmissionType,
    FormStatus,
    genericSubmitForm
} from '../utils';
import {ContactsDispatchContext} from "@/app/StateManagement";

export default function ContactsList({contacts, accessToken}:
                                     { contacts: ContactViewModel[], accessToken: string }) {

    const dispatch: React.Dispatch<any> = useContext(ContactsDispatchContext)!;

    const handleEditButtonClick = (event: any, contactvm: ContactViewModel) => {
        const contact: ContactState = contactvm.contact;

        if (contact.active !== true) {
            event.preventDefault()
        }

        const replacement: ContactViewModel = {
            active: !contact.active,
            contact: {
                uuid: contact.uuid,
                firstName: contact.firstName,
                lastName: contact.lastName,
                phoneNo: contact.phoneNo,
                email: contact.email,
                active: !contact.active
            },
            formStatus: contactvm.formStatus
        }

        const newArray = replaceContact(contactvm, replacement, contacts);
        dispatch({type: ContactBlockActions.SetContacts, payload: {contacts: newArray}})
    }

    const replaceContact = (contactvm: ContactViewModel, replacement: ContactViewModel, contacts: ContactViewModel[]): any => {

        const findContactByContactUuid = (item: ContactViewModel) => {
            return item.contact.uuid === contactvm.contact.uuid;
        }

        const indexToMutate = contacts.findIndex(findContactByContactUuid);

        // @ts-ignore
        const mapItemsFunc = (original: ContactViewModel) => original.contact.uuid === contacts.at(indexToMutate).contact.uuid ? replacement : original

        if (indexToMutate === undefined) {
            throw new Error('Couldn\'t find contact to handle.');
        }
        return contacts.map(mapItemsFunc);
    }

// @ts-ignore
    const listItems = contacts.map((contactvm: ContactViewModel) => {

            return <tr key={`${contactvm.contact.uuid}`}>
                <ContactsRecord key={`${contactvm.contact.uuid}records`} contactvm={contactvm}
                                handleClick={handleEditButtonClick}></ContactsRecord>
                {/*needs to set status text based on cell state*/}
                <th>Prompt</th>
            </tr>;
        }
    );

    const formsList = contacts.map((contactvm: ContactViewModel) => {

        return <RecordForm key={`form${contactvm.contact.uuid}`} contact={contactvm.contact}
                           accessToken={accessToken}></RecordForm>
    });

    return <div>
        <div>
            {formsList}
        </div>
        <Table className={"table-striped-columns"}>
            <caption>
                Known contacts
            </caption>
            <thead>
            <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone no.</th>
                <th scope="col">Email address</th>
            </tr>
            </thead>
            <tbody>
            {listItems}
            </tbody>
        </Table>
    </div>
}

export function ContactsRecord({contactvm, handleClick}: { contactvm: ContactViewModel, handleClick: any }) {
    const contact: ContactState = contactvm.contact;

    const inputProps = {
        readOnly: undefined,
    };
    if (!contactvm.active) {
        // @ts-ignore
        inputProps.readOnly = true
    }

    //TODO: if readonly - change styling
    return <>
        <td><input type="text" name="firstName" form={`form${contact.uuid}`}
                   defaultValue={contact.firstName} {...inputProps}></input>
        </td>
        <td><input type="text" name="lastName" form={`form${contact.uuid}`}
                   defaultValue={contact.lastName} {...inputProps}></input>
        </td>
        <td><input type="text" name="phoneNo" form={`form${contact.uuid}`}
                   defaultValue={contact.phoneNo} {...inputProps}></input></td>
        <td><input type="text" name="email" form={`form${contact.uuid}`}
                   defaultValue={contact.email} {...inputProps}></input></td>
        <td><EditContactButton contactvm={contactvm}
                               onClick={(event) => handleClick(event, contactvm)}></EditContactButton></td>
        <td hidden><input hidden readOnly type="text" name="uuid" form={`form${contact.uuid}`}
                          defaultValue={contact.uuid}></input></td>
    </>;
}

export function EditContactButton({contactvm, onClick}: { contactvm: ContactViewModel, onClick: MouseEventHandler }) {
    return <button onClick={onClick} key={`Edit${contactvm.contact.uuid}`}
                   form={`form${contactvm.contact.uuid}`}>{contactvm.contact.active ? `Save` : `Edit`}</button>;
}

export function RecordForm({contact, accessToken}: { contact: ContactState, accessToken: string }) {
    const fieldsArray = ['firstName', 'lastName', 'email', 'phoneNo', 'uuid'];

    const [responseData, setData] = useState<[]>([]);
    // @ts-ignore
    const dispatch: React.Dispatch<any> = useContext(ContactsDispatchContext);

    let additionalData: Map<FieldsSubmissionType, Map<string, string>> = new Map([
        [FieldsSubmissionType.HeaderParams, new Map([
            ['Content-Type', 'application/json'],
            ['Authorization', `Bearer ${accessToken}`]
        ])]
    ])

    const [onSubmit, data] = genericSubmitForm(`${process.env.NEXT_PUBLIC_BACKEND_HOST}`,
        fieldsArray,
        responseData,
        setData,
        dispatch,
        FieldsSubmissionType.JsonFormParams,
        additionalData,
        'POST'
    );

    return <form id={`form${contact.uuid}`} name={`form${contact.uuid}`} onSubmit={onSubmit}></form>
}