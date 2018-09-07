import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSliderComponent } from './single-slider.component';

describe('SingleSliderComponent', () => {
  let component: SingleSliderComponent;
  let fixture: ComponentFixture<SingleSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
