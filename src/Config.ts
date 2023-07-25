// Scope of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
// Refer https://aka.ms/PowerBIPermissions for complete list of Power BI scopes
// https://analysis.windows.net/powerbi/api/Report.Read.All
export const scopes: string[] = [
    "https://analysis.windows.net/powerbi/api/Report.Read.All",
  ];
  
  // Client Id (Application Id) of the AAD app.
  export const clientId: string = "cea66be1-b110-445b-b35d-42a235f4b8ad";
  
  // Id of the workspace where the report is hosted
  export const workspaceId: string = "f592345b-b627-465c-b4c3-63f0c4195303";
  
  // Id of the report to be embedded
  export const reportId: string = "e2cff0cc-5409-48d8-a45b-2a8b8d270890";
  //export const reportId: string = "d948050c-0401-4cf4-a582-4d54422f1e77";