import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('featuresSection') featuresSection: ElementRef;
  @ViewChild('contactSection') contactSection: ElementRef;

  scrollTo(sectionId: string) {
    switch (sectionId) {
      case 'featuresSection':
        this.featuresSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }
}
