import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  initConfigData = { 'firstBase': 20, 'secondBase': 70, 'minValue': 0, 'maxValue': 100, 'minSelected': 10, 'maxSelected': 80 };
}
