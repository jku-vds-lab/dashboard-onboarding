import Component from "./component";

class YAxis extends Component{
  
    constructor() {
        super();
    }

    setYAxisData(value: string, isVisible: boolean){
        super.setComponentData(value, isVisible);
    }

    getComponentDescriptionData(): string {
        return "This Y-axis displays the values of " + this.attribute + ".";
    }
  }
  
  export default YAxis;