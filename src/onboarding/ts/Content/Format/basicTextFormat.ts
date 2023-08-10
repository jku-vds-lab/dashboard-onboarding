export default interface BasicTextFormat {
  generalImages: Array<any>;
  generalInfos: Array<any>;
  insightImages: Array<any>;
  insightInfos: string[];
  interactionImages: Array<any>;
  interactionInfos: Array<any>;
}

export enum UserLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
}
