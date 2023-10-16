// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-inferrable-types */
// Scope of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
// Refer https://aka.ms/PowerBIPermissions for complete list of Power BI scopes
// https://analysis.windows.net/powerbi/api/Report.Read.All
export const scopes: string[] = [
  "https://analysis.windows.net/powerbi/api/Report.Read.All",
];
// Client Id (Application Id) of the AAD app.
export const clientId: string = "ec832b7b-04b3-4b8e-937b-8422c18a6b3d";
// Id of the workspace where the report is hosted
export const workspaceId: string = "b082a1af-2194-4005-8b56-651885c5a2f1";
// Id of the report to be embedded
export const reportId: string = "6449575b-12bf-4a6d-bf83-705c91e510c9"; //lukas report
//export const reportId: string = "e9113a1c-fdcb-4db8-83a6-524af73a2df2"; //martins report
//export const reportId: string = "12fee473-6c06-4d88-a1cf-a061e2ef9a15"; //new hires report
//export const reportId: string = "d948050c-0401-4cf4-a582-4d54422f1e77"; //market share report
