'use client'

import ContactsBlock from "@/app/contacts/ContactsBlock";
import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css'; //not necessary if added CDN link

export default function Home() {

    {/*https://react.dev/learn/synchronizing-with-effects
    TODO: add interval checkup on access token expiry and show pop-up or try to refresh
    */
    }

    return (
        <>
            <ContactsBlock></ContactsBlock>
        </>
    )


}
