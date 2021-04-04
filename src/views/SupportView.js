import React, { useState } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";

export default function SupportView(props) {
    const [view, setView] = useState(props.view);
    let viewContent;

    switch (view) {
        case "hosting": viewContent = <Hosting />; break;
        case "connecting": viewContent = <Connecting />; break;
        case "contribution": viewContent = <Contribution />; break;
        default: viewContent = <Intro />;
    }

    return <Container className="span-content" id="support-panel" data-spy="scroll" fluid>
        <Row className="span-height py-2">
            <Col className="d-none d-lg-block pr-0" xl={2} lg={2}>
                <Navbar className="bg-ash-gray pb-3 border-right border-orange" expand="md" id="support-navbar">
                    <Navbar.Collapse>
                        <Nav className="flex-column">
                            <Nav.Link className="text-light" onClick={() => setView("introduction")}>Introduction</Nav.Link>
                            <Nav.Link className="text-light" onClick={() => setView("hosting")}>Hosting</Nav.Link>
                            <Nav.Link className="text-light" onClick={() => setView("connecting")}>Connecting</Nav.Link>
                            <Nav.Link className="text-light" onClick={() => setView("contribution")}>Contributions</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Col>

            <Col>
                <Container className="text-light">
                    {viewContent}
                </Container>
            </Col>
        </Row>
    </Container>
}

function Intro() {
    return <>
        <h3>Introduction</h3>
        <p className="lead">
            Quick introduction on some of it's prominent features,
            limitations and others.
        </p>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Things it can do.</h4>
            <p className="noteblock">
                It allows hosting of files within a local network, It works almost exactly
                like how the feature in Asus File Manager works for file sharing but unlike
                that alternative, FileHub allows prospecting users to stream or download media files,
                documents, archives, just about anything really.
                    </p>
        </div>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Things it can't do.</h4>
            <p className="noteblock">
                While I want this software to be usable in almost any device(for hosting), It still has a lot to go in terms of development,
                and so It's only tested and made to work with windows machine, It also does not support file uploads yet since I'm still thinking
                of how to restrict access for users wanting to upload their stuff on a host.
            </p>
        </div>

        <br />
        <br />
    </>
}

function Hosting() {
    return <>
        <h3>
            Hosting
        </h3>
        <p className="lead">
            Learn how to Host your files and folders in minutes.
        </p>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Installation</h4>
            <p>This web-app relies on a server that uses Node.js so you need to install that first, a quick google search should turn up the official website where you can get an executable installer for your machine.</p>

            <p>After installing Node.js, you should be able to run the server out of the box by executing <u>web.bat</u> found within the server directory.</p>
        </div>


    </>
}

function Connecting() {
    return <>
        <h3>
            Connecting
        </h3>
        <p className="lead">
            Learn how to locate and connect with a Host.
        </p>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Locating a Server.</h4>
            <p>By default, a Host will listen on it's local address on port 55432, but since they can configure it, It's best to ask the host for their local address and on which port they're listening on.</p>
            <p>Incidentally, If you have access to the network's router or modem, then you can simply login to it and check each connected device to know their address.</p>
        </div>
    </>
}

function Contribution() {
    return <>
        <h3>Contributions</h3>
        <p className="lead">
            Think you can spice up the UI or add a nifty feature or two? please read on...
        </p>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>About me & the Project</h4>
            <p>
                I'm Manny, the sole developer for this project(both the server and it's modules),
                As you can tell, I have just stepped into this field(still almost 2 yrs in frontend dev),
                So I'll gladly take any recommendations for UI improvements as I'm admittedly a bit lacking on that area.
            </p>

            <p>
                Putting that aside, The willburr project is supposed to be for educators and teachers, given how ubiquitous handheld devices
                have become over the past decade, I think sharing of school materials(educational videos, school documents etc.) haven't improved much.
                
            </p>

            <p>
                Asking around, they often use facebook, or google drive to pass those stuff around, this might be nice but let's face it, The philippines is
                still a relatively poor country, with an average wage of about PHP250 a day, so taking out PHP50(to buy load for accessing the internet) out of that already meager wage is already
                asking for too much, not to mention setting up a local network(a hotspot or a router) is cheaper and more reliable(especially in the provinces).
            </p>


            <p>
                I Hope that even if it's just a little, I can help our School Bodies and Teachers provide better education for our growing student populace.
            </p>
        </div>

        <br/>
        <div className="border-left border-orange pl-2">
            <h4>Wait, what If I just want to use it with my friends and family to share our files?</h4>
            <p>
                Well, even though the project is aimed for a specific group of people, I also made it so it's usable for those who just want to share
                stuff with a close group of people so no worries there.
            </p>
        </div>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Want to Improve or add new features?</h4>
            <p>
                For now, most of the originally slated/planned features have been introduced("Minimum Viable Product"),
                So I'm currently leaning on improving the UI, refactoring the codebase and add some small features here and there.
                But if you think you have a good feature/functionality to introduce, then feel free to create a branch of your own, I'll link the
                github repo for this project below.
        </p>
        </div>

        <div className="border-left border-orange pl-2">
            <h4></h4>
        </div>

    </>
}