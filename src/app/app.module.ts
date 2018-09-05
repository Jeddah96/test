import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { MultiSliderComponent } from './multi-slider/multi-slider.component';
import { TempSliderComponent } from './temp-slider/temp-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiSliderComponent,
    TempSliderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
