/* eslint-disable react-hooks/exhaustive-deps */
import React, { createRef, useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Row } from "react-bootstrap";

import { bytesToSize, determineFileType } from "../utils/helpers";
import { getThumbs, getMetadata } from "../utils/net";
import { STATICSERVER } from "../App";

export default function FileView(props) {
    const [metadata, setMetadata] = useState({ success: false, error: null, data: null });
    const [thumb, setThumb] = useState({ success: false, error: null, data: null });


    useEffect(() => {
        if (props.data) {
            const { value } = props.data;

            let lookupThumbs = () => {
                getThumbs(value.path)
                    .catch(props.onServerError)
                    .then((thumbnail) => {
                        setThumb(thumbnail);
                        props.onServerReconnect();
                    });
            }

            let fetchMetadata = () => {
                getMetadata(value.path)
                    .catch(props.onServerError)
                    .then((metadata) => {
                        setMetadata(metadata);
                        props.onServerReconnect();
                    });
            }

            if (value.type === "file") {
                switch (determineFileType(value.fileExt)) {
                    case "video":
                        fetchMetadata();
                        break;

                    case "music":
                        fetchMetadata();
                        lookupThumbs();
                        break;

                    default: break;
                }
            }
        }
    }, [props]);

    return props.data && props.data.value.type === "file" ? <ActionCard info={{ metadata, thumbnail: thumb }} data={props.data.value} /> : "";
}

function ActionCard(props) {
    const [playing, setPlaying] = useState(false);
    const player = createRef();
    const { info, data } = props;
    const fileType = determineFileType(data.fileExt);


    useEffect(() => {
        let listeners = {
            onpause : () => { document.title = "FileHub"; },
            onplay  : () => { document.title = data.fileName; },
            onerror : (err) => { console.log("Error ", err);}
        }

        if (player.current) {
            for(const l of Object.keys(listeners)){
                player.current[l] = listeners[l]; 
            }
        }

        return () => {
            setPlaying(false);
            if(player.current){
                for(const l of Object.keys(listeners)){
                    player.current[l] = undefined;
                }
            }
        }
    }, [props]);

    const contentSrc = `${STATICSERVER}/content/${data.path}`;
    let header = "";

    if (info.metadata) {

        let fileDetails = "";
        let fileActions = "";
        let fileChildren = "";
        switch (fileType) {
            case "music":
                let metadataContent = "";

                if (info.metadata.success) {
                    let temp = info.metadata.data;
                    metadataContent = <>
                        <h5>{temp.album ? `Album: ${temp.album}` : ""}</h5>
                        <h5>{temp.artist ? `Artist: ${temp.artist}` : ""}</h5>
                        <h5>{temp.genre ? `Genre: ${temp.genre}` : ""}</h5>
                    </>
                }

                header = <center className="span-content">
                    {info.thumbnail.success ? <img className="span-height" src={`${STATICSERVER}/content/${info.thumbnail.data || ""}`} alt="thumbnail"></img> : info.thumbnail.error ? <h2>No image available</h2> : <h2>Fetching  thumbnail...</h2>}
                </center>

                fileDetails = <>
                    <Card.Title>
                        <h3>{data.fileName}</h3>
                        <h4>{new Date(data.timestamps.created).toDateString()}</h4>
                    </Card.Title>

                    <h5>Audio Format: {data.fileExt.toUpperCase()}</h5>
                    {metadataContent}
                </>

                fileActions = <>
                    <ButtonGroup xl={6} lg={6} md={12}>
                        <Button size="sm" variant="secondary" onClick={() => {
                            let _p = player.current;

                            playing ? _p.pause() : _p.play();

                            setPlaying(!playing)
                        }}>
                            <span className="fas fa-headphones mx-2"></span>
                            {playing ? "Pause" : "Preview"}
                        </Button>
                        <a className="btn btn-sm btn-primary mx-1" variant="primary" href={contentSrc} download>
                            <span className="fas fa-download mx-2"></span>
                                Save ({bytesToSize(data.size)})
                        </a>
                    </ButtonGroup>
                </>

                fileChildren = <>
                    <audio title={data.fileName} ref={player} id="preview-audio">
                        <source src={contentSrc}></source>
                        Sorry! Your browser does not support audio tags.
                    </audio>
                </>
                break;

            case "video":
                header = <video ref={player} className="span-content" id="preview-video" controlsList="nodownload" controls>
                    <source src={contentSrc}></source>
                        Sorry! Your browser does not support video tags.
                    </video>

                fileDetails = <>
                    <Card.Title>
                        <h3>
                            {data.fileName}
                        </h3>
                        <h4>{new Date(data.timestamps.created).toDateString()}</h4>
                        <h5>Video Format: {data.fileExt.toUpperCase()}</h5>
                    </Card.Title>
                </>

                fileActions = <>
                    <ButtonGroup>
                        <Button variant="secondary" title="No modules available" disabled>
                            <span className="fas fa-clipboard mr-1"></span>
                            Get Stream URL
                        </Button>
                        <a className="btn btn-primary mx-1" variant="primary" href={contentSrc} download>
                            <span className="fas fa-download mr-1"></span>
                            Save ({bytesToSize(data.size)})
                        </a>
                    </ButtonGroup>
                </>
                break;

            case "image":
                header = <center className="span-content">
                    <img className="span-height" id="preview-img" src={contentSrc} alt="thumbnail"></img>
                </center>

                fileDetails = <>
                    <Card.Title>
                        <h3>{data.fileName}</h3>
                        <h4>{new Date(data.timestamps.created).toDateString()}</h4>
                        <h5>Image Format: {data.fileExt.toUpperCase()}</h5>
                    </Card.Title>
                </>

                fileActions = <>
                    <ButtonGroup>
                        <a className="btn btn-primary" variant="primary" href={contentSrc} download>
                            <span className="fas fa-download mr-1"></span>
                            Save ({bytesToSize(data.size)})
                        </a>
                    </ButtonGroup>
                </>
                break;

            //Should be named document, but fa lib does not have any icon for it.
            case "book":
                header = <center className="span-content">
                    <embed className="span-height" id="preview-document" src={contentSrc}></embed>
                </center>

                fileDetails = <>
                    <Card.Title>
                        <h3>{data.fileName}</h3>
                        <h4>{new Date(data.timestamps.created).toDateString()}</h4>
                        <h5>Document Format: {data.fileExt.toUpperCase()}</h5>
                    </Card.Title>
                </>

                fileActions = <>
                    <ButtonGroup>
                        <a className="btn btn-primary" variant="primary" href={contentSrc} download>
                            <span className="fas fa-download mr-1"></span>
                            Save ({bytesToSize(data.size)})
                        </a>
                    </ButtonGroup>
                </>
                break;

            case "archive":
                header = <center className="span-content pt-5">
                    <span className="fas fa-archive text-orange" id="preview-archive"></span>
                    <br />
                    <h3 className="text-center mt-4">Filehub does not have any built-in support for viewing compressed files.</h3>
                </center>

                fileDetails = <>
                    <Card.Title>
                        <h3>{data.fileName}</h3>
                        <h4>{new Date(data.timestamps.created).toDateString()}</h4>
                        <h5>Compression Format: {data.fileExt.toUpperCase()}</h5>
                    </Card.Title>
                </>

                fileActions = <>
                    <ButtonGroup>
                        <a className="btn btn-primary" variant="primary" href={contentSrc} download>
                            <span className="fas fa-download mr-1"></span>
                            Save ({bytesToSize(data.size)})
                        </a>
                    </ButtonGroup>
                </>
                break;

            case null:
                break;

            case undefined:
                break;

            default:
                header = <center className="span-content pt-5">
                    <span className="fas fa-file text-orange" id="preview-archive"></span>
                    <br />
                    <h3 className="text-center mt-4">Filehub does not recognize this type of file, please save it instead</h3>
                </center>

                fileDetails = <>
                    <Card.Title>
                        <h3>{data.fileName}</h3>
                        <h4>{new Date(data.timestamps.created).toDateString()}</h4>
                        <h5>File Extension: {data.fileExt.toUpperCase()}</h5>
                    </Card.Title>
                </>

                fileActions = <>
                    <ButtonGroup>
                        <a className="btn btn-primary" variant="primary" href={contentSrc} download>
                            <span className="fas fa-download mr-1"></span>
                            Save ({bytesToSize(data.size)})
                        </a>
                    </ButtonGroup>
                </>
                break;
        }

        return <Card key={data.fileName} className="action-card span-content" id="file-card" bg="dark" text="light">
            <Card.Header>
                {header}
            </Card.Header>
            <Card.Footer>
                <Container fluid>
                    <Row>
                        <Col className="px-0 py-1" xl={6} lg={6} md={12}>
                            {fileDetails}
                        </Col>
                        <Col className="px-0 py-3" xl={6} lg={6} md={12}>
                            {fileActions}
                        </Col>
                    </Row>
                    {fileChildren}
                </Container>
            </Card.Footer>
        </Card>
    }else{
        return <></>
    }
}
