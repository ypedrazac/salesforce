import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class TodoCard extends NavigationMixin(LightningElement) {

 
  @api draggable;
  @api todo;
  @track data = [];

  get data(){
   return (this.todo);
}


handleDragStart() {
  console.log('hiii');
  console.log(this.todo.value.Id);
  const evt = new CustomEvent('itemdragstart', {
    
    detail: this.todo.value.Id
});

this.dispatchEvent(evt);
}

//handleDrop(){}



}