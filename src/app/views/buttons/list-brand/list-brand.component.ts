import { Model } from './../../../models/models';
import { Router } from '@angular/router';
import { FirestoreDataService } from './../../../firestore-data.service';
import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Vehicle } from '../../../models/vehicles';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent implements OnInit {
  vehicleTypeList: any;
  brandList: Vehicle[];
  selectedVehicleType: string;
  modelList: Model[];
  selectedBrand: string;
  modelname: string;
  brandname: string;
  modelId: string;
  brandId: string;
  ngModelRef: any;
  isUpdate: any;
  $: any;
  constructor(private _firestoreDataService: FirestoreDataService, private _loadingBar: SlimLoadingBarService,
  private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.isUpdate = false;
    this.selectedVehicleType = 'ctcwAzaVpGYzIhnHNDuq';
    this._firestoreDataService.getVehicleMasterList().subscribe( data => {
      this.vehicleTypeList = data;
      this.getAllBrandByVehicleType();
    });
  }

  getAllBrandByVehicleType() {
    this._firestoreDataService.getAllBrandByVehicleType(this.selectedVehicleType).subscribe( brandList => {
      this.brandList = brandList;
      this.selectedBrand = this.brandList[0].id;
      this.getAllModelList();
    });
  }

  getSelectedType() {
    this.getAllBrandByVehicleType();
  }

  openModal(content) {
    this.modelname = '';
    this.ngModelRef = this.modalService.open(content, { centered: true });
  }

  addNewBrand() {
    this._firestoreDataService.addVehicleBrand(this.brandname, this.selectedVehicleType);
    this.ngModelRef.close();
    this.selectedBrand = '';
  }

  closeModal() {
    this.ngModelRef.close();
    this.isUpdate = false;
  }

  editBrand(brandDetails, content) {
    this.brandname = brandDetails.brandname;
    this.brandId = brandDetails.id;
    this.ngModelRef = this.modalService.open(content, { centered: true});
    this.isUpdate = true;
  }

  editModel(modelDetails, content) {
    this.modelname = modelDetails.modelname;
    this.modelId = modelDetails.id;
    this.ngModelRef = this.modalService.open(content, { centered: true});
    this.isUpdate = true;
  }

  updateBrand() {
    this._firestoreDataService.updateVehicleBrand(this.brandId, this.brandname, this.selectedVehicleType);
    this.ngModelRef.close();
    this.brandId = '';
    this.selectedBrand = '';
    this.isUpdate = false;
  }

  updateModel() {
    this._firestoreDataService.updateModel(this.selectedVehicleType, this.selectedBrand, this.modelId, this.modelname);
    this.ngModelRef.close();
    this.modelId = '';
    this.modelname = '';
    this.isUpdate = false;
  }

  addNewModel() {
    this._firestoreDataService.addVehicleModel(this.selectedVehicleType, this.selectedBrand, this.modelname);
    this.ngModelRef.close();
    this.modelname = '';
  }

  removeModel(modelDetails) {
    if (confirm('Are you sure to remove Model')) {
      this._firestoreDataService.removeModel(this.selectedVehicleType, this.selectedBrand, modelDetails.id);
    }
  }

  removeBrand(brandDetails) {
    if (confirm('Are you sure to remove brand')) {
      this._firestoreDataService.removeBrand(brandDetails.id, this.selectedVehicleType);
    }
  }

  showModelsList(brandDetails) {
    this.selectedBrand = brandDetails.id;
    this.getAllModelList();
  /*  localStorage.clear();
    brandDetails.selectedVehicleType = this.selectedVehicleType;
    localStorage.setItem('brand', JSON.stringify(brandDetails));
    //this.router.navigate(['/buttons/list-model']);
  */
  }

  getAllModelList() {
    this._firestoreDataService.getAllModels(this.selectedVehicleType, this.selectedBrand).subscribe( data => {
      this.modelList = data;
      console.log(data);
    });
  }

}
