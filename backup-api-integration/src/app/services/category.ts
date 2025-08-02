import KidsAge from "./kids-age";
import { Toy } from "./toy";

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  age?: AgeRange;
  gender?: string[];
  toys?: Toy[]; // Add the toys property to hold the list of toys
  showcaseToys?: Toy[];
  kidsAge?: KidsAge;
  type?: string;
  parentId?: number;
  breadcrumb?: Breadcrumb[]; // Array of breadcrumb objects
}

export interface Breadcrumb {
  id: number;
  name: string;
}

export interface AgeRange {
  from: number;
  to: number;
}


