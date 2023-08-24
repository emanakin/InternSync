import { Component, Input } from '@angular/core';
import { Feature } from 'src/app/dto/feature.model';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent {
  @Input() feature: Feature;

  constructor() { }

}
