import { page } from "./ComponentGraph";
import Filter from "./Filter";
import { getOperation, getPageFilters } from "./helperFunctions";
export default class GlobalFilter {
  id: string;
  description: string;
  task: string;
  mark: string;
  filters: Filter[];

  constructor() {
    this.id = "";
    this.description = "";
    this.task = "";
    this.mark = "";
    this.filters = [];
  }

  async getGlobalFilter(): Promise<GlobalFilter> {
    this.id = "globaFilter";
    this.task = "discover, derive and explore";
    this.description = "Here you can see the global filters of this dashboard. When setting one filter the whole report gets filtered by the set value.";
    this.mark = "Value";

    const pageFilters = await getPageFilters(page);
    for (const pageFilter of pageFilters) {
      const filter = new Filter();
      filter.attribute = <string>pageFilter?.attribute;
      filter.values = <string[]>pageFilter?.values;
      filter.operation = getOperation(<string>pageFilter?.operator);

      this.filters.push(filter);
    }
    return this;
  }
}
