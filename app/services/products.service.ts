import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MatTableDataSource, MatSort, MatTab} from '@angular/material';

import { Product } from '../shared/product';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class ProductsService {
  public productsDataSource;
  public costSum: number = 0;

  public showDone: boolean = true;

  // change variables according to your specific api
  public url = 'http://localhost:3000/einkaufsliste/'
  public productNameIdentifier = 'produkt';
  public costIdentifier = 'kosten';
  public doneIdentifier = 'erledigt';

  public sort: MatSort;

  constructor(private http: HttpClient) { 
    this.getProducts().then((data: Product[]) => {
      this.productsDataSource = new MatTableDataSource(data);
      this.setDataSourceProps();
      data.map(product => { 
        if (product[this.doneIdentifier] != 1)
          this.costSum += product[this.costIdentifier] 
      });      
    });
  }

  setDataSourceProps(): void {
    this.productsDataSource.sort = this.sort;
    this.productsDataSource.filterPredicate =
          (data, filter: string) => data[this.doneIdentifier] == parseInt(filter);
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

  addProduct(newProduct: Product): void {
    let data = this.dataFromProduct(newProduct);

    this.http.post(this.url, data)
      .subscribe(
        res => {
          this.productsDataSource.data.push(res);
          this.updateTable();
          this.costSum += newProduct.cost;
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  switchDone(product: Product): number {
    // if 0 -> 1 - 0 = 1; if 1 -> 1 - 1 = 0
    return 1 - product[this.doneIdentifier];
  }

  async getIdOfProduct(productName: string): Promise<string> { 
    return new Promise<string>((resolve, reject) => {
      this.http.get(this.url, { params: new HttpParams().set(this.productNameIdentifier, productName) } )
        .subscribe(
          res => {
            resolve(res[0].id);
          },
          err => {
            console.log("Error occured");
          }
        )
    });
  }

  // needed to cast productData from database ressource to interface type
  dataFromProduct(product: Product) {
    return { 
      [this.productNameIdentifier]: product.productName,
      [this.costIdentifier]: product.cost,
      [this.doneIdentifier]: product.done
    };
  }

  deleteProduct(product: Product): void {
    this.http.delete(this.url + product.id)
      .subscribe(
        res => {
          if (product[this.doneIdentifier] != 1)
            this.costSum -= product[this.costIdentifier];
          this.productsDataSource.data.splice(this.productsDataSource.data.indexOf(product), 1)[0];
          this.updateTable();
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  updateDone(oldProduct): void {
    let doneData = { // only need to send changed data
      [this.doneIdentifier]: this.switchDone(oldProduct)
    }

    this.http.put(this.url + oldProduct.id, doneData)
      .subscribe(
        res => {
          oldProduct[this.doneIdentifier] = this.switchDone(oldProduct);
          if (oldProduct[this.doneIdentifier] == 1) {
            this.costSum -= oldProduct[this.costIdentifier];
          } else {
            this.costSum += oldProduct[this.costIdentifier];
          }
          if (!this.showDone) { // only need to update table filter if done should not be shown
            this.updateTable();
          }
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      )
  }

  updateTable(): void {
    this.productsDataSource = new MatTableDataSource(this.productsDataSource.data);
    this.setDataSourceProps();  
  }

  toggleFilter(): void {
    this.showDone = !this.showDone;
    this.productsDataSource.filter = this.showDone ? "" : "0";
  }

  containsProduct(productName: string): boolean {
    var contains: boolean = false;
    this.productsDataSource.data.map(product => {
      if (productName === product[this.productNameIdentifier]) {
        contains = true;
      }
    });
    return contains;
  }

  getFormattedCostSum(): string {
    return Math.abs(this.costSum).toFixed(2);
  }
}
