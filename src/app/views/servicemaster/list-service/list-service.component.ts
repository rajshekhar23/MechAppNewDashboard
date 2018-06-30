import { Task } from './../../../models/task';
import { SubService } from './../../../models/subServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreDataService } from './../../../firestore-data.service';
import { Service } from './../../../models/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.scss']
})
export class ListServiceComponent implements OnInit {
  serviceList: Service[];
  subServiceList: SubService[];
  taskList: Task[];
  vehicleTypeList: any;
  selectedVehicleType: string;
  selectedService: string;
  selectedSubService: string;
  serviceId: string;
  taskId: string;
  task: any;
  subServiceId: string;
  isServiceListEmpty: any;
  isTaskListEmpty: any;
  service: any;
  subService: any;
  isSubServiceListEmpty: any;
  servicename: string;
  ngModelRef: any;
  isUpdate: any;
  constructor(private _firestoreDataService: FirestoreDataService, private modalService: NgbModal) { }

  ngOnInit() {
    this.service = {};
    this.subService = {};
    this.task = {};
    this.selectedVehicleType = 'pM0luQDMCvCvDxJcedDn';
    this._firestoreDataService.getVehicleMasterList().subscribe( data => {
      this.vehicleTypeList = data;
      this.getServicesList();
    });
  }

  getServicesList() {
    this._firestoreDataService.getServicesList(this.selectedVehicleType).subscribe( data => {
      this.serviceList = data;
      if (this.serviceList.length !== 0) {
        this.isServiceListEmpty = false;
        this.selectedService = this.serviceList[0].id;
        this.getSubServicesList();
      } else {
        this.isServiceListEmpty = true;
      }
    });
  }

  closeModal() {
    this.ngModelRef.close();
    this.isUpdate = false;
  }

  getSubServicesList() {
    this._firestoreDataService.getSubServicesList(this.selectedService).subscribe( data => {
      this.subServiceList = data;
      if (this.subServiceList.length !== 0) {
        this.isSubServiceListEmpty = false;
        this.selectedSubService = this.subServiceList[0].id;
        this.getTaskList();
      } else {
        this.isSubServiceListEmpty = true;
      }
    });
  }

  getTaskList() {
    this._firestoreDataService.getTaskList(this.selectedService, this.selectedSubService,
     this.task).subscribe( data => {
       console.log(data);
       this.taskList = data;
      if (this.taskList.length !== 0) {
        this.isTaskListEmpty = false;
      } else {
        this.isTaskListEmpty = true;
      }
    });
  }

  showVariantsList(SubServiceDetails) {

  }

  showSubServicesList(serviceDetails) {
    this.selectedService = serviceDetails.id;
    this.getSubServicesList();
  }

  getSelectedServiceTypeText() {
    let vehicleTypeText = '';
    this.serviceList.forEach(service => {
      if (service.vehicle_type_id === this.selectedVehicleType) {
        vehicleTypeText = service.vehicle_type;
      }
    });
    return vehicleTypeText;
  }

  addNewService() {
    const selectedVehicleTypeText = this.getSelectedServiceTypeText();
    this.service.vehicle_type = selectedVehicleTypeText;
    this.service.vehicle_type_id = this.selectedVehicleType;
    this._firestoreDataService.addService(this.service);
    this.service = {};
    this.ngModelRef.close();
  }

  addNewSubService() {
    this._firestoreDataService.addSubService(this.selectedService, this.subService);
    this.subService = {};
    this.ngModelRef.close();
  }

  addTask() {
    this._firestoreDataService.addTask(this.selectedService, this.selectedSubService, this.task);
    this.task = {};
    this.ngModelRef.close();
  }

  updateService() {
    this.service.vehicle_type_id = this.selectedVehicleType;
    this.service.vehicle_type = this.getSelectedServiceTypeText();
    this._firestoreDataService.updateService(this.serviceId, this.service);
    this.isUpdate = false;
    this.ngModelRef.close();
    this.service = {};
  }

  updateSubService() {
    this._firestoreDataService.updateSubService(this.selectedService, this.subServiceId, this.subService);
    this.isUpdate = false;
    this.ngModelRef.close();
    this.subService = {};
  }

  updateTask() {
    this._firestoreDataService.updateTask(this.selectedService, this.selectedSubService, this.taskId, this.task);
    this.isUpdate = false;
    this.ngModelRef.close();
    this.task = {};
  }

  editMainService(serviceDetails, content) {
    this.isUpdate = true;
    this.serviceId = serviceDetails.id;
    this.ngModelRef = this.modalService.open(content, {centered: true});
    this.service.service_display_name = serviceDetails.service_display_name;
    this.service.service_name = serviceDetails.service_name;
    this.service.vehicle_type = serviceDetails.vehicle_type;
  }

  editSubService(subServiceDetails, content) {
    this.isUpdate = true;
    this.subServiceId = subServiceDetails.id;
    this.ngModelRef = this.modalService.open(content, {centered: true});
    this.subService.sub_service_display_name = subServiceDetails.sub_service_display_name;
    this.subService.sub_service_name = subServiceDetails.sub_service_name;
  }

  editTask(taskDetails, content) {
    this.isUpdate = true;
    this.taskId = taskDetails.id;
    this.ngModelRef = this.modalService.open(content, {centered: true});
    this.task.task_description = taskDetails.task_description;
    this.task.task_name = taskDetails.task_name;
  }

  removeMainService(serviceDetails) {
    if (confirm('Are you sure to remove service')) {
      this._firestoreDataService.removeMainService(serviceDetails.id);
      this.getServicesList();
    }
  }

  removeSubService(subServiceDetails) {
    if (confirm('Are you sure to remove sub service')) {
      this._firestoreDataService.removeSubService(this.selectedService, subServiceDetails.id);
      this.getSubServicesList();
    }
  }

  removeTask(taskDetails) {
    if (confirm('Are you sure to remove sub service')) {
      this._firestoreDataService.removeTask(this.selectedService, this.selectedSubService, taskDetails.id);
      this.getSubServicesList();
    }
  }

  openModal(content) {
    this.service = {};
    this.subService = {};
    this.task = {};
    this.isUpdate = false;
    this.ngModelRef = this.modalService.open(content, { centered: true });
  }
}
