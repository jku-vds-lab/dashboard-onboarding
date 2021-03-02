// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------
import fetch from 'node-fetch';
import { resolveModuleName } from 'typescript';

export async function getRequestHeader() {

    // Store authentication token
    let tokenResponse:any;

    // Store the error thrown while getting authentication token
    let errorResponse:string;

    // Get the response from the authentication request
    try {
        tokenResponse = await getPBIAccessToken();
    } catch (err) {
        if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
            errorResponse = err.error_description;
						console.log('Error Response --> ', errorResponse);

        } else {

            // Invalid PowerBI Username provided
            errorResponse = err.toString();
						console.log('Error Response --> ', errorResponse);
        }
        // return {
        //     'status': '401',
        //     'error': errorResponse
        // };
    }

    // Extract AccessToken from the response
		let token:any = '';
		if(tokenResponse) {
			token = tokenResponse.accessToken;
		}
		console.log('Token -->' , token);

    return {
        'Content-Type': "application/json",
        'Authorization': "Bearer ".concat(token)
    };
}


async function getPBIAccessToken() {


    // const body:FormData = {
    //     'grant_type': 'password',
    //     'scope': 'openid',
    //     'resource': 'https://analysis.windows.net/powerbi/api',
    //     'client_id': '{Client ID}',
    //     'username': '{PBI Account Username}',
    //     'password':    '{PBI Account Username}'
    // }

    const body:any = new FormData();
    body.append('grant_type', 'password');
    body.append('scope', 'openid');
    body.append('resource', 'https://analysis.windows.net/powerbi/api');




    const response = await fetch("https://login.microsoftonline.com/common/oauth2/token", {
        method: 'POST',
        body: body
    })

    console.log('Response -->>', response);
    return response;

}



const getAccessToken = async function () {

    // Use ADAL.js for authentication
    let adal = require("adal-node");

    let AuthenticationContext = adal.AuthenticationContext;

    // Create a config variable that store credentials from config.json
    let config: any = '';//require("./config.json");
    console.log('Scope -->', config.scope);


    let authorityUrl = config.authorityUri;

    console.log('Authority URl', authorityUrl);

    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === "masteruser") {
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithUsernamePassword(config.scope, config.pbiUsername, config.pbiPassword, config.clientId, function (err:string, tokenResponse:string) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                        console.log('Error Response from adal --> ', err);

                    }
                    resolve(tokenResponse);
                })
            }
        );

        // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    } else if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
        authorityUrl = authorityUrl.replace("common", config.tenantId);
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithClientCredentials(config.scope, config.clientId, config.clientSecret, function (err:string, tokenResponse:string) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                    }
                    resolve(tokenResponse);
                })
            }
        );
    }
}