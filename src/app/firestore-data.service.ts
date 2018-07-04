import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from './models/vehicles';
import { Variant} from './models/variants';
import { Model } from './models/models';
import 'rxjs/add/operator/map';
import { Service } from './models/services';
import { SubService } from './models/subServices';

@Injectable({
  providedIn: 'root'
})

export class FirestoreDataService implements OnInit {
  models: Observable<Model[]>;
  servicesList: Observable<Service[]>;
  subServicesList: Observable<SubService[]>;
  model: Model;
  private vehiclesTypesList: any;
  variants: Observable<Variant[]>;
  private allBrandsByVehicleType: any;
  constructor(private afs: AngularFirestore, private db: AngularFireDatabase,
  private _loadingBar: SlimLoadingBarService) {}

  ngOnInit() {}

  getAllServiceListWithoutFilter(): Observable<any> {
    this.servicesList = this.afs.collection('service_master').snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Service;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.servicesList;
  }

  getServicesList(selectedVehicleType): Observable<any> {
    this.servicesList = this.afs.collection('service_master', ref => ref.where('vehicle_type_id',
    '==', selectedVehicleType))
    .snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Service;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.servicesList;
  }

  addServicesToVariant(subServiceList, selectedVehicleType, selectedBrand, selectedModel, variantname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(selectedBrand).collection('model')
    .doc(selectedModel).collection('variant')
    .add({
        'services': subServiceList,
        'variantname': variantname
      })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateServiceToVariant(subServiceList, selectedVehicleType, selectedBrand, selectedModel, selectedVariant, variantname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(selectedBrand).collection('model')
    .doc(selectedModel).collection('variant')
    .doc(selectedVariant)
    .set({
        'services': subServiceList,
        'variantname': variantname
      })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  getAllSubServiceList(selectedService): Observable<SubService[]> {
    this.subServicesList = this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as SubService;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.subServicesList;
  }
  getSubServicesList(selectedService): Observable<any> {
    this.subServicesList = this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as SubService;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.subServicesList;
  }

  getVehicleMasterList(): Observable<any> {
    this.vehiclesTypesList = this.afs.collection('vehicle').snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Vehicle;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.vehiclesTypesList;
  }

  getAllBrandByVehicleType(vehicleTypeId): any {
    this.allBrandsByVehicleType =  this.afs.collection('vehicle').doc(vehicleTypeId).collection('brand').snapshotChanges()
    .map( (actions, index) => {
      return actions.map(action => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.allBrandsByVehicleType;
  }

  getAllModels(vehicleType, brandId): Observable<any> {
    this.models = this.afs.collection<Vehicle>('vehicle')
    .doc(vehicleType).collection('brand')
    .doc(brandId).collection<Model>('model')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Model;
        const id = action.payload.doc.id;
        return { id, ...data} ;
      });
    });
    return this.models;
  }

  getAllVariant(selectedVehicleType, selectedBrand, selectedModel): Observable<any> {
    this.variants = this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(selectedBrand).collection('model')
    .doc(selectedModel).collection('variant')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Variant;
        const id = action.payload.doc.id;
        return { id, ...data} ;
      });
    });
    return this.variants;
  }

  getTaskList(selectedService, selectedSubService, task): Observable<any> {
    this.variants = this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService).collection('task')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Variant;
        const id = action.payload.doc.id;
        return { id, ...data} ;
      });
    });
    return this.variants;
  }

  addService(service): void {
    console.log('addService params ', service);
    let result: any;
    this.afs.collection('service_master')
    .add(
      {'service_display_name': service.service_display_name,
      'service_name': service.service_name,
      'vehicle_type': service.vehicle_type,
      'vehicle_type_id': service.vehicle_type_id
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addVehicleBrand(brandValue, selectedVehicleType): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .add({'brandname': brandValue})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addVehicleModel(selectedVehicleType, brandId, modelname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model')
    .add({'modelname': modelname})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addVehicleVariant(selectedVehicleType, brandId, modelId, variantname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model')
    .doc(modelId).collection('variant')
    .add({'variantname': variantname})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addSubService(selectedService, subService): void {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .add({
      'sub_service_display_name': subService.sub_service_display_name,
      'sub_service_name': subService.sub_service_name})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addTask(selectedService, selectedSubService, task): void {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService).collection('task')
    .add({
      'task_description': task.task_description,
      'task_name': task.task_name
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateVehicleBrand(brandId, brandname, selectedType) {
    let result: any;
    this.afs.collection('vehicle').doc(selectedType)
    .collection('brand').doc(brandId)
    .set({
      brandname: brandname
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateService(selectedService, service) {
    console.log('updateService params ', service);
    let result: any;
    this.afs.collection('service_master').doc(selectedService)
    .set({
      'service_display_name': service.service_display_name,
      'service_name': service.service_name,
      'vehicle_type': service.vehicle_type,
      'vehicle_type_id': service.vehicle_type_id
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateSubService(selectedService, subServiceId, subService) {
    let result: any;
    this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service').doc(subServiceId)
    .set({
      'sub_service_display_name': subService.sub_service_display_name,
      'sub_service_name': subService.sub_service_name
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateTask(selectedService, selectedSubService, taskId, task) {
    let result: any;
    this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service').doc(selectedSubService)
    .collection('task').doc(taskId)
    .set({
      'task_description': task.task_description,
      'task_name': task.task_name
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateModel(selectedVehicleType, brandId, modelId, modelname) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .set({
      modelname: modelname
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateVariant(selectedVehicleType, brandId, modelId, variantId, variantname) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .collection('variant').doc(variantId)
    .set({
      variantname: variantname
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeBrand(brandId, selectedVehicleType) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeModel(selectedVehicleType, brandId, modelId) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeVariant(selectedVehicleType, brandId, modelId, variantId) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .collection('variant').doc(variantId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeMainService(selectedService) {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeSubService(selectedService, selectedSubService) {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeTask(selectedService, selectedSubService, taskId) {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService).collection('task')
    .doc(taskId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

}
