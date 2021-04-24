import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Navigator() {
    let dashboardNav = "";

    let history = useHistory();

    if (window.location.hostname === "localhost") {
        dashboardNav = <Nav.Link className="text-light text-bold mr-1" onClick={()=>{
            history.push("/dashboard");
        }}>
                <b><span className="fas fa-wrench mr-1"></span>Dashboard</b>
            </Nav.Link>
    }

    return <Navbar className="custom-dark mb-3" variant="dark" expand="md" >
        <Navbar.Brand>
            <Link to="/">
                <p className="service-name filehub-card-icon text-center px-2 py-1 m-0 pointable">
                    <span className="text-light">File</span>
                    <span className="text-black bg-orange">Hub</span>
                </p>
            </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav-controls" />

        <Navbar.Collapse id="nav-controls">
            <Nav>
                {dashboardNav}
                <Nav.Link className="text-secondary text-bold mr-1" disabled>
                    <b><span className="fas fa-plus mr-1"></span>New Folder</b>
                </Nav.Link>
                <Nav.Link className="text-secondary text-bold mr-1" disabled>
                    <b><span className="fas fa-upload mr-1"></span>Upload</b>
                </Nav.Link>
            </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse>
            <Nav>
                <NavDropdown title="Language" id="language-toggler">
                    <NavDropdown.Item active>English</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default Navigator;