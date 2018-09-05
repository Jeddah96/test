import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-multi-slider',
  templateUrl: './multi-slider.component.html',
  styleUrls: ['./multi-slider.component.css']
})
export class MultiSliderComponent implements OnInit, AfterContentChecked {

  @ViewChild('dragger')
  dragger: ElementRef;
  @Input()
  min = 0;
  @Input()
  max = 100;
  @Input()
  minValue: number;
  @Input()
  maxValue: number;
  @Input()
  step = 1;
  @Output()
  rangeChange: EventEmitter<{
    minValue: number
    maxValue: number
  }> = new EventEmitter();

  submit() {
    this.rangeChange.emit({
      minValue: this.minValue,
      maxValue: this.maxValue
    });
  }
  setLow() {
    const minVal = this.minValue - this.min;
    this.dragger.nativeElement.style.setProperty('--low', minVal + '%');
  }
  setHigh() {
    const maxVal = this.maxValue - this.min;
    this.dragger.nativeElement.style.setProperty('--high', maxVal + '%');
  }
  newValMin() {
    if (this.minValue >= this.maxValue) {
      this.maxValue = this.minValue - this.min;
    }
  }
  newValMax() {
    if (this.maxValue === this.minValue) {
      this.maxValue = this.maxValue - this.min;
    }
  }
  ngOnInit(): void {
    this.minValue = this.minValue || this.min;
    this.maxValue = this.maxValue || this.max;
  }
  ngAfterContentChecked(): void {
    this.setLow();
    this.setHigh();
    this.newValMin();
    this.newValMax();
  }
}
