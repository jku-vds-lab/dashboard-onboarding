import CommonProp from "./CommonProp";

class Legend extends CommonProp {
  constructor() {
    super();
  }

  setLegendData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }
}

export default Legend;
