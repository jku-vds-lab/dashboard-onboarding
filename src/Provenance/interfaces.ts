export interface IVisState {
    [key: string]: number[] | string[];
  }
  
  export interface IAppState {
    [key: string]: {
      type: string;
      categoryMapper: { [key: string]: string };
      selected: {
        [key: string]: string[];
      } | null;
      visState: IVisState;
    };
  }