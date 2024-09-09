"use strict";

// npm install @tryghost/admin-api

// Node.js
// const GhostAdminAPI = require("@tryghost/admin-api");
// const path = require("node:path");

// ES modules
import GhostAdminAPI from 'node:@tryghost/admin-api';
import * as path from "node:path";

const api_url = "http://localhost:2368",
    api_version = "v5.0",
    admin_api_key =  "66816db2df8b677484b260cb:dfb86d18e1352f06dfb989278f0af43ba4e88756f37a15089cc70969d3f0cb33",
    content_api_key = "8822edafa03c01847065770684";

const processHTML = (title, html) => {
    try {
        return processImagesInHTML(html)
            .then(html => {
                return api.posts
                    .add(
                        { title: title, html },
                        { source: "html" } // Tell the API to use HTML as the content source, instead of Lexical
                    )
                    .then(res => console.log(JSON.stringify(res)))
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    } catch (error) {
        console.error(error);
    }
};

// Utility function to find and upload any images in an HTML string
const processImagesInHTML = (html) => {
    try {
        // Find images that Ghost Upload supports
        let imageRegex = /="([^"]*?(?:\.jpg|\.jpeg|\.gif|\.png|\.svg|\.sgvz))"/gmi;
        let imagePromises = [];

        while ((result = imageRegex.exec(html)) !== null) {
            let file = result[1];
            // Upload the image, using the original matched filename as a reference
            imagePromises.push(api.images.upload({
                ref: file,
                file: path.resolve(file)
            }));
        }

        return Promise
            .all(imagePromises)
            .then(images => {
                images.forEach(image => html = html.replace(image.ref, image.url));
                return html;
            });
    } catch (error) {
        console.log(error);
    }
};

const startGhostAdmin = () => {
    try {

        // The url and key values can be obtained by creating a new Custom Integration under the Integrations screen in Ghost Admin.
        const api = new GhostAdminAPI({
            url: api_url, // API domain, must not end in a trailing slash.
            key: admin_api_key, // string copied from the “Integrations” screen in Ghost Admin
            version: api_version, // minimum version of the API your code works with
        });

        api.posts.add({
            title: 'My first draft API post',
            lexical: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hello, beautiful world! 👋","type":"extended-text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
        });

        return {
            html: () => processHTML,
        };

    } catch (error) {

    }
};

// Endpoints [Stability: stable]

// Browsing posts returns Promise([Post...]);
// The resolved array will have a meta property
/*
api.posts.browse();
api.posts.read({id: 'abcd1234'});
api.posts.add({title: 'My first API post'});
api.posts.edit({id: 'abcd1234', title: 'Renamed my post', updated_at: post.updated_at});
api.posts.delete({id: 'abcd1234'});

// Browsing pages returns Promise([Page...])
// The resolved array will have a meta property
api.pages.browse({limit: 2});
api.pages.read({id: 'abcd1234'});
api.pages.add({title: 'My first API page'})
api.pages.edit({id: 'abcd1234', title: 'Renamed my page', updated_at: page.updated_at})
api.pages.delete({id: 'abcd1234'});

// Uploading images returns Promise([Image...])
api.images.upload({file: '/path/to/local/file'});
*/

export {
    startGhostAdmin,
};