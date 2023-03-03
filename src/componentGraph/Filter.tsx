// Filter
export default class Filter {
  attribute: string; 
  values: string[];
  operation: string;

  constructor(){
    this.attribute = "";
    this.values = [];
    this.operation = "";
  }

  setFilterData(filter: any){
    this.attribute = filter.attribute;
    this.values = filter.values;
    this.operation = this.getOperation(filter.operator);
  }

  getOperation(originalOperation: string){
    let operation;
    switch(originalOperation){
      case "In":
        operation = "Equal";
        break;
      case "NotIn":
        operation = "Not Equal";
        break;
      default:
        operation = originalOperation;
    }
    return operation;
  }
}