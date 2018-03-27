import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  showDoneChecked: boolean;
  costSum: number = 0;
  displayedColumns = ['productName', 'cost', 'done'];

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.productService.sort = this.sort;
  }

  constructor(public productService: ProductsService) {
  }

  ngOnInit() {
  }
}