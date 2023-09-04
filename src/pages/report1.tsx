import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserAgentApplication, AuthError, AuthResponse } from "msal";
import {
  service,
  factories,
  models,
  IEmbedConfiguration,
  Report,
} from "powerbi-client";
import * as config from "../Config";
// import * as onboarding from "../onboarding/ts/onboarding";
import * as global from "../onboarding/ts/globalVariables";
import { Link } from "react-router-dom";
import ParentComponent from "../onboarding/ts/Content/Onboarding Elements/parentComponent";
import ErrorBoundary from "../onboarding/ts/Content/Onboarding Elements/errorBoundary";

import { PowerBIEmbed } from "powerbi-client-react";

const reportClass = "report-container";

export let accessToken = "";
let embedUrl = "";
// let reportContainer: HTMLElement;

interface AppProps {
  isMainPage: boolean;
}

const MyReport: React.FC<AppProps> = ({ isMainPage }) => {
  const [report, setReport] = useState<Report>();
  const [error, setError] = useState<string[]>([]);
  const [currentAccessToken, setCurrentAccessToken] = useState<string>("");
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>("");
  // const reportRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const authenticate = useCallback(() => {
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

    msalInstance.handleRedirectCallback(
      (err?: AuthError, response?: AuthResponse) => {
        if (err) {
          setError([err.toString()]);
          return;
        }

        if (!response) {
          setError(["Undefined response"]);
          return;
        }

        if (response.tokenType === "id_token") {
          authenticate();
        } else if (response.tokenType === "access_token") {
          accessToken = response.accessToken;
          setUsername(response.account.name);
          getembedUrl();
        } else {
          setError(["Token type is: " + response.tokenType]);
        }
      }
    );

    if (msalInstance.getAccount()) {
      msalInstance
        .acquireTokenSilent(loginRequest)
        .then((response: AuthResponse) => {
          accessToken = response.accessToken;
          setCurrentAccessToken(accessToken);
          setUsername(response.account.name);
          getembedUrl();
        })
        .catch((err: AuthError) => {
          if (err.name === "InteractionRequiredAuthError") {
            msalInstance.acquireTokenRedirect(loginRequest);
          } else {
            setError([err.toString()]);
          }
        });
    } else {
      msalInstance.loginRedirect(loginRequest);
    }
  }, []);

  useEffect(() => {
    authenticate();
    const powerbi = new service.Service(
      factories.hpmFactory,
      factories.wpmpFactory,
      factories.routerFactory
    );

    setSdkLoaded(true);
    if (report) {
      report.setComponentTitle("Embedded Report");
    }
  }, [authenticate, report]);

  const getembedUrl = () => {
    fetch(
      "https://api.powerbi.com/v1.0/myorg/groups/" +
        config.workspaceId +
        "/reports/" +
        config.reportId,
      {
        headers: {
          Authorization: "Bearer " + currentAccessToken,
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
              setCurrentAccessToken(accessToken);
              setCurrentEmbedUrl(embedUrl);
            } else {
              errorMessage.push(
                "Error " + response.status + ": " + body.error.code
              );

              setError(errorMessage);
            }
          })
          .catch(function () {
            errorMessage.push(
              "Error " + response.status + ":  An error has occurred"
            );

            setError(errorMessage);
          });
      })
      .catch(function (error) {
        setError(error);
      });
  };

  const setUsername = (username: string) => {
    const welcome = document.getElementById("welcome");
    if (welcome) welcome.innerText = `Welcome, ${username}`;
  };

  return (
    <>
      {sdkLoaded && currentEmbedUrl && currentAccessToken ? (
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: config.reportId,
            embedUrl: currentEmbedUrl,
            accessToken: currentAccessToken,
            permissions: models.Permissions.All,
            tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false,
                },
              },
              background: models.BackgroundType.Transparent,
            },
          }}
          eventHandlers={
            new Map([
              [
                "loaded",
                function () {
                  console.log("Report loaded");
                },
              ],
              [
                "rendered",
                function () {
                  console.log("Report rendered");
                },
              ],
              [
                "error",
                function (event) {
                  console.log(event?.detail);
                },
              ],
              ["visualClicked", () => console.log("visual clicked")],
              ["pageChanged", (event) => console.log(event)],
            ])
          }
          cssClassName={reportClass}
          getEmbeddedComponent={(embeddedReport) => {
            debugger;
            setReport(embeddedReport as Report);
          }}
        />
      ) : (
        <p> Loading Power BI SDK</p>
      )}
    </>
  );
};

export default MyReport;
