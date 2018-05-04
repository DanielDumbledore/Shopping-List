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

  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductsService) { 
  }

  containsTypedProduct(): boolean {
    return this.productService.containsProduct(this.form.value.productName);
  }


  showError(): boolean {
    if (this.productService.containsProduct(this.form.value.productName)) {
      this.errorMessage = "Product already contained";

      return true;
    } else if (this.form.value.cost != undefined 
      && (Number(this.form.value.cost) < 0.01 || Number(this.form.value.cost) > 1000000000000)) {
      this.errorMessage = "Cost incorrect";

      return true;
    }

    return false;
  }

  inputIncorrect(): boolean {
    return this.containsTypedProduct() || Number(this.form.value.cost) < 0.01 
    || Number(this.form.value.cost) > 1000000000000;
  }

  saveOnEnter(event) {
    // 13 is "Enter" key
    if (event.keyCode === 13) {
      this.save();
    }
  }

  save() {
    if (this.form.value.productName !== "" && this.form.value.cost > 0.01 && this.form.value.cost < 1000000000000 
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
