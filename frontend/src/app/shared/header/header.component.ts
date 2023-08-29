import { Component, HostListener, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() showNav: boolean = true;
  @Input() showToggler: boolean = true;
  @Input() transparentOn: boolean = false;

  constructor(private renderer: Renderer2) { }

  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    if (!this.transparentOn) {
      let element = document.querySelector('.navbar');
      if (window.pageYOffset > element.clientHeight) {
          this.renderer.addClass(element, 'nav-scrolled');
      } else {
          this.renderer.removeClass(element, 'nav-scrolled');
      }
    }   
  }
  
  /* 
  Params:
  sectionId: the ID of the section you want to navigate too 
  event: mouse event
  */
  goToSection(sectionId: string, event: MouseEvent) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView();
  }

}
