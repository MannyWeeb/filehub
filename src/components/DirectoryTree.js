/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import _ from "lodash";

import { determineFileType , encodePath} from "../utils/helpers";

export default function Tree(props) {
    let branches = "";

    if (props.data) {
        const { content , type , path } = props.data;

        branches = <Link to={encodePath(type,  path)}>
            <h4 className="pointable ml-4" data-toggle="collapse" href="#root" id="root-link">
                <span className="fas fa-bookmark text-orange"></span>
                Root
            </h4>
            <div className="collapse ml-4" id="root">
                {renderBranch(content, 1)}
            </div>
        </Link>
    }

    return <Nav className="flex-column custom-dark pt-3 px-0 text-light" id="directory-tree-panel">
        <div className="span-content" id="directory-tree">
            <center className="border-bottom border-light mx-4">
                <h3 className="text-light">
                    File Tree
                    {props.children}
                </h3>
            </center>
            <br />
            {branches}
        </div>
    </Nav>
}

function renderBranch(props, depth) {
    return Object.keys(props).map((val) => {
        const item = props[val];
        const { type } = item;
        const _id = _.uniqueId("tree_");

        let linkprops = {
            "style": { textIndent: `${depth}em` },
        }

        if (type === "dir") {
            linkprops = {
                "data-toggle": "collapse",
                "href": `#div-${_id}`,
            }
            return <div style={{ textIndent: `${depth}em` }} key={val}>
                <LinkItem linkprops={linkprops} value={{ fileName: val, item }} key={val} />

                <div className="collapse" key={`${val}-collapse`} id={`div-${_id}`}>
                    {renderBranch(props[val].content , depth + 1)}
                </div>
            </div>
        }
        
        return <LinkItem linkprops={linkprops} value={{ fileName: val, item }} key={val} />
    });
}

function LinkItem(props) {
    const { linkprops, value } = props;
    const { type, fileExt , path } = value.item;

    return <Link to={encodePath(type,path)}>
        <h5 className="pointable text-left" {...linkprops}>
            <span className={`fas fa-${type === "dir" ? "folder" : determineFileType(fileExt)} text-orange`}></span>
            {value.fileName}
        </h5>
    </Link>
}