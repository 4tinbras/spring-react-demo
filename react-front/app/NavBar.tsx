'use client'

import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';

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
                        {activeTab === 'HOME' && (<NavLink active onClick={() => onNavbarClick('HOME')}>Home</NavLink>)
                            || (<NavLink onClick={() => onNavbarClick('HOME')}>Home</NavLink>)}
                    </NavItem>
                    <NavItem>
                        {activeTab === 'LOGIN' && (
                                <NavLink active onClick={() => onNavbarClick('LOGIN')}>Login</NavLink>)
                            || (<NavLink onClick={() => onNavbarClick('LOGIN')}>Login</NavLink>)}
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}