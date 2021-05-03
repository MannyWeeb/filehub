/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import request from "request";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";

import DirectoryTree from "./components/DirectoryTree";
import DirectoryView from "./views/DirectoryView";
import Navigator from "./components/Navigator";
import FileView from "./views/FileView";
import Home from "./views/Home";
import SupportView from "./views/SupportView";
import Dashboard from "./views/Dashboard";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { encodePath } from "./utils/helpers";

const SERVER = window.location.hostname,
    APISERVER = `${window.location.protocol}//${SERVER}:55432/fh/api`,
    STATICSERVER = `${window.location.protocol}//${SERVER}:55432/fh/static`;

export default function App() {
    const [root, setRoot] = useState(null);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);

    const location = useLocation();
    const history = useHistory();

    //Handles initialization and retrying init api calls.
    useEffect(() => {
        if (!error) {
            request.get(`${APISERVER}/getData`, {}, (err, res, body) => {
                if (err) {
                    setError("Server unreachable");
                } else {
                    if (res.statusCode !== 200) {
                        setError(JSON.parse(body));
                    } else {
                        setRoot(JSON.parse(body));
                    }
                }
            });
        }
    }, [error]);

    useEffect(() => {
        if (root) {
            const { pathname, search } = location;
            if (pathname === "/browse" || pathname === "/preview") {
                try{
                    for (const [param, value] of new URLSearchParams(search)) {
                        if (param === "p") {
                            let target = searchTree(root , value.substring(1).split("/"));

                            if (target) {
                                const { type , path} = target.value;

                                const illegalViewData = (pathname === "/browse" && type === "file") || (pathname === "/preview" && type === "dir");

                                if(illegalViewData){
                                    alert(`Illegal data provided, ${type === "dir" ? "Directory views can only accept directories as input" : "File views can only accept files as input"}, Rectifying URL...`);
                                    history(encodePath(type , path));
                                }else{
                                    setData(target);
                                }
                    
                            } else {
                                alert("Resource not found, redirecting to homepage");
                                history.push("/");
                            }
                        }
                    }
                }catch(e){
                    alert("Resource URI seems to be malformed, redirecting to homepage");
                    history.push("/");
                }
            }
        }
    }, [root , location]);
    
    let handleServerReconnect = () => {
        setError(false);
    }

    let handleServerError = (e) => {
        setError(e);
        setRoot(null);
        setData(null);
    }

    //Runtime Complexity: O(n) - constant
    let searchTree = (initialRoot , obj) => {
        let target = { key: "/", value: initialRoot };
        for (const dir of obj) {
            if(dir === "")break;
            let temp = target.value.content[dir];
            target = temp ? { key : dir , value : temp} : null;
            if(!target)break;
        }
        return target;
    }

    return (<>
        <Navigator />
        <Container className="content-height pr-0" fluid>
            <Row className="span-content px-0" id="content-panel">
                <Col id="directory-tree-col" className="py-2" xl={3} lg={3} md={4} sm={12}>
                    <DirectoryTree data={root}>
                        {error ? <Alert className="my-2" variant="danger" test-id="alert-danger">
                            {error}
                            <button className="btn btn-primary float-right" onClick={handleServerReconnect}>
                                <span className="fas fa-redo">
                                </span>
                            </button>
                        </Alert> : ""}
                    </DirectoryTree>
                </Col>

                <Col className="span-content py-2 px-0" xl={9} lg={9} md={8} sm={12}>
                    <Container className="span-content custom-dark text-light px-0 py-0" id="explorer-panel" fluid>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/dashboard" component={Dashboard} />
                            <Route path="/support" component={SupportView} />
                            <Route path="/preview">
                                <FileView data={data} onServerError={handleServerError} onServerReconnect={handleServerReconnect} />
                            </Route>
                            <Route path="/browse">
                                <DirectoryView data={data} onServerError={handleServerError}/>
                            </Route>
                            <Route path="*">
                                <UnknownComponent/>
                            </Route>
                        </Switch>
                    </Container>
                </Col>
            </Row>
        </Container>
    </>)
}

function UnknownComponent(){
    return <Container>
        <center>
            <br/>
            <h2>404 Not Found</h2>

            <br/>

            <p>You're trying to access a page that does not exist.</p>
        </center>
    </Container>
}

export { APISERVER, SERVER, STATICSERVER }