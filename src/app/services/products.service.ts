import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MatTableDataSource, MatSort, MatTab} from '@angular/material';

import { Product } from '../shared/product';


@Injectable()
export class ProductsService {
  public productsDataSource;
  public costSum: number = 0;

  public showDone: boolean = true;

  // change variables according to your specific api
  public url = 'http://localhost:2403/shopping-list/'
  public productNameIdentifier = 'productName';
  public costIdentifier = 'cost';
  public doneIdentifier = 'done';

  public sort: MatSort;

  constructor(private http: HttpClient) { 
    this.getProducts().then((data: Product[]) => {
      this.productsDataSource = new MatTableDataSource(data);
      this.setDataSourceProps();
      data.map(product => { this.costSum += product.cost });      
    });
  }

  setDataSourceProps() {
    this.productsDataSource.sort = this.sort;
    this.productsDataSource.filterPredicate =
          (data, filter: string) => data.done == parseInt(filter);
    this.productsDataSource.filter = this.showDone ? "" : "0";
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
    this.setDataSourceProps();
    
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

  switchDone(product): number {
    // if 0 -> 1 - 0 = 1; if 1 -> 1 - 1 = 0
    return 1 - product.done 
  }

  putDataToServer(oldProduct) {
    if (!oldProduct.id) {
      this.http.get(this.url, { params: new HttpParams().set("productName", oldProduct.productName) } )
        .subscribe(
          res => {
            this.http.put(this.url + res[0].id, oldProduct)
              .subscribe(
                res => {
                  console.log(res);
                },
                err => {
                  console.log("Error occured");
                }
              );
          },
          err => {
            console.log("Error occured");
          }
        );
    } else {
      this.http.put(this.url + oldProduct.id, oldProduct)
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

  updateDone(oldProduct) {
    oldProduct.done = this.switchDone(oldProduct);
    this.putDataToServer(oldProduct);

    if (!this.showDone) {
      this.productsDataSource = new MatTableDataSource(this.productsDataSource.data);
      this.setDataSourceProps();  
    }
  }

  toggleFilter() {
    this.showDone = !this.showDone;
    this.productsDataSource.filter = this.showDone ? "" : "0";
  }

  containsProduct(productName: string): boolean {
    var contains: boolean = false;
    this.productsDataSource.data.map(product => {
      if (productName === product.productName) {
        contains = true;
      }
    });
    return contains;
  }
}
