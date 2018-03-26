import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatToolbarModule, MatTableModule, MatSortModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductInputComponent } from './product-input/product-input.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductTableComponent,
    ProductInputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // Style-Modules
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
