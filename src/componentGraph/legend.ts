import Component from "./component";

class Legend extends Component{
  
    constructor() {
        super();
    }

    setLegendData(value: string, isVisible: boolean){
        super.setComponentData(value, isVisible);
    }

    getComponentDescriptionData(): string {
        return "This legend displays the values of " + this.attribute + ".";
    }
  }
  
  export default Legend;
