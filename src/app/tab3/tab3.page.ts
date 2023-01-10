import { Component, ElementRef, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonImg } from '@ionic/angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('foto') foto:IonImg;
  constructor() {}

  public async takePhoto(){
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,

    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    let imageUrl = image.base64String;
    var signatures = {
      
    }
  
    // Can be set to the src of an image now

    this.foto.src = imageUrl;
  }

}
