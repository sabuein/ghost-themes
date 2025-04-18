"use strict";

import { cookieValue } from "utils";

// apiService.mjs
const API_BASE_URL = "/v1/";

/** Utility to get the token from local storage or cookies. */
const getToken = () =>
    localStorage.getItem("jwtAccess") || cookieValue("jwtAccess");

/** Central API call function. */
const apiCall = async (parameters) => {
    const {
        endpoint,
        method = "GET",
        body = null,
        cookies = null,
        token = null,
        external = false,
        headers = { "Content-Type": parameters.output === "json" ? "application/json" : "*" },
        output = "json",
        mode = "cors"
    } = parameters;

    // Attach the token
    if (!!token)
        headers.Authorization = `Bearer ${!!token ? window.atob(token) : getToken()}`;

    const options = { method, headers, mode };

    // Attach the body
    if (!!body) options.body = JSON.stringify(body);

    // Include cookies in the request
    if (!!cookies) options.credentials = "include";

    try {
        const response = await fetch(`${!!external ? endpoint : API_BASE_URL + endpoint}`, options);

        // Handle potential errors
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        // On a 401 Unauthorized response, fetch a new token and retry the request.
        
        // Return the response
        if (!!output && output === "text") return await response.text();
        else if (!!output && output === "image/png") return await response.blob();
        else if (!!output && output === "image/svg+xml") return response.url;
        else return await response.json();

    } catch (error) {
        console.error("Central API call failed: ", error);
        console.log("Endpoint:", endpoint);
    }
};

export default apiCall;