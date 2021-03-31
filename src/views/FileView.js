import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import request from "request";

import { bytesToSize, determineFileType } from "../utils";
import { APISERVER, STATICSERVER } from "../App";

export default class FileView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            info: {
                metadata: {
                    success: false,
                    error: null,
                    data: null
                },
                thumbnail: {
                    success: false,
                    error: null,
                    data: null
                }
            },
            data: this.props.data,
            widgets: {
                audio: {
                    paused: true
                }
            }
        }


    }

    componentDidMount() {
        switch (determineFileType(this.state.data.value.fileExt)) {

            case "video":
                this.fetchData();

                break;

            case "music":
                this.fetchData();
                this.lookupThumbnail();

                let player = document.getElementById("preview-audio");

                player.onended = ()=>{
                    let widgets = this.state.widgets;
                    widgets.audio.paused = true;
                    this.setState({widgets});
                }

                break;

            default: break;
        }
    }

    render() {
        let { data } = this.state || {};

        let content = "";

        if (data) {
            content = this.renderActionCard();
        }

        return content;
    }

    renderActionCard = () => {
        let { info } = this.state;
        let { value } = this.state.data;

        const contentSrc = `${STATICSERVER}/content/${value.path}`;

        let HEADER, FOOTER;

        if (info.metadata) {
            const fileType = determineFileType(value.fileExt);

            //Did it like this for now since I plan to add more functionality on each views later on,
            //Once finalized, it should be wrapped in a cleaner reusable functional component. 
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

                    FOOTER = <>
                        <Card.Title>
                            <h3>
                                {value.fileName}
                                <ButtonGroup>
                                    <Button className="mx-1" variant="secondary" onClick={this.handleAudioPreview} >
                                        <span className="fas fa-headphones mx-2"></span>
                                        {this.state.widgets.audio.paused ? "Preview" : "Pause"}
                                    </Button>
                                    <Button className="mx-1" variant="primary" href={contentSrc} target="_blank">
                                        <span className="fas fa-download mx-2"></span>
                                        Save ({bytesToSize(value.size)})
                                    </Button>
                                </ButtonGroup>
                            </h3>
                            <h4>{new Date(value.timestamps.created).toDateString()}</h4>
                            <h5>Audio Format: {value.fileExt.toUpperCase()}</h5>
                        </Card.Title>
                        {metadataContent}

                        <br />

                        <audio id="preview-audio">
                            <source src={contentSrc}></source>
                            Sorry! Your browser does not support audio tags.
                        </audio>
                    </>
                    break;

                case "video":
                    HEADER = <video className="span-content" id="preview-video" controls>
                        <source src={contentSrc}></source>
                            Sorry! Your browser does not support video tags.
                        </video>

                    FOOTER = <Card.Title>
                        <h3>
                            {value.fileName}
                            <ButtonGroup>
                                <Button className="mx-1" variant="secondary" title="No modules available" disabled>
                                    <span className="fas fa-clipboard mx-2"></span>
                                        Get Stream URL
                                    </Button>
                                <Button className="mx-1" variant="primary" href={contentSrc} target="_blank">
                                    <span className="fas fa-download mx-2"></span>
                                        Save ({bytesToSize(value.size)})
                                    </Button>
                            </ButtonGroup>
                        </h3>
                        <h4>{new Date(value.timestamps.created).toDateString()}</h4>
                        <h5>Video Format: {value.fileExt.toUpperCase()}</h5>
                    </Card.Title>

                    break;

                case "image":

                    HEADER = <center className="span-content">
                        <img className="span-height" id="preview-img" src={contentSrc} alt="thumbnail"></img>
                    </center>

                    FOOTER = <Card.Title>
                        <h3>
                            {value.fileName}
                            <ButtonGroup>
                                <Button variant="primary" href={contentSrc} target="_blank">
                                    <span className="fas fa-download mx-2"></span>
                                        Save ({bytesToSize(value.size)})
                                    </Button>
                            </ButtonGroup>
                        </h3>
                        <h4>{new Date(value.timestamps.created).toDateString()}</h4>
                        <h5>Image Format: {value.fileExt.toUpperCase()}</h5>
                    </Card.Title>
                    break;

                //Should be named document, but fa lib does not have any icon for it.
                case "book":

                    HEADER = <center className="span-content">
                        <embed className="span-height" id="preview-document" src={contentSrc}></embed>
                    </center>

                    FOOTER = <Card.Title>
                        <h3>
                            {value.fileName}
                            <ButtonGroup>
                                <Button variant="primary" href={contentSrc} target="_blank">
                                    <span className="fas fa-download mx-2"></span>
                                        Save ({bytesToSize(value.size)})
                                    </Button>
                            </ButtonGroup>
                        </h3>
                        <h4>{new Date(value.timestamps.created).toDateString()}</h4>
                        <h5>Document Format: {value.fileExt.toUpperCase()}</h5>
                    </Card.Title>

                    break;

                case "archive":
                    HEADER = <center className="span-content pt-5">
                        <span className="fas fa-archive text-orange" id="preview-archive"></span>
                        <br/>
                        <h3 className="text-center mt-4">Filehub does not have any built-in support for viewing compressed files.</h3>  
                    </center>

                    FOOTER = <Card.Title>
                        <h3>
                            {value.fileName}
                            <ButtonGroup>
                                <Button variant="primary" href={contentSrc} target="_blank">
                                    <span className="fas fa-download mx-2"></span>
                                Save ({bytesToSize(value.size)})
                            </Button>
                            </ButtonGroup>
                        </h3>
                        <h4>{new Date(value.timestamps.created).toDateString()}</h4>
                        <h5>Compression Format: {value.fileExt.toUpperCase()}</h5>
                    </Card.Title>

                    break;

                default:
                    HEADER = <center className="span-content pt-5">
                        <span className="fas fa-file text-orange" id="preview-archive"></span>
                        <br/>
                        <h3 className="text-center mt-4">Filehub does not recognize this type of file, please save it instead</h3>  
                    </center>
                    FOOTER = <Card.Title>
                        <h3>
                            {value.fileName}
                            <ButtonGroup>
                                <Button variant="primary" href={contentSrc} target="_blank">
                                    <span className="fas fa-download mx-2"></span>
                            Save ({bytesToSize(value.size)})
                        </Button>
                            </ButtonGroup>
                        </h3>
                        <h4>{new Date(value.timestamps.created).toDateString()}</h4>
                        <h5>File Extension: {value.fileExt.toUpperCase()}</h5>
                    </Card.Title>

            }

            return <Card className="action-card span-content" id="file-card" bg="dark" text="light">
                <Card.Header>
                    {HEADER}
                </Card.Header>

                <Card.Footer>
                    {FOOTER}
                </Card.Footer>
            </Card>
        }
    }

    handleAudioPreview = () => {
        let player = document.getElementById("preview-audio");

        let widgets = this.state.widgets;
        widgets.audio.paused = !widgets.audio.paused;
        player[widgets.audio.paused ? "pause" : "play"]();

        this.setState({ widgets });
    }

    fetchData = () => {
        request.get(`${APISERVER}/getMetadata?p=${encodeURI(this.props.data.value.path).replace("&","%26")}`, {}, (err, res, body) => {
            if (!err) {
                let info = this.state.info;
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
                this.props.onServerReconnect();
                this.setState({ info });
            } else {
                this.props.onServerError("Server Unreachable");
            }
        });
    }

    lookupThumbnail = () => {
        request.get(`${APISERVER}/getThumbnail?p=${encodeURI(this.props.data.value.path).replace("&","%26")}`, {}, (err, res, body) => {
            if (!err) {
                let info = this.state.info;
                let thumbnail = info.thumbnail;

                thumbnail.success = res.statusCode === 200;

                if (thumbnail.success) {
                    thumbnail.data = JSON.parse(body).id;
                } else {
                    thumbnail.data = null;
                    thumbnail.error = JSON.parse(body);
                }
                this.props.onServerReconnect();
                this.setState({ info });
            } else {
                this.props.onServerError("Server Unreachable");
            }
        });
    }
}