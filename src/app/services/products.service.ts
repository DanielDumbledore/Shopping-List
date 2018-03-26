import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MatSort } from '@angular/material';

import { Product } from '../shared/product';

@Injectable()
export class ProductsService {
  public products: Product[];

  // change variables according to your specific api
  private url = 'http://localhost:2403/shopping-list/'
  private productNameIdentifier = 'productName';
  private costIdentifier = 'cost';
  private doneIdentifier = 'done;'

  constructor(private http: HttpClient) { 
  }

  getProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {  
      this.http.get<Product[]>(this.url)
        .toPromise()
        .then(
          res => { // Success
            resolve(res);
          }
        );
    })
  }
}
