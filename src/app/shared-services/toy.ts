export interface Toy {
  id?: number;
  name?: string;
  hsn?: string;
  code?: string;
  price?: Price;
  brand?: string;
  summary?: string;
  food?: boolean;
  veg?:boolean;
  units?:string;
  photoLinks?: any[];
  videoLinks?: any[];
  brandColor?: string;
  skillSet?: any;
  kidsAge?: any;
  productDescription?: ProductDescription[];
  discount?: Discount | null; // Updated field for discount, can be null
  categories?: number[];
  categoryDetails?: CategoryDetails[];
  thumbnail?: any;
  ageRange?: AgeRange;
  quantity?: number;
  tax?: any;
  // title?: string;
  status?: string
  variations?: Variation[];
  stockType?: StockType;
  notAvailable?: boolean;

  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
  tableData?: string;
  keywords?: string;
  sizeUOM?: string;
  weightUOM?: string;

}
// other fields

export enum StockType {
  Managed,
  Flexible

}

export interface AgeRange {
  from: number;
  to: number;
}

export interface Price {
  amount: number;
  currency: string;

}

export interface CategoryDetails {
  id: number;
  name: string;
}

export interface ProductDescription {
  heading: string;
  text: string;
  pictureUrl?: string;
}

export interface Variation {
  id: number;
  color: string;
  size: string;
}

export interface Discount {
  id: number;
  discountPercent: number;
  version: number;
}
