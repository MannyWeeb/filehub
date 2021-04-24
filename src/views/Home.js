import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
    return <Container className="span-content py-4 px-5" id="home-view" fluid>
        <center>
            <p className="service-name filehub-card-icon text-center px-2 py-1 m-0 zoomed">
                <span className="text-light">File</span>
                <span className="text-black bg-orange">Hub</span>
            </p>

            <h3>Probably the easiest way to host and share your files over a small network.</h3>
        </center>

        <Row className="mb-3 pt-4">
            <Col className="py-5" id="hosting-guide-col">
                <img className="bg-guide" src="res/images/hosting_screenshot.png" alt="Hosting Screenshot"></img>
                <div className="bg-text">
                    <u><h3>As a Host:</h3></u>
                    <p>To start using FileHub, point it to a folder and it'll serve anything within it, files and folders included. Sounds simple? It is!</p>

                    <p>Follow this guide to do so, you just need to edit a line so it's super easy.</p>
                    <br />
                    <Link className="btn btn-primary" to="/support/hosting">Hosting 101</Link>
                </div>
            </Col>
        </Row>

        <Row className="my-5">
            <Col className="py-5" id="connecting-guide-col">
                <img className="bg-guide" src="res/images/connecting_screenshot.png" alt="Connecting Screenshot"></img>

                <div className="bg-text">
                    <u><h3>As a User:</h3></u>
                    <p>
                        To access a FileHub Server, A user needs to know the host's network location,
                        This shouldn't be too hard.
                    </p>

                    <p>
                        If you're having trouble in doing so, follow the guide
                        provided below
                    </p>
                    <br />
                    <Link className="btn btn-primary" to="/support/connecting">Connecting to a Host</Link>
                </div>
            </Col>
        </Row>

    </Container>
}