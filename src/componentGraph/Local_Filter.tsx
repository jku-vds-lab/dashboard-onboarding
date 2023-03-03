import Filter from "./Filter";
import { getVisualFilters } from "./helperFunctions";

// Local Filter
export default class Local_Filter {
  filters: Filter[];

  constructor() {
    this.filters = [];
  }

  async setLocalFilter(visual: any){
    const localFilters = await getVisualFilters(visual);
    for (const localFilter of localFilters) {
      const filter = new Filter();
      filter.setFilterData(localFilter);
      this.filters.push(filter);
    }
  }
}