'use client'

import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from 'reactstrap';
import Link from "next/link";
import {useAuthZ} from "@/app/StateManagement";

export default function NavBar() {

    const [isOpen, setIsOpen] = useState(true);

    const {authZToken, setAuthZToken, activeTab, setActiveTab} = useAuthZ();

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/" className="me-auto">
                spreact
            </NavbarBrand>
            <NavbarToggler onClick={() => {
                setIsOpen(!isOpen)
            }}/>
            <Collapse isOpen={isOpen} navbar>
                <Nav className="justify-content-start" style={{width: "100%"}} navbar pills>
                    <NavItem>
                        {activeTab === 'HOME' && (
                                <Link href="/contacts" className={'active'}
                                      onClick={() => setActiveTab('HOME')}>Home</Link>)
                            || (<Link href="/contacts">Home</Link>)}
                    </NavItem>
                    <NavItem>
                        {activeTab === 'LOGIN' && (
                                <Link href="/login" className={'active'} onClick={() => setActiveTab('LOGIN')}>Login</Link>)
                            || (<Link href="/login">Login</Link>)}
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}