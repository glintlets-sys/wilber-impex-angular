import { Toy } from "./toy";


export interface CategoryToy {
    category: Category;
    toys: Toy[];
  }


  //TODO Review this interface adn ues the one at the category.ts
  export interface Category {
    id: number;
    name: string;
    image: string;
    description: string;
    age: AgeRange;
    gender: string[];
    title?: string;
  }
  
  export interface AgeRange {
    from: number;
    to: number;
  }