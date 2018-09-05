import {
  Component, Input, Output, EventEmitter,
  ElementRef, OnInit, HostListener, SimpleChanges, OnChanges
} from '@angular/core';

@Component({
  selector: 'app-temp-slider',
  templateUrl: './temp-slider.component.html',
  styleUrls: ['./temp-slider.component.css']
})
export class TempSliderComponent implements OnInit, OnChanges {

  private sliderModel = [0, 0, 0];
  private sliderWidth = 0;
  private totalLength = 0;
  private startClientX = 0;
  private startPleft = 0;
  private startPRight = 0;
  private minValue: number;
  private maxValue: number;
  private minSelected: number;
  private maxSelected: number;
  private step: number;

  public initValues: number[] = [];
  public currentValues: number[] = [0, 0];
  public handlerX: number[] = [0, 0];
  public isHandlerActive = false;
  public isTouchEventStart = false;
  public isMouseEventStart = false;
  public currentHandlerIndex = 0;

  constructor(private el: ElementRef) {
  }

  @Input('min')
  set setMinValues(value: number) {
    if (!isNaN(value)) {
      this.minValue = Number(value);
    }
  }

  @Input('max')
  set setMaxValues(value: number) {
    if (!isNaN(value)) {
      this.maxValue = Number(value);
    }
  }

  @Input('minSelected')
  set setMinSelectedValues(value: number) {
    if (!isNaN(value) && this.isNullOrEmpty(this.minSelected)) {
      this.minSelected = Number(value);
    }
  }

  @Input('maxSelected')
  set setMaxSelectedValues(value: number) {
    if (!isNaN(value) && this.isNullOrEmpty(this.maxSelected)) {
      this.maxSelected = Number(value);
    }
  }
  @Input('step')
  set stepValue(value: number) {
    if (!isNaN(value)) {
      this.step = Number(value);
    }
  }

  @Output() Change = new EventEmitter<number[]>();

  ngOnInit() {
    this.initializeSlider();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['setMinSelectedValues'] && !changes['setMaxSelectedValues']) {
      this.resetModel();
    }
  }
  public isNullOrEmpty(obj: any) {
    return obj === undefined || obj === null || obj === '';
  }
  public initializeSlider() {
    this.sliderWidth = this.el.nativeElement.children[0].children[0].offsetWidth;
    this.resetModel();
  }
  private resetModel() {
    this.validateSliderValues();
    this.sliderModel = [
      this.currentValues[0] - this.initValues[0],
      this.currentValues[1] - this.currentValues[0],
      this.initValues[1] - this.currentValues[1]
    ];
    this.totalLength = this.sliderModel.reduce((prevValue, curValue) => prevValue + curValue, 0);
    this.setHandlerPosition();
  }
  private validateSliderValues() {
    if (this.isNullOrEmpty(this.minValue) || this.isNullOrEmpty(this.maxValue)) {
      this.updateInitValues([0, 0]);
      this.updateCurrentValue([0, 0], true);
    } else if (this.minValue > this.maxValue) {
      this.updateInitValues([0, 0]);
      this.updateCurrentValue([0, 0], true);
    } else {
      this.initValues = [this.minValue, this.maxValue];
      this.updateCurrentValue([this.minSelected, this.maxSelected], true);
    }
  }
  private updateCurrentValue(arrayValue: number[], privateChange: boolean = false) {
    this.minSelected = this.currentValues[0] = arrayValue[0];
    this.maxSelected = this.currentValues[1] = arrayValue[1];
    if (!privateChange) {
      this.Change.emit(this.currentValues);
    }
  }
  private updateInitValues(arrayValue: number[]) {
    this.minValue = this.initValues[0] = arrayValue[0];
    this.maxValue = this.initValues[1] = arrayValue[1];
  }
  private setHandlerPosition() {
    let runningTotal = 0;
    this.updateCurrentValue([
      this.initValues[0] + this.sliderModel[0],
      this.initValues[1] - this.sliderModel[2]
    ]);
    for (let i = 0, len = this.sliderModel.length - 1; i < len; i++) {
      runningTotal += this.sliderModel[i];
      this.handlerX[i] = (runningTotal / this.totalLength) * 100;
    }
  }
  private setModelValue(index: number, value: number) {
    if (this.step > 0) {
      value = ((value / this.step) * this.step);
      value.toFixed(2);
    }
    this.sliderModel[index] = value;
  }
  @HostListener('document:mouseup')
  @HostListener('document:panend')
  setHandlerActiveOff() {
    this.isMouseEventStart = false;
    this.isTouchEventStart = false;
    this.isHandlerActive = false;
  }
  public setHandlerActive(event: any, handlerIndex: number) {
    event.preventDefault();
    if (event.clientX) {
      this.startClientX = event.clientX;
      this.isMouseEventStart = true;
      this.isTouchEventStart = false;
    } else if (event.deltaX) {
      this.startClientX = event.deltaX;
      this.isTouchEventStart = true;
      this.isMouseEventStart = false;
    }
    if (this.isMouseEventStart || this.isTouchEventStart) {
      this.currentHandlerIndex = handlerIndex;
      this.startPleft = this.sliderModel[handlerIndex];
      this.startPRight = this.sliderModel[handlerIndex + 1];
      this.isHandlerActive = true;
    }
  }
  public handlerSliding(event: any) {
    if ((this.isMouseEventStart && event.clientX) || (this.isTouchEventStart && event.deltaX)) {
      const movedX = ((event.clientX || event.deltaX) - this.startClientX) / this.sliderWidth * this.totalLength;
      const nextPLeft = this.startPleft + movedX;
      const nextPRight = this.startPRight - movedX;
      if (nextPLeft >= 0 && nextPRight >= 0) {
        this.setModelValue(this.currentHandlerIndex, nextPLeft);
        this.setModelValue(this.currentHandlerIndex + 1, nextPRight);
        this.setHandlerPosition();
      }
    }
  }
}
