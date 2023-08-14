// Filter
export default class Filter {
  attribute: string;
  values: string[];
  operation: string;

  constructor() {
    this.attribute = "";
    this.values = [];
    this.operation = "";
  }
}
