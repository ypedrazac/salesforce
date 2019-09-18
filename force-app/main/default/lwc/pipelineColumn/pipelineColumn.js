import { LightningElement, wire, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin, CurrentPageReference } from "lightning/navigation";
import getTodosByType from "@salesforce/apex/toDo.getTodosByType";

export default class PipelineColumn extends NavigationMixin(LightningElement) {
  @track type;
  @track form = false;
  @track number;
  @track todoList;
  @track todos = [];
  @track itemId;
  @track targetId;
  @wire(CurrentPageReference)
  pageRef;

  @wire(getTodosByType, { type: "$type" })
  wiredResult(result) {
    if (result.data) {
      this.todos = result.data.map(task => {
        return { value: task, type: task.Type__c };
      });
    }
  }

  @api
  handleColumn(numbers) {
    var i;
    console.log(numbers);
    for (i = 0; i < numbers.length; i++) {
      this.number = numbers[i];
    }
  }

  
  handleItemDrag(event) {
    event.preventDefault();
    console.log("TO PARENT: " + event.detail);
    this.itemId = event.detail;
  }
  allowDrop(event){
   event.preventDefault();
   }

  handleItemDrop(event) {
    console.log(" RUN ------ handleItemDrop");
    event.preventDefault();
    let array = this.template
      .querySelector(".slds-card")
      .id.split("-");
   
    let suffix = "-" + array[1];
    this.targetId = event.target.todo.value.Id ;

  
    this.template
      .querySelector(`#${this.targetId + suffix}`)
      .parentElement.insertBefore(
        this.template.querySelector(`#${this.itemId + suffix}`),
        this.template.querySelector(`#${this.targetId + suffix}`).nextSibling
      );
      console.log("List of todos: " + JSON.stringify(this.todos));
    console.log(" END ------ handleItemDrop");
    this.reorderList();
    
  }

  reorderList(){
  let sourceIndex=  this.todos.findIndex(i => i.value.Id === this.itemId);
  let targetIndex=  this.todos.findIndex(i => i.value.Id === this.targetId);

  console.log("Source: "+ this.itemId +" "+ sourceIndex);
  console.log("Target: "+ this.targetId +" "+ targetIndex);
  }

  handleFocusOut(event) {
    if (event.target.value) {
      this.template.querySelector("lightning-input").disabled = true;
    }
  }

  handleTypeChange(event) {
    this.type = event.target.value;
    console.log(this.type);
    this.currTypeNumber = event.target.id;
  }
  handleCancel() {
    this.form = false;
  }

  handleSubmit(event) {
    
    if (!event.detail.fields.Type__c) {
      const validation = new ShowToastEvent({
        title: "Validation error",
        message: "Empty Type",
        variant: "error"
      });
      event.preventDefault();
      this.dispatchEvent(validation);
    }
  }

  handleSuccess(event) {
    console.log("Record iD" + event.detail.id);

    const newTodo = {
      value: {
        Id: event.detail.id,
        Description__c: event.detail.fields.Description__c.value,
        Type__c: event.detail.fields.Type__c.value,
        Status__c: event.detail.fields.Status__c.value,
        Title__c: event.detail.fields.Title__c.value
      },
      type: event.detail.fields.Title__c.value
    };
    console.log(newTodo);

    const evt = new ShowToastEvent({
      title: "Account created",
      message: "Record ID: " + event.detail.id,
      variant: "success"
    });

    this.todos.push(newTodo);
    this.form = false;

    this.type = event.detail.fields.Type__c.value;
    this.template.querySelector("lightning-input").value = this.type;
    this.template.querySelector("lightning-input").disabled = true;

    this.dispatchEvent(evt);
  }

  handleClick() {
    this.form = true;
  }
}
