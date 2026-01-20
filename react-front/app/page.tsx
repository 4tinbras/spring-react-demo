'use client'

import ContactBlock from "@/app/ContactsBlock";
import NavBar from "@/app/NavBar";
import React, {useState} from "react";
import LoginBlock from "@/app/LoginBlock";
import {BrowserRouter, Route, Routes} from "react-router";
// import 'bootstrap/dist/css/bootstrap.min.css'; //not necessary if added CDN link

export default function Home() {

    const AUTHORIZATION_SERVER_URL = `${process.env.NEXT_PUBLIC_AUTHZ_SERVICE}`;
    const AUTHORIZATION_ENDPOINT_PATH = `${process.env.NEXT_PUBLIC_AUTHZ_ENDPOINT}`;
    const AUTHORIZATION_QUERY = "?client_id=spreact-conf&redirect_uri=http%3A%2F%2Flocalhost%3A3000&grant_type=authorization_code&response_type=code";
    const AUTHORIZATION_URL = AUTHORIZATION_SERVER_URL + AUTHORIZATION_ENDPOINT_PATH + AUTHORIZATION_QUERY;

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
              <BrowserRouter>

              <NavBar activeTab={activeTab} onNavbarClick={setActiveTab}></NavBar>
              <div className={'container justify-content-center d-flex my-5'}>
                  {
                      // @ts-ignore
                      // TABS[activeTab]


                      <Routes>
                          <Route index element={<ContactBlock accessToken={accessToken}/>}/>
                          {/*<Route path="home" element={<ContactBlock accessToken={accessToken}/>} />*/}
                          <Route path='login'
                                 element={<LoginBlock accessToken={accessToken} setAccessToken={setAccessToken}/>}/>
                      </Routes>
                  }
              </div>
              </BrowserRouter>
          </div>
      </>
  )


}
