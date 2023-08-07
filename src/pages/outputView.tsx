// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

import React, { RefObject } from "react";
import { UserAgentApplication, AuthError, AuthResponse } from "msal";
import {
  service,
  factories,
  models,
  IEmbedConfiguration,
  Report,
} from "powerbi-client";
import * as config from "../Config";
import * as onboarding from "../onboarding/ts/onboarding";
import * as global from "../onboarding/ts/globalVariables";
import { provectories } from "../Provenance/Provectories";
import { Link } from "react-router-dom";
import "../UI/assets/css/dashboard.scss";
const powerbi = new service.Service(
  factories.hpmFactory,
  factories.wpmpFactory,
  factories.routerFactory
);

export let accessToken = "";
let embedUrl = "";
let reportContainer: HTMLElement;
// let reportRef: React.Ref<HTMLDivElement>;
// let isReportLoaded = false; // Flag to track initial report load

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps {}
interface AppState {
  accessToken: string;
  embedUrl: string;
  error: string[];
  reportRef: RefObject<any>;
}

class OutputView extends React.Component<AppProps, AppState> {
  private myReport: any | Report;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      accessToken: "",
      embedUrl: "",
      error: [],
      reportRef: React.createRef(),
    };
    this.myReport = null;
  }

  // React function
  render(): JSX.Element {
    this.myReport = this.renderMyReport();
    return (
      <div className="container-fluid" id="flexContainer">
        <div className="row" id="onboarding-header"></div>
        <div className="row">
          <div className="col-10" id="reportContainer">
            <div id="embed-container" ref={this.state.reportRef}>
              {" "}
              Loading the report...
            </div>
          </div>
          <div className="col-2" id="provDiv" hidden></div>
        </div>
      </div>
    );
  }

  // React function
  async componentDidMount(): Promise<void> {
    window.addEventListener("resize", onboarding.reloadOnboarding);

    if (this.state.reportRef !== null) {
      reportContainer = this.state.reportRef["current"];
    }

    // User input - null check
    if (config.workspaceId === "" || config.reportId === "") {
      this.setState({
        error: [
          "Please assign values to workspace Id and report Id in Config.ts file",
        ],
      });
    } else {
      // Authenticate the user and generate the access token
      this.authenticate();
    }
  }

  renderMyReport(): Report {
    // console.log("Render Report");
    let report: any | Report = null;

    if (this.state.error.length) {
      // console.log("if error");
      // Cleaning the report container contents and rendering the error message in multiple lines
      reportContainer.textContent = "";
      this.state.error.forEach((line) => {
        reportContainer.appendChild(document.createTextNode(line));
        reportContainer.appendChild(document.createElement("br"));
      });
      console.log("Error", this.state.error);
    } else if (this.state.accessToken !== "" && this.state.embedUrl !== "") {
      // comment this condition
      // console.log("else if");
      const embedConfiguration: IEmbedConfiguration = {
        type: "report",
        tokenType: models.TokenType.Aad,
        accessToken,
        embedUrl,
        permissions: models.Permissions.All,
        id: config.reportId,
        settings: {
          visualRenderedEvents: true,
          panes: {
            filters: {
              expanded: true,
              visible: true,
            },
            pageNavigation: {
              visible: true,
            },
          },
        },
      };

      report = powerbi.embed(reportContainer, embedConfiguration) as Report;
      global.setReport(report);

      // Clear any other loaded handler events
      report.off("loaded");

      // Triggers when a content schema is successfully loaded
      report.on("loaded", async function () {
        // if (!isReportLoaded) {
        console.log("--> triggers onload report within the ouptut view");
        global.setIsEditor(true);
        onboarding.onLoadReport();
        global.setIsLoaded(true);
        // isReportLoaded = true;
        // console.log("Provectories report");
        // provectories(report);
        // }
      });

      // Clear any other rendered handler events
      report.off("rendered");

      // Triggers when a content is successfully embedded in UI
      report.on("rendered", async function () {
        await onboarding.onReloadReport();
      });

      // Clear any other dataSelected handler events
      report.off("dataSelected");

      // Triggers when a content is successfully embedded in UI
      report.on(
        "dataSelected",
        async function (event: { detail: { dataPoints: any[] } }) {
          await onboarding.onDataSelected(event);
        }
      );

      // Clear any other error handler event
      report.off("error");

      // Below patch of code is for handling errors that occur during embedding
      report.on("error", function (event: any) {
        const errorMsg = event.detail;

        // Use errorMsg variable to log error in any destination of choice
        console.error(errorMsg);
      });
    }

    return report;
  }

  // React function
  componentWillUnmount(): void {
    window.removeEventListener("resize", onboarding.reloadOnboarding);
    powerbi.reset(reportContainer);
  }

  // Authenticating to get the access token
  authenticate(): void {
    const thisObj = this;

    const msalConfig = {
      auth: {
        clientId: config.clientId,
      },
    };

    const loginRequest = {
      scopes: config.scopes,
    };

    const msalInstance: UserAgentApplication = new UserAgentApplication(
      msalConfig
    );

    function successCallback(response: AuthResponse): void {
      if (response.tokenType === "id_token") {
        thisObj.authenticate();
      } else if (response.tokenType === "access_token") {
        accessToken = response.accessToken;
        thisObj.setUsername(response.account.name);
        thisObj.getembedUrl();
      } else {
        thisObj.setState({ error: ["Token type is: " + response.tokenType] });
      }
    }

    function failCallBack(error: AuthError): void {
      thisObj.setState({ error: ["Redirect error: " + error] });
    }

    msalInstance.handleRedirectCallback(successCallback, failCallBack);

    // check if there is a cached user
    if (msalInstance.getAccount()) {
      // get access token silently from cached id-token
      msalInstance
        .acquireTokenSilent(loginRequest)
        .then((response: AuthResponse) => {
          // get access token from response: response.accessToken
          accessToken = response.accessToken;
          this.setUsername(response.account.name);
          this.getembedUrl();
        })
        .catch((err: AuthError) => {
          // refresh access token silently from cached id-token
          // makes the call to handleredirectcallback
          if (err.name === "InteractionRequiredAuthError") {
            msalInstance.acquireTokenRedirect(loginRequest);
          } else {
            thisObj.setState({ error: [err.toString()] });
          }
        });
    } else {
      // user is not logged in or cached, you will need to log them in to acquire a token
      msalInstance.loginRedirect(loginRequest);
    }
  }

  // Power BI REST API call to get the embed URL of the report
  getembedUrl(): void {
    const thisObj: this = this;

    fetch(
      "https://api.powerbi.com/v1.0/myorg/groups/" +
        config.workspaceId +
        "/reports/" +
        config.reportId,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        method: "GET",
      }
    )
      .then(function (response) {
        const errorMessage: string[] = [];
        errorMessage.push(
          "Error occurred while fetching the embed URL of the report"
        );
        errorMessage.push("Request Id: " + response.headers.get("requestId"));

        response
          .json()
          .then(function (body) {
            // Successful response
            if (response.ok) {
              embedUrl = body["embedUrl"];
              thisObj.setState({
                accessToken: accessToken,
                embedUrl: embedUrl,
              });
            }
            // If error message is available
            else {
              errorMessage.push(
                "Error " + response.status + ": " + body.error.code
              );

              thisObj.setState({ error: errorMessage });
            }
          })
          .catch(function () {
            errorMessage.push(
              "Error " + response.status + ":  An error has occurred"
            );

            thisObj.setState({ error: errorMessage });
          });
      })
      .catch(function (error) {
        // Error in making the API call
        thisObj.setState({ error: error });
      });
  }

  // Show username in the UI
  setUsername(username: string): void {
    const welcome = document.getElementById("welcome");
    if (welcome !== null) welcome.innerText = "Welcome, " + username;
  }
}

export default OutputView;
