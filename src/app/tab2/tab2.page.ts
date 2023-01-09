import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { GuiService } from '../services/gui.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  todo: FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
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
        description:this.todo.get('description').value
      });
      this.todo.reset("");
      this.gui.showToast("¡Nota insertada correctamente!");
    }catch(err){
      console.error(err);
      this.gui.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.gui.hideLoading();
    }
    
    
  }

}