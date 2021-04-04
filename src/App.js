import React from "react";
import { useState , useEffect } from "react";
import request from "request";
import { Alert, Col, Container, Row } from "react-bootstrap";

import DirectoryTree from "./components/DirectoryTree";
import DirectoryView from "./views/DirectoryView";
import Navigator from "./components/Navigator";
import FileView from "./views/FileView";
import Home from "./views/Home";
import SupportView from "./views/SupportView";

const SERVER = window.location.hostname;
const APISERVER = `${window.location.protocol}//${SERVER}:55432/fh/api`;
const STATICSERVER = `${window.location.protocol}//${SERVER}:55432/fh/static`;

export default function App() {
    const [view , setView]  = useState("home");
    const [root, setRoot]   = useState(null);
    const [error, setError] = useState(false);
    const [data , setData]  = useState(null); 

    useEffect(() => {
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
    }, []);

    let clearData = ()=>{
        setView("home");
        setRoot(null);
        setData(null);
    }

    let handleItemSelect = (item)=>{
        setView(item.value.type);
        setData(item);
    };

    let handleServerReconnect = ()=>{
        setError(false);
    }

    let handleServerError = (e)=>{
        setError(e);
        clearData();
    }

    let renderMainPanel = (view) =>{
        switch(view){
            case "file"    : return <FileView key={data.fileName} data={data} onServerError={handleServerError} onServerReconnect={handleServerReconnect} />;
            case "dir"     : return <DirectoryView  data={data} onItemSelect={handleItemSelect} onServerError={handleServerError} />;
            case "support" : return <SupportView view={data}/>;
            default: return <Home onNav={(e)=>{
                const str = e.split("-");
                setView(str[0]);
                setData(str[1]);
            }}/>;
        }
    }

    return (<React.StrictMode>
        <Navigator onNav={setView} />
        <Container className="content-height pr-0" fluid>
            <Row className="span-content px-0" id="content-panel">
                <Col id="directory-tree-col" className="py-2" xl={3} lg={3} md={4} sm={12}>
                    <DirectoryTree data={root} onItemSelect={handleItemSelect}>
                        {error ? <Alert className="my-2" variant="danger" test-id="alert-danger">{error}</Alert> : ""}
                    </DirectoryTree>
                </Col>

                <Col className="span-content py-2 px-0" xl={9} lg={9} md={8} sm={12}>
                    <Container className="span-content custom-dark text-light px-0 py-3" id="explorer-panel" fluid>
                        {renderMainPanel(view)}
                    </Container>
                </Col>
            </Row>
        </Container>
    </React.StrictMode>)
}

export { SERVER , APISERVER , STATICSERVER };