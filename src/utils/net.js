import request from "request";

import { APISERVER } from "../App";

function getThumbs(path) {
    return new Promise((resolve, reject) => {
        request.get(`${APISERVER}/getThumbnail?p=${encodeURIComponent(path)}`, {}, (err, res, body) => {
            if (!err) {
                let thumbnail = {
                    success: (res.statusCode === 200)
                };

                if (thumbnail.success) {
                    thumbnail.data = JSON.parse(body).id;
                } else {
                    thumbnail.data = null;
                    thumbnail.error = JSON.parse(body);
                }
                resolve(thumbnail);
            } else {
                reject("Server unreachable");
            }
        });
    });
}

function getMetadata(path) {
    return new Promise((resolve, reject) => {
        request.get(`${APISERVER}/getMetadata?p=${encodeURIComponent(path)}`, {}, (err, res, body) => {
            if (!err) {
                let metadata = {
                    success: (res.statusCode === 200)
                };

                if (metadata.success) {
                    body = JSON.parse(body);
                    let temp = {};
                    Object.keys(body).forEach((key) => temp[key.toLowerCase()] = body[key])
                    metadata.data = temp;
                } else {
                    metadata.data = null;
                    metadata.error = JSON.parse(body);
                }
                resolve(metadata);
            } else {
                reject("Server Unreachable");
            }
        });
    });
}

export { getMetadata , getThumbs};