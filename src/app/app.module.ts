import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
