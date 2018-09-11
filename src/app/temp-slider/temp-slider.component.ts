import {
  Component, Input, Output, EventEmitter,
  ElementRef, OnInit, HostListener, SimpleChanges, OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import 'hammerjs';
import { InitRange, InitHandler } from './toModels/slider.model';
@Component({
  selector: 'app-temp-slider',
  templateUrl: './temp-slider.component.html',
  styleUrls: ['./temp-slider.component.scss']
})
export class TempSliderComponent implements OnInit, OnChanges {

  editSliderForm: FormGroup;

  private _sliderModel = [0, 0, 0];
  private _baseValueModel = [0, 0, 0];
  private _sliderWidth = 0;
  private _sliderBaseWidth = 0;
  private _totalLength = 0;
  private _totalBaseLength = 0;
  private _startClientX = 0;
  private _startPleft = 0;
  private _startPRight = 0;

  public initValues: number[] = [];
  public currentValues: number[] = [0, 0];
  public baseValues: number[] = [0, 0];
  public handlerX: number[] = [0, 0, 0];
  public baseHandlerX: number[] = [0, 0, 0];
  public isHandlerActive = false;
  public isTouchEventStart = false;
  public isMouseEventStart = false;
  public currentHandlerIndex = 0;
  public baseIndex = 0;

  constructor(private el: ElementRef) {
  }

  private _initOptions: InitRange;
  @Input('initConfig')
  set initConfig(value: InitRange) {
    this._initOptions = { ...value };
  }

  @Output() Change = new EventEmitter<number[]>();

  ngOnInit() {
    this.initializeSlider();
    this.initializeBase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['this._initOptions.minSelected'] && !changes['this._initOptions.minSelected']) {
      this.resetModel();
    }
  }
  public isNullOrEmpty(obj: any) {
    return obj === undefined || obj === null || obj === '';
  }
  public initializeSlider() {
    this._sliderWidth = this.el.nativeElement.children[0].children[0].offsetWidth;
    this.resetModel();
  }
  public initializeBase() {
    this._sliderBaseWidth = this.el.nativeElement.children[0].children[0].offsetWidth;
    this.resetBaseModel();
  }
  private resetModel() {
   this.validateSliderValues();
    this._sliderModel = [
      this.currentValues[0] - this.initValues[0],
      this.currentValues[1] - this.currentValues[0],
      this.initValues[1] - this.currentValues[1]
    ];
    this._totalLength = this._sliderModel.reduce((prevValue, curValue) => prevValue + curValue, 0);
    this.setHandlerPosition();
  }
  private resetBaseModel() {
    this.validateBaseValues();
    this._baseValueModel = [
      this.baseValues[0] - this.initValues[0],
      this.baseValues[1] - this.baseValues[0],
      this.initValues[1] - this.baseValues[1]
    ];
    this._totalBaseLength = this._baseValueModel.reduce((prevValue, curValue) => prevValue + curValue, 0);
    this.setBaseValuePosition();
  }
  private validateSliderValues() {
    if (this.isNullOrEmpty(this._initOptions.minValue) || this.isNullOrEmpty(this._initOptions.maxValue)) {
      this.updateInitValues([0, 0]);
      this.updateCurrentValue([0, 0], true);
    } else if (this._initOptions.minValue > this._initOptions.maxValue) {
      this.updateInitValues([0, 0]);
      this.updateCurrentValue([0, 0], true);
    } else {
      this.initValues = [this._initOptions.minValue, this._initOptions.maxValue];
      this.updateCurrentValue([this._initOptions.minSelected, this._initOptions.maxSelected], true);
    }
  }
  private validateBaseValues() {
    if (this.isNullOrEmpty(this._initOptions.minValue) || this.isNullOrEmpty(this._initOptions.maxValue)) {
      this.updateInitValues([0, 0]);
      this.updateBaseValue([0, 0], true);
    } else if (this._initOptions.minValue > this._initOptions.maxValue) {
      this.updateInitValues([0, 0]);
      this.updateBaseValue([0, 0], true);
    } else {
      this.initValues = [this._initOptions.minValue, this._initOptions.maxValue];
      this.updateBaseValue([this._initOptions.firstBase, this._initOptions.secondBase], true);
    }
  }
  private updateBaseValue(arrayValue: number[], privateChange: boolean = false) {
    this._initOptions.firstBase = this.baseValues[0] = arrayValue[0];
    this._initOptions.secondBase = this.baseValues[1] = arrayValue[1];
    if (!privateChange) {
      this.Change.emit(this.baseValues);
    }
  }
  private updateCurrentValue(arrayValue: number[], privateChange: boolean = false) {
    this._initOptions.minSelected = this.currentValues[0] = arrayValue[0];
    this._initOptions.maxSelected = this.currentValues[1] = arrayValue[1];
    if (!privateChange) {
      this.Change.emit(this.currentValues);
    }
  }
  private updateInitValues(arrayValue: number[]) {
    this._initOptions.minValue = this.initValues[0] = arrayValue[0];
    this._initOptions.maxValue = this.initValues[1] = arrayValue[1];
  }
  private setHandlerPosition() {
    let runningTotal = 0;
    this.updateCurrentValue([
      this.initValues[0] + this._sliderModel[0],
      this.initValues[1] - this._sliderModel[2]
    ]);
    for (let i = 0, len = this._sliderModel.length - 1; i < len; i++) {
      runningTotal += this._sliderModel[i];
      this.handlerX[i] = (runningTotal / this._totalLength) * 100;
    }
  }
  private setBaseValuePosition() {
    let posBaseTotal = 0;
    this.updateBaseValue([
      this.initValues[0] + this._baseValueModel[0],
      this.initValues[1] - this._baseValueModel[2]
    ]);
    for (let i = 0, len = this._baseValueModel.length - 1; i < len; i++) {
      posBaseTotal += this._baseValueModel[i];
      this.baseHandlerX[i] = (posBaseTotal / this._totalLength) * 100;
    }
  }
  private setModelValue(index: number, value: number) {
    if (this._initOptions.step > 0) {
      value = ((value / this._initOptions.step) * this._initOptions.step);
    }
    this._sliderModel[index] = value;
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
      this._startClientX = event.clientX;
      this.isMouseEventStart = true;
      this.isTouchEventStart = false;
    } else if (event.deltaX) {
      this._startClientX = event.deltaX;
      this.isTouchEventStart = true;
      this.isMouseEventStart = false;
    }
    if (this.isMouseEventStart || this.isTouchEventStart) {
      this.currentHandlerIndex = handlerIndex;
      this._startPleft = this._sliderModel[handlerIndex];
      this._startPRight = this._sliderModel[handlerIndex + 1];
      this.isHandlerActive = true;
    }
  }
  public handlerSliding(event: any) {
    if ((this.isMouseEventStart && event.clientX) || (this.isTouchEventStart && event.deltaX)) {
      const movedX = ((event.clientX || event.deltaX) - this._startClientX) / this._sliderWidth * this._totalLength;
      const nextPLeft = this._startPleft + movedX;
      const nextPRight = this._startPRight - movedX;
      if (nextPLeft >= 0 && nextPRight >= 0) {
        this.setModelValue(this.currentHandlerIndex, nextPLeft);
        this.setModelValue(this.currentHandlerIndex + 1, nextPRight);
        this.setHandlerPosition();
      }
    }
  }
}
