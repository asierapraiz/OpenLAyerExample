import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './components/app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { PublicModule} from './components/public/public.module';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { registerLocaleData } from '@angular/common';
import localeES from "@angular/common/locales/es";
import { SnakBarComponent } from './components/shared/components/snak-bar/snak-bar.component';


registerLocaleData(localeES, "es");

@NgModule({
  declarations: [
    AppComponent,
    SnakBarComponent,
    
    
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    PublicModule,
    CoreModule,
    FormsModule,    
    BrowserAnimationsModule,
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
