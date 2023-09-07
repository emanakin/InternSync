import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { User } from 'src/app/dto/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { S3Service } from 'src/app/services/s3.service';

export const MustMatch: ValidatorFn = (control: FormGroup) => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
      return null;
  }

  return password.value === confirmPassword.value ? null : { mustMatch: true };
};

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent {
  @Input() mode: 'login' | 'signup' = 'login';

  selectedFiles: { [key in 'resume' | 'profile_picture']?: File } = {};
  form: FormGroup;
  isLoading = false;
  showPopup: boolean = false;
  error: string = null;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder,
    private s3Service: S3Service) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    if (this.mode === 'login') {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    } else if (this.mode === 'signup') {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            resume: [null], 
            profilePicture: [null, Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: MustMatch });
    }
  }

  checkForProfilePicture(): void {
    if (this.mode === 'login') {return}
      if (this.form.pristine) {
        alert('Fill in the form to submit.');
        return;
      }
      if (!this.form.get('profilePicture').value) {
        alert('Please upload a profile picture before submitting.');
      } 
  }
  
  onSubmit(): void {
    if (!this.form.valid) { return }
    this.isLoading = true;
    
    if (this.mode === 'login') {
      const user = this.createUser();
      const authObs = this.authService.login(user);
      
      this.handleAuthObservable(authObs);
    } else {
      this.sendFiles().subscribe(() => {
        const user = this.createUser();
        console.log('User dto created:', user);
        const authObs = this.authService.signup(user);
        
        this.handleAuthObservable(authObs);
      });
    }
  }

  handleAuthObservable(authObs: Observable<User>) {
    authObs.subscribe(
        resData => {
          console.log(resData);
          localStorage.setItem('token', JSON.stringify(resData.token));
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        errorMessage => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
    );
    this.form.reset();
  }


  createUser(): User {
    if (this.mode === 'login') {
      return {
        email: this.form.get('email').value,
        password: this.form.get('password').value
      };
    } else {
      return {
        first_name: this.form.get('firstName').value,
        last_name: this.form.get('lastName').value,
        email: this.form.get('email').value,
        password: this.form.get('password').value,
        resume: this.form.get('resume').value,  
        profile_picture: this.form.get('profilePicture').value 
      };
    }
  }

  onFileSelected(event: any, type: 'resume' | 'profile_picture'): void {
    this.selectedFiles[type] = event.target.files[0];
  }

  sendFiles(): Observable<any[]> {
    const uploadObservables: Observable<any>[] = [];
  
    Object.entries(this.selectedFiles).forEach(([type, file]) => {
      const fileName = `${type}_${this.form.get('email').value}_${file.name}`;
      const upload$ = this.s3Service.getUploadPresignedUrl(fileName, file).pipe(
        switchMap((data) => {
          const presignedUrl = data.url;
          return this.s3Service.uploadFileToS3(presignedUrl, file);
        }),
        tap(() => {
          console.log('File uploaded successfully!');
          if (type === 'resume') {
            this.form.get('resume').setValue(fileName);
          } else {
            this.form.get('profilePicture').setValue(fileName);
          }
        })
      );
  
      uploadObservables.push(upload$);
    });
  
    return forkJoin(uploadObservables);
  }
  
}
