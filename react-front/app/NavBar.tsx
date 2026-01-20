'use client'

import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from 'reactstrap';
import {NavLink as RouterNavLink} from "react-router";

export default function NavBar({activeTab, onNavbarClick}: { activeTab: String, onNavbarClick: any }) {

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
                        {activeTab === 'HOME' && (
                                <RouterNavLink to="/" onClick={() => onNavbarClick('HOME')}>Home</RouterNavLink>)
                            || (<RouterNavLink to="/" onClick={() => onNavbarClick('HOME')}>Home</RouterNavLink>)}
                    </NavItem>
                    <NavItem>
                        {activeTab === 'LOGIN' && (
                                <RouterNavLink to="/login" onClick={() => onNavbarClick('LOGIN')}>Login</RouterNavLink>)
                            || (<RouterNavLink to="/login"
                                               onClick={() => onNavbarClick('LOGIN')}>Login</RouterNavLink>)}
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}