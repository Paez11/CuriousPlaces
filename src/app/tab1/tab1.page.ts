import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Note } from '../model/note';
import { NotesService } from '../services/notes.service';
import { GuiService } from '../services/gui.service';
import { EditPage } from '../pages/edit/edit.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('infinitescroll') infinitescroll : ElementRef;
  public notes:Note[] =[];
  constructor(private noteS:NotesService,
    private gui:GuiService, private modalCtrl: ModalController) {

  }
  async ngOnInit(){
    await this.gui.showLoading();
    this.notes = await this.noteS.getNotes(true);
    this.gui.hideLoading();
  }
  async ionViewDidEnter(){  //ejecutado una vez la página está cargada
   /* await this.uiS.showLoading();
    this.notes = await this.noteS.getNotes(true);
    this.uiS.hideLoading();*/
  }
  public async editNote(note:Note){
    const modal = await this.modalCtrl.create({
      component: EditPage,
      componentProps: {data:note}
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();
    if(!role){
      //actualizar
      this.notes=this.notes.map((e) =>{
        if(e.id==data.id){
          return data;
        }else{
          return e;
        }
      })
    }
  }
  public async loadNotes(event){
    this.notes = await this.noteS.getNotes(true);
    event.target.complete();
   // (this.infinitescroll.nativeElement as IonInfiniteScroll).disabled=false;
  }
  public async loadMoreNotes(event){
    let newNotes:Note[] = await this.noteS.getNotes();
    this.notes=this.notes.concat(newNotes);
    (event as InfiniteScrollCustomEvent).target.complete();
    //if(newNotes.length<10) (event.target as IonInfiniteScroll).disabled = true;
  }
  public deleteNote(note){
    note.hided = true;
    
    const timeout = setTimeout(()=>{
      this.noteS.removeNote(note.id);
      this.notes = this.notes.filter(n=> n.id!=note.id);
    },3000);
    this.gui.showToastOptions("undo delete",()=>{
      clearTimeout(timeout); //cancelada la cuenta atrás para el borrado en ddbb
      note.hided=undefined;
    });

  }


}