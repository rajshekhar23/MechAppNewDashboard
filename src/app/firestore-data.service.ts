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
  /*
  getModelDetailByBrand(brandId): Observable<any> {
    this.models = this.afs
      .collection<Vehicle>('vehiclemaster')
      .doc(brandId)
      .collection<Model>('model')
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Model;
          const id = action.payload.doc.id;
          data['variants'] = [];
          this.afs.collection<Vehicle>('vehiclemaster')
          .doc(brandId).collection<Model>('model')
          .doc(id).collection<Variant>('variants').ref.get()
          .then( res => {
            console.log(res);
            if (res.docChanges().length !== 0) {
              res.docChanges().map( document => {
                const variantObject = {};
                if ((document.doc.data() as Variant).variantname) {
                  variantObject['variantName'] = (document.doc.data() as Variant).variantname;
                  variantObject['variantId'] = document.doc.id;
                  data['variants'].push(variantObject);
                } else {
                  data['variants'] = [];
                }
              });
            }
          });
          console.log(data);
          return { id, ...data , ...data['variants']};
        });
      });
    return this.models;
  }
*/
/*   addVehicleBrand(brandValue, selectedVehicleType): void {
    console.log(brandValue);
    console.log(selectedVehicleType);
    let result: any;
    this.afs.collection('vehiclemaster')
    .add({'brand': brandValue, 'vehicletype': selectedVehicleType})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }
 */

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

}
