import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vector-group',
  templateUrl: './vector-group.component.html',
  styleUrls: ['./vector-group.component.css']
})
export class VectorGroupComponent {
  @Input() groupType: 'group1' | 'group2';

}
