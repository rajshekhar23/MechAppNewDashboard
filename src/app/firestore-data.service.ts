import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from './models/vehicles';
import { Variant} from './models/variants';
import { Model } from './models/models';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})

export class FirestoreDataService implements OnInit {
  models: Observable<Model[]>;
  model: Model;
  private vehiclesTypesList: any;
  variants: Observable<Variant[]>;
  private allBrandsByVehicleType: any;
  constructor(private afs: AngularFirestore, private db: AngularFireDatabase,
  private _loadingBar: SlimLoadingBarService) {}

  ngOnInit() {}

  getVehicleMasterList(): Observable<any> {
    this._loadingBar.start();
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

  funcRemoveModel() {
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

  updateModel(selectedVehicleType, brandId, modelId, modelname) {
    console.log('params in updateModel ', selectedVehicleType + ' ## ' + brandId  + ' ## ' + modelId  + ' ## ' + modelname);
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
    console.log('params in updateVariant ', selectedVehicleType + ' ## ' + brandId  + ' ## ' + modelId  + ' ## ' + variantname);
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

}
