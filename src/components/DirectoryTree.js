/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Nav } from "react-bootstrap";
import _ from "lodash";

import { determineFileType } from "../utils";

function Tree(props) {
    let branches = "";

    if (props.data) {
        branches = <>
            <h4 className="pointable ml-4" data-toggle="collapse" href="#root" id="root-link">
                <span className="fas fa-bookmark text-orange"></span>
                Root
            </h4>
            <div className="collapse ml-4" id="root">
                {renderBranch(props.data.content, props.onItemSelect , 1)}
            </div>
        </>
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

function renderBranch(props, onItemSelect , depth) {
    return Object.keys(props).map((val) => {
        const { type, path } = props[val];
        const _id = _.uniqueId("tree_");

        if (type === "dir") {
            return <div style={{ textIndent: `${depth}em` }} key={path}>
                <h5 className="pointable text-left " data-toggle="collapse" href={`#div-${_id}`} onClick={() => {onItemSelect({ key: val, value: props[val] }) }}>
                    <span className="fas fa-folder text-orange"></span> {val}
                </h5>

                <div className="collapse" id={`div-${_id}`}>
                    {renderBranch(props[val].content, onItemSelect, depth + 1)}
                </div>
            </div>
        } else {
            const { fileExt } = props[val];

            let fileType = determineFileType(fileExt);

            return <h5 style={{ textIndent: `${depth}em` }} className="pointable" key={path} onClick={() => { onItemSelect({ key: val, value: props[val] }) }}>
                <span className={`fas fa-${fileType} text-orange`} ></span>
                {val}
            </h5>
        }
    });
}

export default Tree;