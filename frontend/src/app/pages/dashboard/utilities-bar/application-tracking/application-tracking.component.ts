import { Component } from '@angular/core';

@Component({
  selector: 'app-application-tracking',
  templateUrl: './application-tracking.component.html',
  styleUrls: ['./application-tracking.component.css']
})
export class ApplicationTrackingComponent {
  isDropdownOpen = false;

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

}
