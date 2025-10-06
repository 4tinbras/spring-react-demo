'use client'

import {useState} from "react";
import ContactsList from "@/app/ContactsList";

export default function ContactBlock() {
    const [contacts, setContacts] = useState<[] | null>([]);
    const [loading, setLoading] = useState(false);


    //TODO probably worth investigating some optimization i.e. perhaps via reducer?
    const handleClick = (event, contact) => {
        contact.active = !contact.active;

        event.preventDefault()

        const findContactByContactUuid = (item) => item.uuid === contact.uuid;
        const mapItemsFunc = (original) => original.uuid === indexToMutate ? contact : original

        const indexToMutate = contacts?.findIndex(findContactByContactUuid);
        if (indexToMutate === undefined) {
            throw new Error('Couldn\'t find contact to handle.');
        }
        // @ts-ignore
        const newArray = contacts.map(mapItemsFunc);
        // @ts-ignore
        setContacts(newArray);
    }


    function handleGetContacts() {
        setLoading(true);

        //TODO: add handling for exceptions
        fetch('http://localhost:8080/contacts')
            .then(response => response.json())
            .then(body => {
                if (Array.isArray(body)) {
                    body.forEach(contact => {
                        contact.active = false;
                        return contact;
                    })

                    // @ts-ignore
                    setContacts(body)
                } else {
                    setContacts(null)
                }
                setLoading(false);
            })
        .catch(error => {
            setLoading(false);
            setContacts(null)
        })

    }

    return (
        <div style={{width: '100%'}}>
            <button onClick={() => handleGetContacts()}>Get Contacts</button>


            { Array.isArray(contacts) && contacts.length > 0 ? (
                <ContactsList contacts={contacts} handleClick={handleClick}></ContactsList>
            ) : (
                <p>No contacts found so far.</p>
            )}

            {loading && (<p>Loading...</p>)}
        </div>
    );
}


