'use client'

import React, { useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

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
                <Nav className="justify-content-start" style={{ width: "100%" }} navbar>
                    <NavItem>
                        <NavLink href="https://example.com">example</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}