export interface BoughtTogether {
  id: number;
  items: BoughtTogetherItem[];
  discountPercent: number;
  creationDate: Date;
}

export interface BoughtTogetherItem {
  id: number;
  itemId: string;
  itemName: string;
  brand: string;
  imageUrl: string;
}