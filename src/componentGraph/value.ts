import Component from "./Component";

class Value extends Component {
  constructor() {
    super();
  }

  setValueData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }

  getComponentDescriptionData(): string {
    return "This visual displays the values of " + this.attribute + ".";
  }
}

export default Value;
