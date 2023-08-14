class CommonProp {
  attribute: string;
  isVisible: boolean;
  type: string;

  constructor() {
    this.attribute = "";
    this.isVisible = true;
    this.type = "";
  }

  async setComponentData(value: string, visible: boolean) {
    this.attribute = value;
    this.isVisible = visible;
  }

  setType(type: string) {
    this.type = type;
  }
}

export default CommonProp;
