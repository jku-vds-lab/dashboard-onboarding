import Component from "./Component";

class XAxis extends Component {
  constructor() {
    super();
  }

  setXAxisData(value: string, isVisible: boolean) {
    super.setComponentData(value, isVisible);
  }

  getComponentDescriptionData(): string {
    return "This X-axis displays the values of " + this.attribute + ".";
  }
}

export default XAxis;
