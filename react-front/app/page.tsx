'use client'

import ContactBlock from "@/app/ContactsBlock";
import NavBar from "@/app/NavBar";
import {useState} from "react";
import LoginBlock from "@/app/LoginBlock";
// import 'bootstrap/dist/css/bootstrap.min.css'; //not necessary if added CDN link

export default function Home() {

    const [activeTab, setActiveTab] = useState("HOME");
    const [accessToken, setAccessToken] = useState("");

    const TABS = {
        'HOME': <ContactBlock accessToken={accessToken}/>,
        'LOGIN': <LoginBlock setAccessToken={setAccessToken}/>
    }

    {/*https://react.dev/learn/synchronizing-with-effects
    TODO: add interval checkup on access token expiry and show pop-up or try to refresh
    */
    }


    return (
      <>
          <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
              integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
              crossOrigin="anonymous"
          />
          <div>
              <NavBar activeTab={activeTab} onNavbarClick={setActiveTab}></NavBar>
              <div className={'container justify-content-center d-flex my-5'}>
                  {
                      // @ts-ignore
                      TABS[activeTab]
                  }
              </div>
          </div>
      </>
  )


}
