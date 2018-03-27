import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MatTableDataSource, MatSort, MatTab} from '@angular/material';

import { Product } from '../shared/product';



@Injectable()
export class ProductsService {
  public productsDataSource;
  public costSum: number = 0;

  // change variables according to your specific api
  public url = 'http://localhost:2403/shopping-list/'
  public productNameIdentifier = 'productName';
  public costIdentifier = 'cost';
  public doneIdentifier = 'done';

  public sort: MatSort;

  constructor(private http: HttpClient) { 
    this.getProducts().then((data: Product[]) => {
      this.productsDataSource = new MatTableDataSource(data);
      this.productsDataSource.sort = this.sort;
      data.map(product => { this.costSum += product.cost });
    });
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

  addProduct(newProduct: Product) {
    this.productsDataSource.data.push(newProduct);
    this.productsDataSource = new MatTableDataSource(this.productsDataSource.data);
    this.productsDataSource.sort = this.sort;
    this.costSum += newProduct.cost;
    this.http.post(this.url, newProduct)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }
}
