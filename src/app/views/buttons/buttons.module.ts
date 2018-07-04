import { BrandButtonsComponent } from './brand-buttons.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Buttons Routing
import { ButtonsRoutingModule } from './buttons-routing.module';
import { ListBrandComponent } from './list-brand/list-brand.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownsComponent } from './dropdowns.component';
import { ButtonsComponent } from './buttons.component';
import { ListModelComponent } from './list-model/list-model.component';
// Angular
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
@NgModule({
  imports: [
    CommonModule,
    ButtonsRoutingModule,
    BsDropdownModule.forRoot(),
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    MultiselectDropdownModule,
    FormsModule
  ],
  declarations: [
    ListBrandComponent,
    BrandButtonsComponent,
    DropdownsComponent,
    ButtonsComponent,
    ListModelComponent
  ]
})
export class ButtonsModule { }
