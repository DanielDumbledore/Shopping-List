import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatTab} from '@angular/material';
import { ProductsService } from '../services/products.service';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Product } from '../shared/product';

@Component({
  selector: 'app-product-table',
  providers: [ProductsService],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  displayedColumns = ['productName', 'cost', 'done'];
  productsDataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public productService: ProductsService) {
    this.productService.getProducts().then((data: Product[]) => {
      this.productsDataSource = new MatTableDataSource(data);
      this.productsDataSource.sort = this.sort;
    });
  }

  ngOnInit() {
  }
}