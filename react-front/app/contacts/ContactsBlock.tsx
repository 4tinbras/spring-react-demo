'use client'

import {useReducer} from "react";
import ContactsList from "@/app/contacts/ContactsList";
import {ContactBlockActions, ContactState, ContactViewModel, FormStatus, ReducerAction} from "@/app/utils";
import {ContactsDispatchContext, useAuthZ} from "@/app/StateManagement";

export default function ContactsBlock({}: {}) {
    const initialState = {contacts: [], status: FormStatus.Initial}

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
                    return {...state, status: action.payload.status};
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

    const {authZToken, setAuthZToken} = useAuthZ();
    const accessToken = authZToken;


    function handleGetContacts() {
        dispatch({type: ContactBlockActions.SetLoading, payload: {status: FormStatus.Pending}});

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
                    payload: {contacts: Array.isArray(body) ? cvmArray : null, status: FormStatus.Ok}
                });
            })
        .catch(error => {
            dispatch({type: ContactBlockActions.SetAll, payload: {contacts: null, status: FormStatus.Failed}});
        })

    }

    return (
        <div style={{width: '100%'}}>
            <button onClick={() => handleGetContacts()}>Get Contacts</button>

            {accessToken !== "" && accessToken !== undefined && (
                state.status === FormStatus.Pending && (<p>Loading...</p>)
                || (Array.isArray(state.contacts) && state.contacts.length > 0 ? (
                    // @ts-ignore
                    <ContactsDispatchContext value={dispatch}>
                        <ContactsList contacts={state.contacts} accessToken={accessToken}></ContactsList>
                    </ContactsDispatchContext>
            ) : (
                <p>No contacts found so far.</p>
                ))
            ) || (<p>Please authenticate yourself in login tab.</p>)
            }
        </div>
    );
}


