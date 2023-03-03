class Component {
    attribute: string;
    isVisible: boolean; 
    description: string;
    type: string;
  
    constructor() {
      this.attribute = ""; 
      this.isVisible = true;
      this.description = "";
      this.type = "";
    }

    async setComponentData(value: string, visible: boolean){
        this.attribute = value; 
        this.isVisible = visible;
        this.description = this.getComponentDescriptionData();
    }

    setType(type: string){
      this.type = type;
    }

    getComponentDescriptionData(){
        return "This displays the values of " + this.attribute + ".";
    }
  }

export default Component;