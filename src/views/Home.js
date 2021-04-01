import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

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
            <Col className="span-width" xl={8} lg={12} md={12} sm={12}>
                <img className="span-width" src={"res/images/hosting_screenshot.png"} alt="how_to_host_screenshot"></img>
            </Col>
            <Col className="py-5" xl={4} lg={12} md={12} sm={12}>
                <u><h3>As a Host:</h3></u>
                <p>To start using FileHub, point it to a folder and it'll serve anything within it, files and folders included. Sounds simple? It is!</p>

                <p>Follow this guide to do so, you just need to edit a line so it's super easy.</p>
                <br />
                <Button variant="primary">Hosting 101</Button>
            </Col>
        </Row> 

        <Row className="my-5">
            <Col className="pb-5" xl={4} lg={12} md={12} sm={12}>
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
                <Button variant="primary">Connecting to a Host.</Button>
            </Col>
            <Col xl={8} lg={12} md={12} sm={12}>
                <img className="span-width" src="res/images/connecting_screenshot.png" alt="getting_connected_screenshot"></img>
            </Col>
        </Row>

    </Container>
}