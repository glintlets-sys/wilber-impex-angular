import { Toy } from "./toy";

export interface ItemRecommendation {
    id?: number; // optional if it's set by the backend
    sourceItemId?: number;
    recommendedItemIds?: number[];
    recommendationType?: string; // or use an enum if you have defined it  - SIMILAR/ALTERNATE PRODUCTS , RELATED PRODUCTS
    item?: Toy;
  }

  export enum RecommendationType {
    Similar = "SIMILAR",
    Related = "RELATED",
  }
