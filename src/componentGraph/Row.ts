import CommonProp from "./CommonProp";

class Row extends CommonProp {
  constructor() {
    super();
  }

  setValueData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }
}

export default Row;
