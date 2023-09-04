import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { S3Service } from 'src/app/services/s3.service';
import { AuthToken } from 'src/app/dto/authToken.model';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  isDropdownVisible: boolean = false;
  profilePicUrl: string;
  name: string;
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private s3Service: S3Service) {}

  ngOnInit(){
    const token: AuthToken = this.authService.getDecodedToken()
    this.name = token.first_name + ' ' + token.last_name
  }

  onSignOut(): void {
    this.authService.removeToken();
    this.router.navigate(['/']); 
  }

  getProfilePictureUrl(imageUrl: string): void {
    this.s3Service.getAccessPresignedUrl(imageUrl).subscribe(data => {
        this.profilePicUrl = data.url;
    });
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
