import CommonProp from "./CommonProp";

class Column extends CommonProp {
  constructor() {
    super();
  }

  setValueData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }
}

export default Column;
