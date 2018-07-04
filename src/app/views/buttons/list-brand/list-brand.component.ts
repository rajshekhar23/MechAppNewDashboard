
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { Variant } from './../../../models/variants';
import { Model } from './../../../models/models';
import { Router } from '@angular/router';
import { FirestoreDataService } from './../../../firestore-data.service';
import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Vehicle } from '../../../models/vehicles';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { Service } from '../../../models/services';
import { SubService } from '../../../models/subServices';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent implements OnInit {
  vehicleTypeList: any;
  variantList: Variant[];
  brandList: Vehicle[];
  modelList: Model[];
  selectedModel: string;
  selectedVehicleType: string;
  selectedBrand: string;
  selectedVariant: string;
  modelname: string;
  isBrandListEmpty: any;
  isModelListEmpty: any;
  isVariantListEmpty: any;
  brandname: string;
  variantname: string;
  modelId: string;
  brandId: string;
  variantId: string;
  ngModelRef: any;
  isUpdate: any;
  selectedServices: Service[];
  selectedSubServices: SubService[];
  serviceList: any;
  subServiceList: any;
  $: any;
  selectedOptions: any;
  constructor(private _firestoreDataService: FirestoreDataService, private _loadingBar: SlimLoadingBarService,
  private modalService: NgbModal, private router: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    this._firestoreDataService.getAllServiceListWithoutFilter().subscribe( data => {
      this.serviceList = data;
      console.log(this.serviceList);
    });
    this.isUpdate = false;
    this.selectedVehicleType = 'pM0luQDMCvCvDxJcedDn';
    this._firestoreDataService.getVehicleMasterList().subscribe( data => {
      this.vehicleTypeList = data;
      console.log(this.vehicleTypeList);
      this.getAllBrandByVehicleType();
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  showAllPrices() {
    console.log(this.subServiceList);
    this.addServicesToVariant();
  }

  loadSubServices() {
    this.subServiceList = [];
    this.selectedServices.forEach( selectedService => {
      this._firestoreDataService.getAllSubServiceList(selectedService).subscribe( data => {
        data.forEach( subService => {
          this.subServiceList.push({
            id: subService.id,
            sub_service_display_name: subService.sub_service_display_name,
            price: null,
            discount: null,
            service: '/service_master/' + selectedService + '/sub_service/' + subService.id
          });
        });
      });
    });
  }

  addServicesToVariant() {
    console.log('addServicesToVariant params', this.selectedVehicleType + '##' + this.brandId + '##' + this.modelId);
    this._firestoreDataService.addServicesToVariant(this.subServiceList, this.selectedVehicleType, this.selectedBrand,
       this.selectedModel, this.variantId, this.variantname);
    this.ngModelRef.close();
  }

  onSelectAll(item: any) {

  }

  getAllBrandByVehicleType() {
    this._firestoreDataService.getAllBrandByVehicleType(this.selectedVehicleType).subscribe( brandList => {
      this.brandList = brandList;
      if (this.brandList.length !== 0) {
        this.isBrandListEmpty = false;
        this.selectedBrand = this.brandList[0].id;
        this.getAllModelList();
      } else {
        this.isBrandListEmpty = true;
      }
    });
  }

  getSelectedType() {
    this.clearAll();
    this.getAllBrandByVehicleType();
  }

  clearAll() {
    this.selectedBrand = '';
    this.selectedModel = '';
    this.variantList = [];
    this.modelList = [];
    this.brandList =  [];
    this.isBrandListEmpty = true;
    this.isModelListEmpty = true;
    this.isVariantListEmpty = true;
  }

  openModal(content) {
    this.modelname = '';
    this.variantname = '';
    this.brandname = '';
    this.isUpdate = false;
    this.ngModelRef = this.modalService.open(content, { centered: true });
  }

  addNewBrand() {
    this._firestoreDataService.addVehicleBrand(this.brandname, this.selectedVehicleType);
    this.ngModelRef.close();
    this.brandname = '';
  }

  addNewModel() {
    this._firestoreDataService.addVehicleModel(this.selectedVehicleType, this.selectedBrand, this.modelname);
    this.ngModelRef.close();
    this.modelname = '';
  }

  addNewVariant() {
    this._firestoreDataService.addVehicleVariant(this.selectedVehicleType, this.selectedBrand, this.selectedModel, this.variantname);
    this.ngModelRef.close();
    this.variantname = '';
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
    this.subServiceList = [];
  }

  editModel(modelDetails, content) {
    this.modelname = modelDetails.modelname;
    this.modelId = modelDetails.id;
    this.ngModelRef = this.modalService.open(content, { centered: true});
    this.isUpdate = true;
  }

  editVariant(variantDetails, content) {
    this.variantname = variantDetails.variantname;
    this.variantId = variantDetails.id;
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

  updateVariant() {
    this._firestoreDataService.updateVariant(this.selectedVehicleType, this.selectedBrand, this.selectedModel, this.variantId,
    this.variantname);
    this.ngModelRef.close();
    this.variantId = '';
    this.variantname = '';
    this.isUpdate = false;
  }

  removeBrand(brandDetails) {
    if (confirm('Are you sure to remove brand')) {
      this._firestoreDataService.removeBrand(brandDetails.id, this.selectedVehicleType);
      this.getAllModelList();
    }
  }

  removeModel(modelDetails) {
    if (confirm('Are you sure to remove Model')) {
      this._firestoreDataService.removeModel(this.selectedVehicleType, this.selectedBrand, modelDetails.id);
      this.getAllVariantList();
    }
  }

  removeVariant(variantDetails) {
    if (confirm('Are you sure to remove variant')) {
      this._firestoreDataService.removeVariant(this.selectedVehicleType, this.selectedBrand, this.selectedModel, variantDetails.id);
    }
  }

  showModelsList(brandDetails) {
    this.selectedBrand = brandDetails.id;
    this.getAllModelList();
  }

  getAllModelList() {
    this._firestoreDataService.getAllModels(this.selectedVehicleType, this.selectedBrand).subscribe( data => {
      this.modelList = data;
      if (this.modelList.length !== 0) {
        this.isModelListEmpty = false;
        this.selectedModel = this.modelList[0].id;
        this.getAllVariantList();
      } else {
        this.isModelListEmpty = true;
      }
    });
  }

  getAllVariantList() {
    this._firestoreDataService.getAllVariant(this.selectedVehicleType, this.selectedBrand, this.selectedModel).subscribe( data => {
      this.variantList = data;
      if (this.variantList.length !== 0) {
        this.isVariantListEmpty = false;
      } else {
        this.isVariantListEmpty = true;
      }
    });
  }

  showVariantsList(modelDetails) {
    this.modelname = modelDetails.modelname;
    this.modelId = modelDetails.modelId;
    this.selectedModel = modelDetails.id;
    this.getAllVariantList();
  }

}
