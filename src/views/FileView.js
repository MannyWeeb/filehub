import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Row } from "react-bootstrap";
import request from "request";

import { bytesToSize, determineFileType } from "../utils";
import { APISERVER, STATICSERVER } from "../App";

export default function FileView(props) {
    const [info, setInfo] = useState({
        metadata: { success: false, error: null, data: null },
        thumbnail: { success: false, error: null, data: null }
    });

    const [widgets, setWidgets] = useState({
        audio: { paused: true }
    });

    const audioPlayer = useRef();

    const data = props.data.value;

    let handleAudioPreview = () => {
        let audio = widgets.audio;
        audio.paused = !audio.paused;
        audioPlayer.current[audio.paused ? "pause" : "play"]();

        setWidgets({
            ...widgets,
            audio
        });
    }

    useEffect(() => {
        let lookupThumbnail = () => {
            request.get(`${APISERVER}/getThumbnail?p=${encodeURI(data.path).replace("&", "%26")}`, {}, (err, res, body) => {
                if (!err) {
                    let thumbnail = info.thumbnail;

                    thumbnail.success = res.statusCode === 200;

                    if (thumbnail.success) {
                        thumbnail.data = JSON.parse(body).id;
                    } else {
                        thumbnail.data = null;
                        thumbnail.error = JSON.parse(body);
                    }
                    props.onServerReconnect();
                    setInfo({
                        ...info,
                        thumbnail
                    })
                } else {
                    this.props.onServerError("Server Unreachable");
                }
            });
        }

        let fetchData = () => {
            request.get(`${APISERVER}/getMetadata?p=${encodeURI(data.path).replace("&", "%26")}`, {}, (err, res, body) => {
                if (!err) {
                    let metadata = info.metadata;

                    metadata.success = res.statusCode === 200;

                    if (metadata.success) {
                        let temp = JSON.parse(body);

                        for (const key of Object.keys(temp)) {
                            temp[key.toLowerCase()] = temp[key];
                        }

                        metadata.data = temp;
                    } else {
                        metadata.data = null;
                        metadata.error = JSON.parse(body);
                    }
                    props.onServerReconnect();

                    setInfo({
                        ...info,
                        metadata
                    })
                } else {
                    props.onServerError("Server Unreachable");
                }
            });
        }
        switch (determineFileType(data.fileExt)) {

            case "video": fetchData(); break;

            case "music": {
                fetchData();
                lookupThumbnail();

                let player = document.getElementById("preview-audio");

                player.onended = () => {
                    setWidgets({
                        ...widgets,
                        paused: true
                    });
                }
            } break;

            default: break;
        }

        return () => {
            setWidgets({
                ...widgets,
                audio: {
                    paused: true
                }
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    function renderActionCard() {

        const contentSrc = `${STATICSERVER}/content/${data.path}`;

        let HEADER;

        if (info.metadata) {
            const fileType = determineFileType(data.fileExt);

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

                    HEADER = <center className="span-content">
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
                        <ButtonGroup  xl={6} lg={6} md={12}>
                            <Button size="sm" variant="secondary" onClick={handleAudioPreview} >
                                <span className="fas fa-headphones mx-2"></span>
                                {widgets.audio.paused ? "Preview" : "Pause"}
                            </Button>
                            <a className="btn btn-sm btn-primary mx-1" variant="primary" href={contentSrc} download>
                                <span className="fas fa-download mx-2"></span>
                                    Save ({bytesToSize(data.size)})
                            </a>
                        </ButtonGroup>
                    </>

                    fileChildren = <>
                        <audio title={data.fileName} ref={audioPlayer} id="preview-audio">
                            <source src={contentSrc}></source>
                            Sorry! Your browser does not support audio tags.
                        </audio>
                    </>
                    break;

                case "video":

                    HEADER = <video className="span-content" id="preview-video" controlsList="nodownload" controls>
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

                    HEADER = <center className="span-content">
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

                    HEADER = <center className="span-content">
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
                    HEADER = <center className="span-content pt-5">
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

                default:

                    HEADER = <center className="span-content pt-5">
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

            }

            return <Card key={data.fileName} className="action-card span-content" id="file-card" bg="dark" text="light">
                <Card.Header>
                    {HEADER}
                </Card.Header>

                <Card.Footer>
                    <CustomCardFooter details={fileDetails} actions={fileActions} children={fileChildren}/>
                </Card.Footer>
            </Card>
        }
    }

    return data ? renderActionCard() : "";
}

function CustomCardFooter(props) {
    return <>
        <Container fluid>
            <Row>
                <Col className="px-0 py-1" xl={6} lg={6} md={12}>
                    {props.details}
                </Col>
                <Col className="px-0" xl={6} lg={6} md={12}>
                    {props.actions}
                </Col>
            </Row>
            {props.children}
        </Container>
    </>
}