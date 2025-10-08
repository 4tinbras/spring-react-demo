'use client'

import {useReducer} from "react";
import ContactsList from "@/app/ContactsList";

export default function ContactBlock() {
    const initialState = {contacts: [], loading: false}

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_CONTACTS': {
                return {...state, contacts: action.payload.contacts};
            }
            case 'SET_LOADING': {
                return {...state, loading: action.payload.loading};
            }
            case 'SET_ALL': {
                return {...state, ...action.payload}
            }
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)


    const handleClick = (event, contact) => {
        event.preventDefault()

        const replacement = {
            uuid: contact.uuid,
            firstName: contact.firstName,
            lastName: contact.lastName,
            phoneNo: contact.phoneNo,
            email: contact.email,
            active: !contact.active
        }

        const findContactByContactUuid = (item) => item.uuid === contact.uuid;
        const mapItemsFunc = (original) => original.uuid === state.contacts?.at(indexToMutate).uuid ? replacement : original


        const indexToMutate = state.contacts?.findIndex(findContactByContactUuid);
        if (indexToMutate === undefined) {
            throw new Error('Couldn\'t find contact to handle.');
        }
        const newArray = state.contacts.map(mapItemsFunc);
        dispatch({type: 'SET_CONTACTS', payload: {contacts: newArray}})
    }


    async function handleGetContacts() {
        dispatch({type: 'SET_LOADING', payload: {loading: true}});

        //TODO: add handling for exceptions
        fetch('http://localhost:8080/contacts')
            .then(response => response.json())
            .then(body => {
                if (Array.isArray(body)) {
                    body.forEach(contact => {
                        contact.active = false;
                        return contact;
                    })
                } else {
                }
                dispatch({type: 'SET_ALL', payload: {contacts: Array.isArray(body) ? body : null, loading: false}});
            })
        .catch(error => {
            dispatch({type: 'SET_ALL', payload: {contacts: null, loading: false}});
        })

    }

    return (
        <div style={{width: '100%'}}>
            <button onClick={() => handleGetContacts()}>Get Contacts</button>

            {state.loading && (<p>Loading...</p>)
                || (Array.isArray(state.contacts) && state.contacts.length > 0 ? (
                    <ContactsList contacts={state.contacts} handleClick={handleClick}></ContactsList>
            ) : (
                <p>No contacts found so far.</p>
                ))}
        </div>
    );
}


