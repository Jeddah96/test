import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempSliderComponent } from './temp-slider.component';

describe('TempSliderComponent', () => {
  let component: TempSliderComponent;
  let fixture: ComponentFixture<TempSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
