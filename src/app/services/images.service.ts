import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, map, catchError, of } from 'rxjs';
import { ImageType, Product } from '../../models/image.type';

interface CachedImages {
  timestamp: number;
  data: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private accessKey = '7IpKaArH2QeyyvDse1SlpAkh1R4JzE7T2TIcu-sVRqU';
  private readonly storageKey = 'cachedImages';
  private readonly cacheDurationMs = 2 * 60 * 60 * 1000; // 2 hours

  private categories = [
    'smartphone product isolated',
    'laptop front view',
    'basketball on white background',
    'hardcover book front cover',
    'wireless headphones',
    'dumbbells gym equipment',
    'tablet with stylus',
    'running shoes side view'
  ];

  private imagesSubject = new BehaviorSubject<Product[]>([]);
  images$ = this.imagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): string[] {
    return this.categories;
  }

  getRandomImages(count: number = 6, append: boolean = false): Observable<Product[]> {
  const cachedRaw = localStorage.getItem(this.storageKey);
  const now = Date.now();
  let cached: CachedImages | null = null;

  if (cachedRaw) {
    cached = JSON.parse(cachedRaw);
  }

  const isValid = cached && now - cached.timestamp < this.cacheDurationMs;

  if (!append && isValid) {
    this.imagesSubject.next(cached!.data);
    return of(cached!.data);
  }

  const randomCategories = Array.from({ length: count }, () =>
    this.categories[Math.floor(Math.random() * this.categories.length)]
  );

  const requests = randomCategories.map(category => {
    const params = new HttpParams()
      .set('query', category)
      .set('orientation', 'squarish')
      .set('per_page', 10)
      .set('client_id', this.accessKey);

    return this.http
      .get<{ results: any[] }>('https://api.unsplash.com/search/photos', { params })
      .pipe(
        map(res => {
          const r = res.results;
          const img = r.length ? r[Math.floor(Math.random() * r.length)] : null;
          return img ? {
            id: img.id,
            urls: {
              regular: img.urls.regular,
              small: img.urls.small,
              thumb: img.urls.thumb
            },
            description: img.description || img.alt_description,
          } as ImageType : null;
        }),
        catchError(() =>
          of({
            id: 'local-fallback',
            urls: {
              regular: 'assets/placeholder.jpg',
              small: 'assets/placeholder.jpg',
              thumb: 'assets/placeholder.jpg'
            }
          } as ImageType)
        )
      );
  });

  return forkJoin(requests).pipe(
    map(images => {
      const filtered = images.filter(Boolean) as ImageType[];
      const newProducts = filtered.map(img => this.mapImageToProduct(img));

      // Append or replace logic
      const allProducts = append && cached?.data
        ? [...cached.data, ...newProducts]
        : newProducts;

      this.imagesSubject.next(allProducts);

      const cache: CachedImages = {
        timestamp: now,
        data: allProducts
      };
      localStorage.setItem(this.storageKey, JSON.stringify(cache));

      return newProducts; // return only newly fetched items
    })
  );
}


  getImageById(id: string): Observable<Product | undefined> {
    return this.images$.pipe(
      map(images => images.find(img => img.id === id))
    );
  }

  mapImageToProduct(image: ImageType): Product {
    const category = this.extractCategoryFromImage(image);
    return {
      ...image,
      name: this.generateProductName(category),
      price: this.generateRandomPrice(category),
    };
  }

  private extractCategoryFromImage(image: ImageType): string {
    const categories = this.getCategories();
    return categories[Math.floor(Math.random() * categories.length)].split(' ')[0];
  }

  private generateProductName(category: string): string {
    const adjectives = ['Ultra', 'Pro', 'Advanced', 'Classic', 'Premium', 'Eco', 'Limited'];
    const types = ['Model', 'Edition', 'Series', 'Version'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adj} ${category.charAt(0).toUpperCase() + category.slice(1)} ${type} ${number}`;
  }

  private generateRandomPrice(category: string): number {
    if (category.includes('book')) return this.randomInt(10, 50);
    if (category.includes('smartphone') || category.includes('laptop') || category.includes('tablet')) return this.randomInt(200, 1200);
    if (category.includes('headphones') || category.includes('dumbbells')) return this.randomInt(20, 200);
    if (category.includes('basketball') || category.includes('running')) return this.randomInt(30, 150);
    return this.randomInt(15, 500);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  clearCache(): void {
    localStorage.removeItem(this.storageKey);
  }
}
