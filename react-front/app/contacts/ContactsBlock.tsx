'use client'

import ContactsList from "@/app/contacts/ContactsList";
import {ContactBlockActions, ContactState, ContactViewModel, FormStatus} from "@/app/utils";
import {useAuthZ, useContacts} from "@/app/StateManagement";

export default function ContactsBlock({}: {}) {


    const {state, dispatchState} = useContacts();
    const {authZToken} = useAuthZ();
    const accessToken = authZToken;


    function handleGetContacts() {
        dispatchState({type: ContactBlockActions.SetLoading, payload: {status: FormStatus.Pending}});

        //TODO: add handling for exceptions
        fetch('http://localhost:8080/contacts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error response received", {cause: response});
                } else {
                    return response.json();
                }
            })
            .then(body => {
                const cvmArray: ContactViewModel[] = [];

                if (Array.isArray(body)) {
                    body.forEach((contact: ContactState) => {
                        const contactvm: ContactViewModel = {
                            contact: contact,
                            active: false,
                            formStatus: FormStatus.Editing
                        }
                        cvmArray.push(contactvm);
                    })
                } else {

                }
                dispatchState({
                    type: ContactBlockActions.SetAll,
                    payload: {contacts: Array.isArray(body) ? cvmArray : null, status: FormStatus.Ok}
                });
            })
        .catch(error => {
            dispatchState({type: ContactBlockActions.SetAll, payload: {contacts: null, status: FormStatus.Failed}});
        })

    }

    return (
        <div style={{width: '100%'}}>
            <button onClick={() => handleGetContacts()}>Get Contacts</button>

            {accessToken !== "" && accessToken !== undefined && (
                state.status === FormStatus.Pending && (<p>Loading...</p>) ||
                (Array.isArray(state.contacts) && state.contacts.length > 0 ? (
                    // @ts-ignore
                    <ContactsList contacts={state.contacts} accessToken={accessToken}></ContactsList>
                ) : (
                    <>
                        <p>No contacts found so far.</p>
                        <p>Consider adding a new one.</p>
                        <ContactsList contacts={state.contacts} accessToken={accessToken}></ContactsList>
                    </>
                ))
            ) || (<p>Please authenticate yourself in login tab.</p>)
            }
        </div>
    );
}


