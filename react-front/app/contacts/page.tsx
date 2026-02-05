'use client'

import ContactsBlock from "@/app/contacts/ContactsBlock";
import React from "react";
import {ContactsProvider, contactsReducer} from "@/app/StateManagement";
import {FormStatus} from "@/app/utils";
// import 'bootstrap/dist/css/bootstrap.min.css'; //not necessary if added CDN link

export default function Home() {

    return (
        <>
            <ContactsProvider initialState={{contacts: [], status: FormStatus.Initial}} reducer={contactsReducer}>
                <ContactsBlock></ContactsBlock>
            </ContactsProvider>

        </>
    )


}
