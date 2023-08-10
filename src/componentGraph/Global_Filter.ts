import { page } from "./ComponentGraph";
import Filter from "./Filter";
import { getPageFilters } from "./helperFunctions";

// Global Filter
export default class Global_Filter {
  filters: Filter[];

  constructor() {
    this.filters = [];
  }

  async setGlobalFilter() {
    const globalFilters = await getPageFilters(page);
    for (const globalFilter of globalFilters) {
      const filter = new Filter();
      filter.setFilterData(globalFilter);
      this.filters.push(filter);
    }
  }
}
