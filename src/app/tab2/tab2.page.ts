import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { GuiService } from '../services/gui.service';

import { Camera, CameraResultType } from '@capacitor/camera';
import { IonImg } from '@ionic/angular';

import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('photo') photo:IonImg;
  todo: FormGroup;
  map: Leaflet.Map;
  lat: any;
  long: any;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private gui:GuiService
  ) {
    this.todo = this.formBuilder.group({
      title :['',[Validators.required,
                  Validators.minLength(1)]],
      description : [''],
      photo : ['']
    })
  }
  public async logForm(){
    if(!this.todo.valid) return;
    await this.gui.showLoading();
    //this.getCoordenates();
    try{
      await this.noteS.addNote({
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        notePhoto:this.photo.src
        //latitud:this.lat,
        //longitud:this.long
      });
      this.todo.reset("");
      this.photo.alt;
      this.gui.showToast("Place have been insert correctly");
    }catch(err){
      console.error(err);
      this.gui.showToast("something went wrong ;( ","danger");
    } finally{
      this.gui.hideLoading();
    }
    
    
  }

  public getCoordenates(){
    this.map.locate({
      enableHighAccuracy: true,
      maximumAge: 3600
    }).on((e) => {
      this.lat = e.latitude;
      this.long = e.longitude;
      }).on((err) => {
        alert(err.message);
    })
  }

  public async takePhoto():Promise<Boolean>{
    let flag:boolean = false;
    const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Base64,
    })
    
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    let imageUrl = image.base64String;

    var signatures = {
      iVBORw0KGgo: "image/png",
      "/9j/": "image/jpg"
    };
    if (imageUrl.charAt(0)=="/") {
      imageUrl="data:"+signatures['/9j/']+";base64,"+imageUrl;
    }else{
      imageUrl="data:"+signatures.iVBORw0KGgo+";base64,"+imageUrl;
    }
    // Can be set to the src of an image now
    this.photo.src = imageUrl;
    this.photo.alt="";
    flag = true;
    return flag;
  }

}