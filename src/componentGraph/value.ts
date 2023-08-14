import CommonProp from "./CommonProp";

class Value extends CommonProp {
  constructor() {
    super();
  }

  setValueData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }
}

export default Value;
