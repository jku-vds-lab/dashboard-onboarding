import CommonProp from "./CommonProp";

class XAxis extends CommonProp {
  constructor() {
    super();
  }

  setXAxisData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }
}

export default XAxis;
