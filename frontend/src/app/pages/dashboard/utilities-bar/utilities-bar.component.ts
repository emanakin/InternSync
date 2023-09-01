import { Component } from '@angular/core';

@Component({
  selector: 'app-utilities-bar',
  templateUrl: './utilities-bar.component.html',
  styleUrls: ['./utilities-bar.component.css']
})
export class UtilitiesBarComponent {
  names: string[] = ['Resume', 'Location', 'Date Posted', 'Company'];
}
