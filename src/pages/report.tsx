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
import { Link } from "react-router-dom";
import ParentComponent from "../onboarding/ts/Content/Onboarding Elements/parentComponent";
const powerbi = new service.Service(
  factories.hpmFactory,
  factories.wpmpFactory,
  factories.routerFactory
);

export let accessToken = "";
let embedUrl = "";
let reportContainer: HTMLElement;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps {
  isMainPage: boolean;
}
interface AppState {
  accessToken: string;
  embedUrl: string;
  error: string[];
  reportRef: RefObject<any>;
}

export default class MyReport extends React.Component<AppProps, AppState> {
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

  async componentDidMount(): Promise<void> {
    const isMainPage = this.props.isMainPage;
    window.addEventListener("resize", () =>
      onboarding.reloadOnboarding(isMainPage)
    );

    if (this.state.reportRef !== null) {
      reportContainer = this.state.reportRef["current"];
    }

    if (config.workspaceId === "" || config.reportId === "") {
      this.setState({
        error: [
          "Please assign values to workspace Id and report Id in Config.ts file",
        ],
      });
    } else {
      this.authenticate();
    }
  }

  renderMyReport(): Report {
    let report: any | Report = null;
    try {
      if (this.state.error.length) {
        reportContainer.textContent = "";
        this.state.error.forEach((line) => {
          reportContainer.appendChild(document.createTextNode(line));
          reportContainer.appendChild(document.createElement("br"));
        });
        console.log("Error while rendering the report", this.state.error);
      } else if (this.state.accessToken !== "" && this.state.embedUrl !== "") {
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

        report.off("loaded");

        const isMainPage = this.props.isMainPage;
        report.on("loaded", async function () {
          onboarding.onLoadReport(isMainPage);
          global.setIsLoaded(true);
        });

        report.off("rendered");

        report.on("rendered", async function () {
          await onboarding.onReloadReport();
        });

        report.off("dataSelected");

        report.on(
          "dataSelected",
          async function (event: { detail: { dataPoints: any[] } }) {
            await onboarding.onDataSelected(event);
          }
        );

        report.off("error");

        report.on("error", function (event: any) {
          const errorMsg = event.detail;
          console.error(errorMsg);
        });
      }
    } catch (error) {
      console.log("Error while rendering myreport", error);
    }

    return report;
  }

  shouldComponentUpdate(
    nextProps: Readonly<AppProps>,
    nextState: Readonly<AppState>,
    nextContext: any
  ): boolean {
    if (this.state.accessToken == nextState.accessToken) {
      return false;
    }
    return true;
  }

  componentWillUnmount(): void {
    const isMainPage = this.props.isMainPage;
    window.addEventListener("resize", () =>
      onboarding.reloadOnboarding(isMainPage)
    );
    console.log("Reset called");
    powerbi.reset(reportContainer);
  }

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

    if (msalInstance.getAccount()) {
      msalInstance
        .acquireTokenSilent(loginRequest)
        .then((response: AuthResponse) => {
          accessToken = response.accessToken;
          this.setUsername(response.account.name);
          this.getembedUrl();
        })
        .catch((err: AuthError) => {
          if (err.name === "InteractionRequiredAuthError") {
            msalInstance.acquireTokenRedirect(loginRequest);
          } else {
            thisObj.setState({ error: [err.toString()] });
          }
        });
    } else {
      msalInstance.loginRedirect(loginRequest);
    }
  }

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
            if (response.ok) {
              embedUrl = body["embedUrl"];
              thisObj.setState({
                accessToken: accessToken,
                embedUrl: embedUrl,
              });
            } else {
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
        thisObj.setState({ error: error });
      });
  }

  setUsername(username: string): void {
    const welcome = document.getElementById("welcome");
    if (welcome !== null) welcome.innerText = "Welcome, " + username;
  }

  render(): JSX.Element {
    this.myReport = this.renderMyReport();
    return (
      <>
        <div id="embed-container" ref={this.state.reportRef}>
          {" "}
          Loading the report...
        </div>
        <div>
          {/* {this.myReport && (
            <ParentComponent report={this.myReport}></ParentComponent>
          )} */}
        </div>
      </>
    );
  }
}
