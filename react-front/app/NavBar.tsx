'use client'

import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from 'reactstrap';
import Link from "next/link";
import "./src/styles/navigation-header.css";
import {useAuthZ} from "@/app/StateManagement";

export default function NavBar() {

    const [isOpen, setIsOpen] = useState(true);

    const {authZToken, setAuthZToken, activeTab, setActiveTab} = useAuthZ();

    //TODO: add check if state was pushed to backend before navigating away

    console.log(authZToken);
    console.log(authZToken !== "");
    console.log(authZToken === "");

    return (
        <Navbar color="dark" dark expand="md">
            <div className="top-container display-flex">
                <NavbarBrand href="/">
                    spreact
                </NavbarBrand>
                <NavbarToggler onClick={() => {
                    setIsOpen(!isOpen)
                }}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="justify-content-start full-height" style={{width: "100%"}} navbar pills>
                        <NavItem>
                            {/*TODO logic deciding whether class is needed requires new solution*/}
                            {activeTab === 'CONTACTS' && (
                                    <Link href="/contacts" className={'active'}
                                          onClick={() => setActiveTab('CONTACTS')}>Contacts</Link>)
                                || (<Link href="/contacts">Contacts</Link>)}
                        </NavItem>
                        <NavItem>
                            {activeTab === 'ABOUT' && (
                                    <Link href="/about" className={'active'}
                                          onClick={() => setActiveTab('ABOUT')}>About</Link>)
                                || (<Link href="/about">About</Link>)}
                        </NavItem>
                        { authZToken !== "" && (
                        <NavItem>
                            {activeTab === 'ACCOUNT' && (
                                    <Link href="/account" className={'active'}
                                          onClick={() => setActiveTab('ACCOUNT')}>Account</Link>)
                                || (<Link href="/account">Account</Link>)}
                        </NavItem>
                        )}
                        { authZToken === "" && (
                        <NavItem>
                            {activeTab === 'LOGIN' && (
                                    <Link href="/login" className={'active'}
                                          onClick={() => setActiveTab('LOGIN')}>Login</Link>)
                                || (<Link href="/login">Login</Link>)}
                        </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </div>
        </Navbar>
    )
}