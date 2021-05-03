/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from "react";
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import { bytesToSize, determineFileType , encodePath } from "../utils/helpers";

let DirectoryContext;

export default function DirectoryView(props) {
    let content = <></>

    if (props.data) {
        const { value } = props.data;
        DirectoryContext = createContext(props);
        if (value.type && value.type === "dir") {
            content = <DirectoryContext.Provider value={props}>
                <div className="span-content">
                    <Row>
                        <Col>
                            <DirectoryDetails />
                        </Col>
                    </Row>
                    <center><h4>Contents</h4></center>
                    <Row>
                        <Col className="span-content">
                            <DirectoryContent data={value.content} />
                        </Col>
                    </Row>
                </div>
            </DirectoryContext.Provider>
        }
    }

    return content;
}

function DirectoryDetails() {
    return <DirectoryContext.Consumer>
        {(props) => {
            const { data } = props;
            const { path, contains, size , type } = data.value;
            const hasParent = path !== "/" && path.replace(/\B\//g, "").split("/").length >= 1;

            let controls = "";

            if (hasParent) {
                controls = <Link className="text-light" to={encodePath(type,path.replace(`/${data.key}`, ""))}>
                        <span className="fas fa-arrow-left pointable"></span>
                    </Link>
            }

            let containsStr = formatContent(contains);
            return <center className="details">
                <h2 id="dir-controls">
                    {controls}
                </h2>
                <span className="fas fa-folder file-type text-orange"></span>
                <h5>{data.key}</h5>
                <h6>Contains: {containsStr}</h6>
                <h6>Total Size: {bytesToSize(size)}</h6>

                <ButtonGroup>
                    <Button variant="primary" disabled>Download</Button>
                </ButtonGroup>
            </center>
        }}
    </DirectoryContext.Consumer>
}

function DirectoryContent(props) {
    let content = <h4>Empty Folder</h4>
    if (props.data) {
        const keys = Object.keys(props.data);

        if (keys.length !== 0) {
            content = keys.map((_key) => {
                const v = props.data[_key];
                const { type, fileExt, timestamps, path } = v;

                let titleStr = `\nDate Modified:${new Date(timestamps.created).toDateString()}\nSize: ${bytesToSize(v.size)}\n`;

                return <Link key={_key} className="text-left text-inline my-2 list-group-item-custom list-group-item list-group-item-dark list-group-item-action" title={titleStr} to={encodePath(type , path)}>
                    <h5>
                        <span className={`fas fa-${type === "dir" ? "folder" : determineFileType(fileExt)} mr-3 text-orange`}></span>
                        {_key}
                    </h5>
                </Link>
            });
        }
    }

    return <center>
        <ListGroup id="directory-content-list">
            {content}
        </ListGroup>
    </center>
}

function formatContent(contains) {
    const { file, folder } = contains;
    return `${folder !== 0 ? `${folder} folder${folder > 1 ? "s" : ""}` : ""} ${file !== 0 ? `${file} file${file > 1 ? "s" : ""}` : "Nothing"}`;
}