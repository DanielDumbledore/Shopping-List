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
  public url = 'http://localhost:2403/einkaufsliste/'
  public productNameIdentifier = 'produkt';
  public costIdentifier = 'kosten';
  public doneIdentifier = 'erledigt';

  public sort: MatSort;

  constructor(private http: HttpClient) { 
    this.getProducts().then((data: Product[]) => {
      this.productsDataSource = new MatTableDataSource(data);
      this.setDataSourceProps();
      data.map(product => { this.costSum += product[this.costIdentifier] });      
    });
  }

  setDataSourceProps(): void {
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

  addProduct(newProduct: Product): void {
    this.costSum += newProduct.cost;

    let data = this.dataFromProduct(newProduct);

    this.productsDataSource.data.push(data);
    this.updateTable();

    this.http.post(this.url, data)
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
    return 1 - product[this.doneIdentifier];
  }

  async getIdOfProduct(product): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!product.id) {
        this.http.get(this.url, { params: new HttpParams().set(this.productNameIdentifier, product[this.productNameIdentifier]) } )
          .subscribe(
            res => {
              resolve(res[0].id);
            },
            err => {
              console.log("Error occured");
            }
          );
      } else {
        resolve(product.id);
      }
    });
  }

  dataFromProduct(product) {
    return { 
      "id": product.id,
      [this.productNameIdentifier]: product.productName,
      [this.costIdentifier]: product.cost,
      [this.doneIdentifier]: product.done
    };
  }

  deleteProduct(product): void {
    let data = this.dataFromProduct(product);

    this.costSum -= product[this.costIdentifier];
    this.productsDataSource.data.splice(this.productsDataSource.data.indexOf(data), 1);
    this.updateTable();
    this.getIdOfProduct(data).then(id => {
      this.http.delete(this.url + id)
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log("Error occured");
          }
        );
    })
  }

  updateDone(oldProduct): void {
    oldProduct[this.doneIdentifier] = this.switchDone(oldProduct);

    this.getIdOfProduct(oldProduct).then(id => {
      this.http.put(this.url + id, oldProduct)
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log("Error occured");
          }
        )
    })
    

    if (!this.showDone) {
      this.updateTable();
    }
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
}
