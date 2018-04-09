import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule, MatTableModule, MatSortModule,
         MatCheckboxModule, MatFormFieldModule, MatInputModule, 
         MatIconModule, MatButtonModule, MatDialogModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductInputComponent } from './product-input/product-input.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductsService } from './services/products.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductTableComponent,
    ProductInputComponent,
    ProductDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    // Style-Modules
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [ProductsService],
  bootstrap: [AppComponent],
  entryComponents: [
    ProductDialogComponent
  ],
})
export class AppModule { }
