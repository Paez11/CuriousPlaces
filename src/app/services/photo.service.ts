import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { photo } from '../model/photo';

@Injectable({
  providedIn: 'root'
})
export class photoService {

  private lastDoc : QueryDocumentSnapshot<any>;
  private dbPath: string = 'photos';
  private dbRef: AngularFirestoreCollection<any>
  constructor(private db: AngularFirestore) {
    this.dbRef = this.db.collection(this.dbPath);
  }

  imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  public async addPhoto(photo:photo): Promise<photo> {
    let newFoto = await this.dbRef.add(photo);
    return photo;
}

  async storeImage(imageData:any) {
    try {
      const imageName = this.imageName();
    }catch (error) {
      console.log("No se ha podido guardar la imagen");
    }
  }
}
