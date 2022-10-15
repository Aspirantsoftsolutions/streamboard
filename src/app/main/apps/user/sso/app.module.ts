import { CoreCommonModule } from '@core/common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// import { MatButtonModule } from '@angular/material/button';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatListModule } from '@angular/material/list';
// import { MatTableModule } from '@angular/material/table';
// import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { MsalModule } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';
import { CsvModule } from '@ctrl/ngx-csv';
import { ToastrModule } from 'ngx-toastr';

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // MatButtonModule,
    // MatToolbarModule,
    // MatListModule,
    // MatTableModule,
    // MatCardModule,
    HttpClientModule,
    MsalModule,
    CsvModule,
    ToastrModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
