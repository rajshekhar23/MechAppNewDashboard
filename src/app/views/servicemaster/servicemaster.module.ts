import { ListServiceComponent } from './list-service/list-service.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicemasterRoutingModule } from './servicemaster-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ServicemasterRoutingModule,
    BsDropdownModule.forRoot(),
    NgbModule.forRoot(),
    FormsModule
  ],
  declarations: [
    ListServiceComponent
  ]
})
export class ServicemasterModule { }
