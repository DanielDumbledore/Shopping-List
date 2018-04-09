import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { MatSort, MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { Product } from '../shared/product';

@Component({
  selector: 'app-product-table',
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}
  ],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  costSum: number = 0;
  displayedColumns = [this.productService.productNameIdentifier, this.productService.costIdentifier,
                      this.productService.doneIdentifier, 'delete'];

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.productService.sort = this.sort;
  }

  constructor(public productService: ProductsService) {
  }

  ngOnInit() {
  }
}