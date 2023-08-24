import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { CtaComponent } from './pages/home/cta/cta.component';
import { VectorGroupComponent } from './pages/home/vector-group/vector-group.component';
import { FeaturesComponent } from './pages/home/features/features.component';
import { FeatureComponent } from './pages/home/features/feature/feature.component';
import { ContactComponent } from './pages/home/contact/contact.component';
import { FooterComponent } from './pages/home/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    CtaComponent,
    VectorGroupComponent,
    FeaturesComponent,
    FeatureComponent,
    ContactComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
