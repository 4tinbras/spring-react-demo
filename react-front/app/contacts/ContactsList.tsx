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

    const {dispatchState} = useContext(ContactsDispatchContext)!;

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
        dispatchState({type: ContactBlockActions.SetContacts, payload: {contacts: newArray}})
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
    const getUuidWithFallback = (contactvm: ContactViewModel): string => {
        return contactvm.contact.uuid !== "" ? contactvm.contact.uuid
            : (Math.max(...contacts.values().map(
                (item: ContactViewModel): number => {
                    const uuid = parseInt(item.contact.uuid, 10);
                    return !isNaN(uuid) ? uuid : 0;
                })
            ) + 1).toString();

    }

// @ts-ignore
    const listItems = contacts.map((contactvm: ContactViewModel) => {
        //if has uuid (retrieved from backend) use it, otherwise generate subsequent number (to avoid clashes on multiple additions)
        const key = getUuidWithFallback(contactvm);

        return <tr key={`${key}`}>
            <ContactsRecord key={`${key}records`} uuid={key} contactvm={contactvm}
                                handleClick={handleEditButtonClick}></ContactsRecord>
                {/*needs to set status text based on cell state*/}
                <th>Prompt</th>
            </tr>;
        }
    );

    const formsList = contacts.map((contactvm: ContactViewModel) => {
        const key = getUuidWithFallback(contactvm);

        return <RecordForm key={`form${key}`} uuid={key} contact={contactvm.contact}
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
        <AddNewRecordButton contacts={contacts}></AddNewRecordButton>
    </div>
}

export function AddNewRecordButton({contacts}: { contacts: ContactViewModel[] }) {

    const {dispatchState} = useContext(ContactsDispatchContext)!;

    const addNewRecord = (event: any, contacts: ContactViewModel[]) => {
        event.preventDefault()

        contacts.push({
            active: true,
            contact: {
                //empty to allow backend to assign it itself
                uuid: "",
                firstName: "firstname_placeholder",
                lastName: "surname_placeholder",
                phoneNo: "phone_number_placeholder",
                email: "email_placeholder",
                active: true,
            },
            formStatus: FormStatus.Editing
        });

        dispatchState({type: ContactBlockActions.SetContacts, payload: {contacts: contacts}})
    }

    return (<button onClick={(event) => addNewRecord(event, contacts)}>Add new record</button>)
}

export function ContactsRecord({uuid, contactvm, handleClick}: {
    uuid: string,
    contactvm: ContactViewModel,
    handleClick: any
}) {
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
        <td><input type="text" name="firstName" form={`form${uuid}`}
                   defaultValue={contact.firstName} {...inputProps}></input>
        </td>
        <td><input type="text" name="lastName" form={`form${uuid}`}
                   defaultValue={contact.lastName} {...inputProps}></input>
        </td>
        <td><input type="text" name="phoneNo" form={`form${uuid}`}
                   defaultValue={contact.phoneNo} {...inputProps}></input></td>
        <td><input type="text" name="email" form={`form${uuid}`}
                   defaultValue={contact.email} {...inputProps}></input></td>
        <td><EditContactButton uuid={uuid} contactvm={contactvm}
                               onClick={(event) => handleClick(event, contactvm)}></EditContactButton></td>
        {/*it should be empty if it's a new record so that backend assigned that value*/}
        <td hidden><input hidden readOnly type="text" name="uuid" form={`form${contact.uuid}`}
                          defaultValue={contact.uuid}></input></td>
    </>;
}

export function EditContactButton({uuid, contactvm, onClick}:
                                  { uuid: string, contactvm: ContactViewModel, onClick: MouseEventHandler }) {
    return <button onClick={onClick} key={`Edit${uuid}`}
                   form={`form${uuid}`}>{contactvm.contact.active ? `Save` : `Edit`}</button>;
}

export function RecordForm({uuid, contact, accessToken}: { uuid: string, contact: ContactState, accessToken: string }) {
    const fieldsArray = ['firstName', 'lastName', 'email', 'phoneNo', 'uuid'];

    const [responseData, setData] = useState<[]>([]);
    // @ts-ignore
    const {dispatchState} = useContext(ContactsDispatchContext);

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
        dispatchState,
        FieldsSubmissionType.JsonFormParams,
        additionalData,
        'POST'
    );

    return <form id={`form${uuid}`} name={`form${uuid}`} onSubmit={onSubmit}></form>
}