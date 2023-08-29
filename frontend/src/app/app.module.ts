import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
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
    AuthFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
