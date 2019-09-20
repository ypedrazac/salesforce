import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class TodoCard extends NavigationMixin(LightningElement) {
  @api draggable;
  @api todo;
  @track data = [];

  get data() {
    return this.todo;
  }

  createEvent(name) {
    const evt = new CustomEvent(name, {
      detail: this.todo.value.Id
    });

    this.dispatchEvent(evt);
  }

  handleRemoveElement() {
    this.createEvent("itemdelete");
  }

  handleDragStart() {
    this.createEvent("itemdragstart");
  }

  handleComplete() {
    this.createEvent("itemcomplete");
  }
  get isRemoved() {
    if (this.todo.value.Status__c === "Deleted") return true;
    return false;
  }
}
