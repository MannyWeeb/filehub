import React, { createContext } from "react";
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap";

import { bytesToSize, determineFileType } from "../utils";

let DirectoryContext;

export default function DirectoryView(props) {
    const { value } = props.data;

    if (value) {
        DirectoryContext = createContext(props.data);
        return <DirectoryContext.Provider value={props.data}>
            <div className="span-content">
                <Row>
                    <Col>
                        <DirectoryDetails />
                    </Col>
                </Row>
                <center><h4>Contents</h4></center>
                <Row>
                    <Col className="span-content">
                        <DirectoryContent data={value.content} onItemSelect={props.onItemSelect} />
                    </Col>
                </Row>
            </div>

        </DirectoryContext.Provider>
    } else {
        return <></>
    }
}

function DirectoryDetails() {
    return <DirectoryContext.Consumer>
        {({ key, value }) => {
            const { size, contains } = value;

            let containsStr = formatContent(contains);
            return <center className="details">
                <span className="fas fa-folder file-type text-orange"></span>
                <h5>{key}</h5>
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

    const keys = Object.keys(props.data);

    if(keys.length !== 0){
        content = keys.map((_key) => {
            const v = props.data[_key];
    
            let titleStr = `\nDate Modified:${new Date(v.timestamps.created).toDateString()}\nSize: ${bytesToSize(v.size)}\n`;
    
            return <ListGroup.Item key={_key} className="text-left text-inline my-2 list-group-item-custom" variant="dark" title={titleStr} onClick={() => props.onItemSelect({ key: _key, value: v })} action>
                <h5>
                    <span className={`fas fa-${v.type === "dir" ? "folder" : determineFileType(v.fileExt)} mr-3 text-orange`}></span>
                    {_key}
                </h5>
            </ListGroup.Item>
        });
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