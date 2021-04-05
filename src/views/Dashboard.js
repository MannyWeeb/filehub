import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import request from "request";

import { APISERVER } from "../App";
import { bytesToSize } from "../utils";

export default function Dashboard() {
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        request.get(`${APISERVER}/getServerInfo`, {}, (err, res, body) => {
            if (err) {
                setError("Failed to fetch Server Info!");
            } else {
                console.log(body);
                setInfo(JSON.parse(body));
            }
        });
    }, []);


    let content = <center>
        <h3>Loading Dashboard...</h3>
    </center>

    if (info) {
        const [host, interfaces] = Object.values(info);

        let roundedSize = bytesToSize(host.mem);
        const temp = roundedSize.split(/\s/g);
        roundedSize = `${Math.round(Number(temp[0]))} ${temp[1]}`;

        content = <>
            <Row>
                <Col className="text-center">
                    <h3 className="mb-0">{host.name}</h3>
                    <p className="border-bottom border-orange pb-2">host machine</p>
                </Col>
            </Row>

            <Row>
                <Col className="text-center">
                    <p>This page should help you out if you're having trouble with figuring out your address or your currently used network interfaces.</p>
                    <br />
                    <br />
                </Col>
            </Row>

            <Row>
                <Col className="border-left border-orange noteblock pl-4 pr-0 mx-4" xl={5} lg={5}>
                    <h4>Host Information</h4>
                    <p>Core information about the host's system specifications</p>
                    <br />
                    <h5 className="codeblock mr-4"><span className="fas fa-microchip text-orange mr-2"></span>{host.cpu}</h5>
                    <h5 className="codeblock mr-4"><span className="fas fa-memory text-orange mr-2"></span>{roundedSize}</h5>
                </Col>

                <br />
                <br />
                <br />

                <Col className="border-left border-orange noteblock pl-4 pr-0 mx-4" xl={6} lg={5}>
                    <h4>Network Interfaces (Excluding loopbacks)</h4>
                    <p>These are the interfaces on which FileHub is being broadcasted on.</p>
                    <br />
                    {interfaces.map((v)=>{
                        return <h5 key={v.name} className="codeblock mr-4">{v.name}: {v.address}</h5>
                    })}
                </Col>
            </Row>
        </>
    } else if (error) {
        content = <center>
            <h3 className="alert alert-danger">{error}</h3>
        </center>
    }

    return <Container className="py-4">
        {content}
    </Container>
}