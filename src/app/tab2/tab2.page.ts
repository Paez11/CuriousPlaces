import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { GuiService } from '../services/gui.service';
import { photoService } from '../services/photo.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonImg } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('photo') photo:IonImg;
  todo: FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private photoS:photoService,
    private gui:GuiService
  ) {
    this.todo = this.formBuilder.group({
      title :['',[Validators.required,
                  Validators.minLength(5)]],
      description : ['']
    })
  }
  public async logForm(){
    if(!this.todo.valid) return;
    await this.gui.showLoading();
    try{
      await this.noteS.addNote({
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        notePhoto:this.photo.src
      });
      this.todo.reset("");
      this.photo.alt;
      this.gui.showToast("¡Nota insertada correctamente!");
    }catch(err){
      console.error(err);
      this.gui.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.gui.hideLoading();
    }
    
    
  }

  public async takePhoto(){
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
    iVBORw0KGgo: "image/png"
  };
  imageUrl="data:"+signatures.iVBORw0KGgo+";base64,"+imageUrl;
  // Can be set to the src of an image now
  this.photo.src = imageUrl;
  this.photo.alt=" w ";
}

public async uploadPhoto(){
  this.photoS.addPhoto({data:this.photo.src});

}

}