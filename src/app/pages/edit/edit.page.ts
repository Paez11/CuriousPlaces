import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from 'src/app/model/note';
import { GuiService } from 'src/app/services/gui.service';
import { NotesService } from 'src/app/services/notes.service';

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
    private gui:GuiService
  ) {
}  
ngOnInit(): void {
  if(!this.data){
    console.log();
  }else{
    console.log();
  }
  this.todo = this.formBuilder.group({
    title :[this.data.title,[Validators.required,
                Validators.minLength(5)]],
    description : [this.data.description]
  })
  }

  public async logForm(){
    if(!this.todo.valid) return;
    await this.gui.showLoading();
    try{
      if(!this.data){
        await this.noteS.addNote({
          title:this.todo.get('title').value,
          description:this.todo.get('description').value
        });
        this.todo.reset("");
        this.gui.showToast("¡Nota insertada correctamente!");
      }else{
        await this.noteS.updateNote(
          {
            id:this.data.id,
            title:this.data.title,
            description:this.data.description
          }
        )
      }
      }catch(err){
        console.error(err);
        this.gui.showToast(" Algo ha ido mal ;( ","danger");
      } finally{
        this.gui.hideLoading();
      }
  }
}

