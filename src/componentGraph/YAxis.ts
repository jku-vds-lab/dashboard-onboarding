import CommonProp from "./CommonProp";

class YAxis extends CommonProp {
  constructor() {
    super();
  }

  setYAxisData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }
}

export default YAxis;
