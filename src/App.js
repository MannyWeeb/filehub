import React from "react";
import request from "request";
import { Alert, Col, Container, Row } from "react-bootstrap";

import DirectoryTree from "./components/DirectoryTree";
import DirectoryView from "./views/DirectoryView";
import Navigator from "./components/Navigator";
import FileView from "./views/FileView";
import Home from "./views/Home";

const SERVER = window.location.hostname;
const APISERVER = `${window.location.protocol}//${SERVER}:55432/fh/api`;
const STATICSERVER = `${window.location.protocol}//${SERVER}:55432/fh/static`;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            root: null,
            view: "home",

            hasError: false,
            reason: "",

            itemKey: null,
            itemValue: null
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        let mainPanel = ""

        switch (this.state.view) {
            case "file": mainPanel = <FileView key={this.state.itemKey} data={{ key: this.state.itemKey, value: this.state.itemValue }} onServerError={this.handleServerError} onServerReconnect={this.handleServerReconnect}/>; break;

            case "dir": mainPanel = <DirectoryView key={this.state.itemKey} data={{ key: this.state.itemKey, value: this.state.itemValue }} onItemSelect={this.handleItemSelect} onServerError={this.handleServerError}/>; break;

            default: {
                mainPanel = <Home />
            }
        }

        let errorAlert = "";

        if (this.state.hasError) {
            errorAlert = <Alert className="my-2" variant="danger" test-id="alert-danger">{this.state.reason}</Alert>
        }

        return <React.StrictMode>
            <Navigator onNav={(e) => this.setState({ view: e })} />
            <Container className="content-height pr-0" fluid>
                <Row className="span-content px-0" id="content-panel">
                    <Col id="directory-tree-col" className="py-2" xl={3} lg={3} md={4} sm={12}>
                        <DirectoryTree data={this.state.root} onItemSelect={this.handleItemSelect}>
                            {errorAlert}
                        </DirectoryTree>
                    </Col>

                    <Col className="span-content py-2 px-0" xl={9} lg={9} md={8} sm={12}>
                        <Container className="span-content custom-dark text-light px-0" id="explorer-panel" fluid>
                            {mainPanel}
                        </Container>
                    </Col>
                </Row>
            </Container>
        </React.StrictMode>
    }

    handleItemSelect = (item) => {
        this.setState({ view: item.value.type, itemValue: item.value, itemKey: item.key });
    }

    handleServerError = (e)=>{
        this.setState({
            root: null,
            view: "home",

            hasError: true,
            reason: e,

            itemKey: null,
            itemValue: null
        });
    }
    handleServerReconnect = ()=> this.setState({hasError : false , reason : null})

    fetchData = () => {
        request.get(`${APISERVER}/getData`, {}, (err, res, body) => {
            if (err) {
                this.setState({ hasError: true, reason: "Server unreachable." });
            } else {
                if (res.statusCode !== 200) {
                    this.setState({ hasError: true, reason: JSON.parse(body) });
                } else {
                    this.setState({ root: JSON.parse(body) });
                }
            }
        });
    }
}

export { SERVER , APISERVER , STATICSERVER };