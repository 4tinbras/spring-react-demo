'use client'

import ContactsList from "@/app/contacts/ContactsList";
import {ContactBlockActions, ContactState, ContactViewModel, fetchThenHandleBody, FormStatus} from "@/app/utils";
import {useAuthZ, useContacts} from "@/app/StateManagement";

export default function ContactsBlock({}: {}) {

    const getAccountsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_HOST}` + "/contacts";

    const {state, dispatchState} = useContacts();
    const {authZToken} = useAuthZ();
    const accessToken = authZToken;

    const fetchBodyHandler = (body: any) => {
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
    }

    function handleGetContacts(): void {
        dispatchState({type: ContactBlockActions.SetLoading, payload: {status: FormStatus.Pending}});

        fetchThenHandleBody(getAccountsEndpoint, 'GET', accessToken, fetchBodyHandler).catch(error => {
            dispatchState({type: ContactBlockActions.SetAll, payload: {contacts: null, status: FormStatus.Failed}});
        })

    }

    return (
        <div style={{width: '100%'}}>
            <button onClick={() => handleGetContacts()} className={'button-primary'}>Get Contacts</button>

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


