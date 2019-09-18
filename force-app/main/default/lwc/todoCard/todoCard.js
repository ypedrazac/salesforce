import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class TodoCard extends NavigationMixin(LightningElement) {

 
  @api draggable;
  @api todo;
  @track data = [];

  get data(){
   return (this.todo);
}

handleRemoveElement(){
  const evt = new CustomEvent('itemdelete',{
    detail: this.todo.value.Id
  })

  this.dispatchEvent(evt);
}

handleDragStart() {
  const evt = new CustomEvent('itemdragstart', {
    
    detail: this.todo.value.Id
});

this.dispatchEvent(evt);
}

//handleDrop(){}



}