import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SupportView() {
    let { path , url } = useRouteMatch();
    return <Router>
        <Container className="span-content py-3" id="support-panel" data-spy="scroll" fluid>
            <Row className="span-height py-2">
                <Col xl={2}>
                    <Navbar className="custom-dark pb-3" expand="xl">
                        <Navbar.Toggle className="bg-orange" aria-controls="support-navbar" />
                        <Navbar.Collapse id="support-navbar">
                            <Nav className="flex-column mt-3 pl-2 border-left border-orange">
                                {["introduction", "hosting", "connecting", "contribution"].map((e,i) => {
                                    return <Link className="text-light" to={i === 0 ? `${url}` : `${url}/${e}`} key={e}>
                                        <h5>{e.charAt(0).toUpperCase() + e.substring(1, e.length)}</h5>
                                    </Link>
                                })}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>

                <Col>
                    <Container className="text-light">
                        <Switch>
                            <Route path={`${path}/hosting`} component={Hosting} />
                            <Route path={`${path}/connecting`} component={Connecting} />
                            <Route path={`${path}/contribution`} component={Contribution} />
                            <Route path={`${path}`} component={Intro} />
                        </Switch>
                    </Container>
                </Col>
            </Row>
        </Container>
    </Router>
}

function Intro() {
    return <>
        <h3>
            <span className="fas fa-book-open text-orange mr-2"></span>
            Introduction
        </h3>
        <p className="lead">
            Quick introduction on some of it's prominent features,
            limitations and other concerns.
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

            <p className="noteblock">
                Not only that, It's also mobile-friendly, which makes it usable on smaller screened devices,
                Also If the theme reminds you of something weird then please don't mention it to others :D
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
            <span className="fas fa-server text-orange mr-2"></span>
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

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Configuration</h4>
            <p>
                Within the server's root folder, you may notice a file named "config.json",
                this is the file that you'll need to edit if you're looking to share a folder.
            </p>

            <p>This file contains some properties that are used by the server, for now we're only concerned with these two</p>

            <p className="noteblock">{"modules > filehub > enabled (Boolean)"}</p>
            <p className="noteblock">{"modules > filehub > rootDir (Folder Path)"}</p>

            <p>
                As the name suggests, <u>toggling <b>enabled</b> to false disables FileHub support for the server</u>,
                While anything within <b>rootDir</b> is shared if the module is enabled, <u>It is recommended to use absolute path when setting the <b>rootDir</b> to avoid complications.</u>
            </p>
        </div>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Others</h4>
            <p>If you're the host, then you can access the dashboard window within this app, All you need to do is use localhost as your hostname and It should pop up on the navigation bar, Like this:</p>
            <p className="noteblock">
                <b className="text-success mr-1">http://localhost:[port]</b> instead of <b className="text-danger ml-1">http://[ip-address]:[port]</b>
            </p>
        </div>

    </>
}

function Connecting() {
    return <>
        <h3>
            <span className="fas fa-link text-orange mr-2"></span>
            Connecting
        </h3>
        <p className="lead">
            Learn how to locate and connect with a Host.
        </p>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>Joining a local network</h4>
            <p>
                Obviously, you need to join a network first, network is strictly used here in terms of computer networks
                so they may use ethernet cables or WiFi, either way, you should ask the network admin for permission to
                enter their network. If you know for a fact that someone is hosting a FileHub server, then proceed.
            </p>
        </div>

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
        <h3>
            <span className="fas fa-hands-helping text-orange mr-2"></span>
            Contributions
        </h3>
        <p className="lead">
            Think you can spice up the UI or add a nifty feature or two? please read on...
        </p>

        <br />
        <br />

        <div className="border-left border-orange pl-2">
            <h4>About me & the motivation for the Project</h4>
            <p>
                I'm Manny, the sole developer for this project(both the server and it's modules),
                As you can tell, I have just stepped into this field(still almost 2 yrs in frontend dev),
                So I'll gladly take any recommendations for UI/UX improvements as I'm admittedly a bit lacking on that area.
            </p>

            <p>
                Putting that aside, The willburr project is supposed to be for educators and teachers, given how ubiquitous handheld devices
                have become over the past decade, I think sharing of school materials(educational videos, school documents etc.) haven't improved much.
            </p>

            <p>
                After asking around, It looks like facebook, and google drive are the mainly used apps for passing those stuff around, that may work but let's face it, It requires students to have regular access
                to the internet, which costs money. Most teachers already bring their copies of digital documents with them in their laptops or computers, So why won't they just distribute
                them as is? It's because distributing them becomes tedious and time consuming the more students a teacher has.
            </p>

            <p>
                This method is cheaper(zero-cost actually), convenient and arguably more reliable(especially if deployed in the rural provinces)
            </p>

            <p>
                I Hope that even if it's just a little, I can help our School Bodies and Teachers provide better education for our growing student populace.
            </p>
        </div>

        <br />
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

        <br />
        <br />

        <Nav>
            <Nav.Link className="text-light" href="https://github.com/MannyWeeb/filehub.git">
                <h4 className="border-bottom border-orange pb-1">
                    <span className="fab fa-github pr-2"></span>
                    FileHub Repo
                </h4>
                <p className="small">This project</p>
            </Nav.Link>
            <Nav.Link className="text-light" href="https://github.com/MannyWeeb/willburr.git">
                <h4 className="border-bottom border-orange pb-1">
                    <span className="fab fa-github pr-2"></span>
                    Willburr Repo
                </h4>
                <p className="small">The server it attaches to</p>
            </Nav.Link>
        </Nav>

        <br />
        <br />
    </>
}