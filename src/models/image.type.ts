export type ImageType = {
  id: string;
    urls: {
        regular: string;
        small: string;
        thumb: string;
    },
    description?: string;
    alt_description?: string;
}

export interface Product extends ImageType {
   name: string;
  price: number;
}