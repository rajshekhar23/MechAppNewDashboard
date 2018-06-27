import { Model } from './../../../models/models';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Vehicle } from './../../../models/vehicles';
import { FirestoreDataService } from './../../../firestore-data.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.scss']
})
export class ListModelComponent implements OnInit {
  vehicleTypeList: any;
  vehicleType: string;
  brandList: Vehicle[];
  modelList: Model[];
  brandname: string;
  modelname: string;
  modelId: string;
  ngModelRef: any;
  isUpdate: any;
  constructor(private _firestoreDataService: FirestoreDataService, private modalService: NgbModal) { }

  ngOnInit() {
    if (localStorage.getItem('brand')) {
      const brandDetails = JSON.parse(localStorage.getItem('brand'));
      console.log(brandDetails);
      this.vehicleType = brandDetails.vehicletype;
      this.getAllBrandByVehicleType();
    } else {
      this.vehicleType = 'ctcwAzaVpGYzIhnHNDuq';
      this._firestoreDataService.getVehicleMasterList().subscribe( data => {
        this.vehicleTypeList = data;
        this.getAllBrandByVehicleType();
      });
    }
  }

  getAllBrandByVehicleType() {
    this._firestoreDataService.getAllBrandByVehicleType(this.vehicleType).subscribe( brandList => {
      this.brandList = brandList;
      if (localStorage.getItem('brand')) {
        const brandDetails = JSON.parse(localStorage.getItem('brand'));
        console.log(brandDetails);
        this.brandname = brandDetails.id;
      } else {
        this.brandname = this.brandList[0].id;
      }
      this.getAllModelList();
    });
  }

  getAllModelList() {
    this._firestoreDataService.getAllModels(this.vehicleType, this.brandname).subscribe( data => {
      this.modelList = data;
      console.log(data);
    });
  }

  openModal(content) {
    this.ngModelRef = this.modalService.open(content, { centered: true });
  }

  addNewModel() {
    this._firestoreDataService.addVehicleBrand(this.modelname, this.vehicleType);
    this.ngModelRef.close();
    this.modelname = '';
  }

  closeModal() {
    this.ngModelRef.close();
    this.modelname = '';
    this.isUpdate = false;
  }

  editBrand(modelDetails, content) {
    this.modelname = modelDetails.modelname;
    this.modelId = modelDetails.id;
    this.ngModelRef = this.modalService.open(content, { centered: true});
    this.isUpdate = true;
  }

  updateModel() {
    this._firestoreDataService.updateVehicleBrand(this.modelId, this.modelname, this.vehicleType);
    this.ngModelRef.close();
    this.modelId = '';
    this.modelname = '';
    this.isUpdate = false;
  }

  removeBrand(modelDetails) {
    if (confirm('Are you sure to remove brand')) {
      this._firestoreDataService.removeBrand(modelDetails.id, this.vehicleType);
    }
  }

}
