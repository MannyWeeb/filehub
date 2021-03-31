import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

function Navigator(props) {
    return <Navbar className="custom-dark mb-3" variant="dark" expand="md" >
        <Navbar.Brand>
            <p className="service-name filehub-card-icon text-center px-2 py-1 m-0 pointable" onClick={() => props.onNav("home")}>
                <span className="text-light">File</span>
                <span className="text-black bg-orange">Hub</span>
            </p>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav-controls" />

        <Navbar.Collapse id="nav-controls">
            <Nav>
                <Nav.Link className="text-light text-bold mr-3">
                    <b><span className="fas fa-plus mr-1"></span>New Folder</b>
                </Nav.Link>
                <Nav.Link className="text-light text-bold">
                    <b><span className="fas fa-upload mr-1"></span>Upload</b>
                </Nav.Link>
            </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse>
            <Nav>
                <NavDropdown title="Language" id="language-toggler">
                    <NavDropdown.Item active>EN</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default Navigator;