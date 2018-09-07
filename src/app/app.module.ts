import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormGroup, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { MultiSliderComponent } from './multi-slider/multi-slider.component';
import { TempSliderComponent } from './temp-slider/temp-slider.component';
import { SingleSliderComponent } from './single-slider/single-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiSliderComponent,
    TempSliderComponent,
    SingleSliderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
