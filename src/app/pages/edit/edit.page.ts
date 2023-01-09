import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { NotesService } from 'src/app/services/notes.service';
import { GuiService } from 'src/app/services/gui.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  @Input('data') data:Note;
  todo: FormGroup;
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
                    Validators.minLength(5)]],
        description : [this.data.description]
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
          description:this.todo.get('description').value
        });
        this.todo.reset("");
        this.guiS.showToast("¡Nota insertada correctamente!");
      }else{
        await this.noteS.updateNote(
          {id:this.data.id,
           title:this.todo.get('title').value,
           description:this.todo.get('description').value
          }
        );
        this.guiS.showToast("¡Nota actualizada correctamente!");
      }
    }catch(err){
      console.error(err);
      this.guiS.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.guiS.hideLoading();
      this.modalCTRL.dismiss( {id:this.data.id,
        title:this.todo.get('title').value,
        description:this.todo.get('description').value
       });
    }
  }
}