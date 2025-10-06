'use client'

import {useState} from "react";
import List from "@/app/ContactsList";
import ContactsList from "@/app/ContactsList";

export default function ContactBlock() {
    const [contacts, setContacts] = useState<[] | null>([]);
    const [loading, setLoading] = useState(false);


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
                <ContactsList contacts={contacts}></ContactsList>
            ) : (
                <p>No contacts found so far.</p>
            )}

            {loading && (<p>Loading...</p>)}
        </div>
    );
}


