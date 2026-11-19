'use client'

import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from 'reactstrap';
import Link from "next/link";
import "./src/styles/navigation-header.css";
import {useAuthZ} from "@/app/StateManagement";

export default function NavBar() {

    const [isOpen, setIsOpen] = useState(true);

    const {authZToken, setAuthZToken, activeTab, setActiveTab} = useAuthZ();

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
                            {activeTab === 'CONTACTS' && (
                                    <Link href="/contacts" className={'active'}
                                          onClick={() => setActiveTab('CONTACTS')}>Contacts</Link>)
                                || (<Link href="/contacts">Contacts</Link>)}
                        </NavItem>
                        <NavItem>
                            <div className={'dropdown-container full-height'}>
                            {activeTab === 'ABOUT' && (
                                    <Link href="/about" className={'active dropdown-link'}
                                          onClick={() => setActiveTab('ABOUT')}>About</Link>)
                                || (<Link href="/about" className={'dropdown-link'}>About</Link>)}
                                <div className={'dropdown-content dropdown-grid'}>
                                    <Link href="/about/blog" className={'dropdown-link'}>Blog</Link>
                                    <Link href="/about/contact" className={'dropdown-link'}>Contact Us</Link>
                                </div>
                            </div>
                        </NavItem>
                        <div className={'display-flex display-flex-expand'}>
                        </div>
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