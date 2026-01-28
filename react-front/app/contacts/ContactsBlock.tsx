'use client'

import {useReducer} from "react";
import ContactsList from "@/app/contacts/ContactsList";
import {ContactBlockActions, ContactState, ContactViewModel, FormStatus, ReducerAction} from "@/app/utils";
import {ContactsDispatchContext, useAuthZ} from "@/app/StateManagement";

export default function ContactsBlock({}: {}) {
    const initialState = {contacts: [], loading: false}

    const reducer = (state: any, action: ReducerAction) => {
        // @ts-ignore
        if (Object.values(FormStatus).includes(action.type)) {
            return {...state}
            // @ts-ignore
        } else if (Object.values(ContactBlockActions).includes(action.type)) {
            switch (action.type) {
                case ContactBlockActions.SetContacts: {
                    return {...state, contacts: action.payload.contacts};
                }
                case ContactBlockActions.SetLoading: {
                    return {...state, loading: action.payload.loading};
                }
                case ContactBlockActions.SetAll: {
                    return {...state, ...action.payload}
                }
                default: {
                    console.log("hit default clause, which should not happen")
                    return {...state}
                }
            }
        }
        console.log("hit default clause, which should not happen")
        return {...state}
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    const handleClick = (event: any, contactvm: ContactViewModel) => {
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

        const newArray = replaceContact(contactvm, replacement, state);
        dispatch({type: ContactBlockActions.SetContacts, payload: {contacts: newArray}})
    }

    const {authZToken, setAuthZToken} = useAuthZ();
    const accessToken = authZToken;

    const replaceContact = (contactvm: ContactViewModel, replacement: ContactViewModel, state: any): any => {

        const findContactByContactUuid = (item: ContactViewModel) => {
            return item.contact.uuid === contactvm.contact.uuid;
        }
        const mapItemsFunc = (original: ContactViewModel) => original.contact.uuid === state.contacts?.at(indexToMutate).contact.uuid ? replacement : original


        const indexToMutate = state.contacts?.findIndex(findContactByContactUuid);
        if (indexToMutate === undefined) {
            throw new Error('Couldn\'t find contact to handle.');
        }
        return state.contacts.map(mapItemsFunc);
    }


    function handleGetContacts() {
        dispatch({type: ContactBlockActions.SetLoading, payload: {loading: true}});

        //TODO: add handling for exceptions
        fetch('http://localhost:8080/contacts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
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
                dispatch({
                    type: ContactBlockActions.SetAll,
                    payload: {contacts: Array.isArray(body) ? cvmArray : null, loading: false}
                });
            })
        .catch(error => {
            dispatch({type: ContactBlockActions.SetAll, payload: {contacts: null, loading: false}});
        })

    }

    return (
        <div style={{width: '100%'}}>
            <button onClick={() => handleGetContacts()}>Get Contacts</button>

            {accessToken !== "" && accessToken !== undefined && (
                state.loading && (<p>Loading...</p>)
                || (Array.isArray(state.contacts) && state.contacts.length > 0 ? (
                    // @ts-ignore
                    <ContactsDispatchContext value={dispatch}>
                        <ContactsList contacts={state.contacts} handleClick={handleClick}
                                      accessToken={accessToken}></ContactsList>
                    </ContactsDispatchContext>
            ) : (
                <p>No contacts found so far.</p>
                ))
            ) || (<p>Please authenticate yourself in login tab.</p>)
            }
        </div>
    );
}


