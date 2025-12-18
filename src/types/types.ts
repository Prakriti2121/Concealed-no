type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonArray = JsonValue[];
export type Product = {
  id: number;
  slug: string;
  title: string;
  // Wine Fields
  isNew: boolean;
  availableOnlyOnline: boolean;
  organic: boolean;
  featured: boolean;

  // Product Details
  productCode: string;
  vintage: string;
  price: number;

  // Additional Product Info
  largeImage: string;
  buyLink: string;
  sortiment: string;
  tagLine: string;
  producerDescription: string;
  producerUrl: string;
  region: string;
  taste: string[] | string | JsonArray;
  awards: string;
  additionalInfo: string;

  // Food combinations (booleans)
  vegetables: boolean;
  roastedVegetables: boolean;
  softCheese: boolean;
  hardCheese: boolean;
  starches: boolean;
  fish: boolean;
  richFish: boolean;
  whiteMeatPoultry: boolean;
  lambMeat: boolean;
  porkMeat: boolean;
  redMeatBeef: boolean;
  gameMeat: boolean;
  curedMeat: boolean;
  sweets: boolean;

  // Other Specifications
  bottleVolume: number;
  alcohol: number;
  composition: string;
  closure: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
};
