import { page } from "./ComponentGraph";
import { getVisualTitle } from "./helperFunctions";

// Title
export default class Title {
  text: string;

  constructor() {
    this.text = "";
  }

  setTitle(visual: any) {
    let title = "";
    if (visual == null) {
      title = page.displayName;
    } else {
      title = getVisualTitle(visual);
    }
    this.text = title;
  }
}
