import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonImg, ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { NotesService } from 'src/app/services/notes.service';
import { GuiService } from 'src/app/services/gui.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  @Input('data') data:Note;
  todo: FormGroup;
  @ViewChild('photo') newPhoto:IonImg;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private guiS:GuiService,
    private modalCTRL:ModalController
  ) {
   
  }
  ngOnInit() {
    if(!this.data){
      console.log("Crear nota");
    } else{
      this.todo = this.formBuilder.group({
        title :[this.data.title,[Validators.required,
                    Validators.minLength(1)]],
        description : [this.data.description],
        photo : [this.data.notePhoto]
      })
    }
  }

  async logForm(){
    if(!this.todo.valid) return;
    await this.guiS.showLoading();
    try{
      if(!this.data){
        await this.noteS.addNote({
          title:this.todo.get('title').value,
          description:this.todo.get('description').value,
          notePhoto:this.newPhoto.src
        });
        this.todo.reset("");
        this.guiS.showToast("Place have been insert correctly");
      }else{
        await this.noteS.updateNote(
          {id:this.data.id,
           title:this.todo.get('title').value,
           description:this.todo.get('description').value,
           notePhoto:this.newPhoto.src
          }
        );
        this.guiS.showToast("Place have been update correctly");
      }
    }catch(err){
      console.error(err);
      this.guiS.showToast("something went wrong ;( ","danger");
    } finally{
      this.guiS.hideLoading();
      this.modalCTRL.dismiss( {id:this.data.id,
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        notePhoto:this.newPhoto.src
       });
    }
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
      iVBORw0KGgo: "image/png"
    };
    imageUrl="data:"+signatures.iVBORw0KGgo+";base64,"+imageUrl;
    // Can be set to the src of an image now
    this.newPhoto.src = imageUrl;
    this.newPhoto.alt="";
    flag = true;
    return flag;
  }
}