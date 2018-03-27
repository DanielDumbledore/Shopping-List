import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  form: FormGroup;
  productName: string;
  cost: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductsService) { 
  }

  containsTypedProduct(): boolean {
    console.log(this.form.value.productName);
    return this.productService.containsProduct(this.form.value.productName);
  }

  save() {
    if (this.form.value.productName !== "" && this.form.value.cost > 0 
     && !this.productService.containsProduct(this.form.value.productName)) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
      this.dialogRef.close();
  }

  ngOnInit() {
    this.form = this.fb.group({
      productName: this.productName,
      cost: this.cost
    });
  }

}
