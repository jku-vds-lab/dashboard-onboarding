export default interface BasicTextFormat {
  generalImages: Array<string>;
  generalInfos: Array<string>;
  insightImages: Array<string>;
  insightInfos: Array<string>;
  interactionImages: Array<string>;
  interactionInfos: Array<string>;
}

export enum UserLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
}
