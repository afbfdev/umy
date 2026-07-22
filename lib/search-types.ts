export type Suggestion = {
  slug: string;
  name: string;
  tagline: string | null;
  categoryName: string;
  imageUrl: string | null;
  minPriceCents: number | null;
};

export type CategorySuggestion = {
  slug: string;
  name: string;
  productCount: number;
};

export type SuggestResponse = {
  categories: CategorySuggestion[];
  products: Suggestion[];
};
