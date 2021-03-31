import React from "react";
import DirectoryView from "../views/DirectoryView";
import { render } from "@testing-library/react";

import data from "../mocks/fh-getData.json";

let mockedData;

beforeEach(()=>{
    mockedData = {
        key   : "Vånner",
        value : data.content["Vånner"]
    };
});

let setup  = ()=>{
    return render(<DirectoryView data={mockedData}/>);
}

test("Render details panel" , ()=>{
    setup();

    const { key } = mockedData;

    const details = document.querySelector(".details");

    expect(details.getElementsByTagName("h5").item(0).textContent).toEqual(key);

    expect(details.getElementsByTagName("h6").length).toEqual(2);

    expect(details.getElementsByTagName("button").item(0)).toBeDefined();
});

test("Render content panel" , ()=>{
    setup();

    const { value } = mockedData;
    
    let contents = document.querySelector("#directory-content-list");

    expect(contents).toBeDefined();

    expect(contents.getElementsByTagName("button").length).toEqual(Object.keys(value.content).length);
});