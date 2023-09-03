import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { JobState } from './states/job.state';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HeaderComponent } from './shared/header/header.component';
import { HeroComponent } from './pages/home/hero/hero.component';
import { VectorGroupComponent } from './pages/home/vector-group/vector-group.component';
import { FeaturesComponent } from './pages/home/features/features.component';
import { FeatureComponent } from './pages/home/features/feature/feature.component';
import { ContactComponent } from './pages/home/contact/contact.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SignupFormComponent } from './pages/signup/signup-form/signup-form.component';
import { AuthFormComponent } from './shared/auth-form/auth-form.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { JobSectionComponent } from './pages/dashboard/job-section/job-section.component';
import { UtilitiesBarComponent } from './pages/dashboard/utilities-bar/utilities-bar.component';
import { DashHeaderComponent } from './pages/dashboard/dash-header/dash-header.component';
import { JobsComponent } from './pages/dashboard/job-section/jobs/jobs.component';
import { JobCardComponent } from './pages/dashboard/job-section/job-card/job-card.component';
import { UserMenuComponent } from './pages/dashboard/dash-header/user-menu/user-menu.component';
import { SortByComponent } from './pages/dashboard/utilities-bar/sort-by/sort-by.component';
import { SearchBarComponent } from './pages/dashboard/utilities-bar/search-bar/search-bar.component';
import { ApplicationTrackingComponent } from './pages/dashboard/utilities-bar/application-tracking/application-tracking.component';
import { JobDetailsComponent } from './pages/dashboard/job-section/job-details/job-details.component';
import { QuickApplyComponent } from './pages/dashboard/job-section/quick-apply/quick-apply.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    HeroComponent,
    VectorGroupComponent,
    FeaturesComponent,
    FeatureComponent,
    ContactComponent,
    FooterComponent,
    SignupFormComponent,
    AuthFormComponent,
    LoadingSpinnerComponent,
    JobSectionComponent,
    UtilitiesBarComponent,
    DashHeaderComponent,
    JobsComponent,
    JobCardComponent,
    UserMenuComponent,
    SortByComponent,
    SearchBarComponent,
    ApplicationTrackingComponent,
    JobDetailsComponent,
    QuickApplyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxsModule.forRoot([
      JobState
  ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
