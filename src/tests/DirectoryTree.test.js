import React from "react";
import DirectoryTree from "../components/DirectoryTree";
import { render } from "@testing-library/react";
import {BrowserRouter as Router } from "react-router-dom";

import data from "../mocks/fh-getData.json";

let mockedData;

beforeEach(()=>{
    mockedData = data;
});

function setup(){
    return render(<Router><DirectoryTree data={mockedData}/></Router>)
}

test("Properly renders the directory-tree" , ()=>{
    const { getByText } = setup();

    let _recursiveRead = (content)=>{
        for(const title of Object.keys(content)){
            const v = content[title];
            expect(getByText(title.toString()).textContent).toMatch(title);
            if(v.type === "dir")_recursiveRead(v.content);
        }
    }

    _recursiveRead(mockedData.content);
});

test("Valid sub-items point to a valid collapsible div", ()=>{
    const { getByText } = setup();

    let _recursiveRead = (content)=>{
        for(const title of Object.keys(content)){
            const v = content[title];
            
            const href = getByText(title.toString()).attributes.getNamedItem["href"];

            const isUnlinkedFolder = href ? document.querySelector(href) : false;

            expect(isUnlinkedFolder).toBeFalsy();

            if(v.type === "dir")_recursiveRead(v.content);
        }
    }

    _recursiveRead(mockedData.content);
});

test("No rendered tree on erroneous data", ()=>{
    mockedData = null;
    setup();
    expect(document.querySelector("#root-link")).toBeFalsy();
});