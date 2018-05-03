import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductsService } from '../services/products.service';
import { Product } from '../shared/product';

@Component({
  selector: 'app-product-input',
  templateUrl: './product-input.component.html',
  styleUrls: ['./product-input.component.css']
})
export class ProductInputComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public productService: ProductsService) { }

  openProductDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    
    const dialogRef = this.dialog.open(ProductDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      productData => {
        if (productData) { // save and not close was called
          productData["done"] = 0;
          this.productService.addProduct(productData);
        }
      }
    );    
  }

  ngOnInit() {
  }

}
