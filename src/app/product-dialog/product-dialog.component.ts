import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';

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
    public dialogRef: MatDialogRef<ProductDialogComponent>) { 
  }

  save() {
    this.dialogRef.close(this.form.value);
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
