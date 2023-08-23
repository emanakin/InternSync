import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private renderer: Renderer2) { }

  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    let element = document.querySelector('.navbar');
    if (window.pageYOffset > element.clientHeight) {
        this.renderer.addClass(element, 'nav-scrolled');
    } else {
        this.renderer.removeClass(element, 'nav-scrolled');
    }
  }


}
