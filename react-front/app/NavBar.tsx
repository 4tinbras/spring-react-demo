'use client'

import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from 'reactstrap';
import Link from "next/link";

export default function NavBar() {

    const [isOpen, setIsOpen] = useState(true);

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
                        <Link href="/contacts">Home</Link>
                    </NavItem>
                    <NavItem>
                        <Link href="/login">Login</Link>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}