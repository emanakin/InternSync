import { Component, ElementRef, ViewChild } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { S3Service } from 'src/app/services/s3.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dash-header',
  templateUrl: './dash-header.component.html',
  styleUrls: ['./dash-header.component.css']
})
export class DashHeaderComponent {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private s3Service: S3Service,
    private authService: AuthService,
    private userService: UserService) { }

  uploadResume(): void {
      this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const userEmail = this.authService.getEmail();
        const fileName = `resume_${userEmail}_${file.name}`;

        this.s3Service.getUploadPresignedUrl(fileName, file).pipe(
            switchMap((data) => {
                const presignedUrl = data.url;
                return this.s3Service.uploadFileToS3(presignedUrl, file);
            }),
            tap(() => {
                console.log('Resume uploaded successfully!');
                this.updateUserResumeReference(userEmail, fileName);
                this.deletePreviousResume(this.authService.getResumeRef())
            })
        ).subscribe(
            () => {alert('Upload done successfully!');},
            (error) => {
                console.error('Error uploading resume:', error);
                alert('Failed to upload! Please try again.');
            }
        );
    }
  }

  updateUserResumeReference(email: string, resumeReference: string): void {
    this.userService.updateResumeReference(email, resumeReference).subscribe(
        () => {
            console.log('Resume reference updated successfully in the database.');
        },
        (error) => {
            console.error('Error updating resume reference:', error);
        }
    );
  }

  deletePreviousResume(resumeReference: string): void {
    this.s3Service.deleteObjectFromS3(resumeReference).subscribe(
        () => {
            console.log('Old reference deleted successfully in the database.');
        },
        (error) => {
            console.error('Error deleting previous reference:', error);
        }
    );
  }

}
