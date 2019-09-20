import { LightningElement, wire, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin, CurrentPageReference } from "lightning/navigation";
import getTodosByType from "@salesforce/apex/toDo.getTodosByType";

export default class PipelineColumn extends NavigationMixin(LightningElement) {
  @track type;
  @track form = false;
  @track number;
  @track titlelist= [];
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
/*      if(this.titlelist.indexOf(event.target.value) > -1){
        console.log('In array');
        this.dispatchEvent(new ShowToastEvent({
          title: 'Error!!',
          message: 'Title already in column!',
          variant: 'error'
      }),);
      } */
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

  handleRemoveItem(event){
        // passing account id to delete record
        // recordId is required value
        console.log(event.detail);
        deleteRecord(event.detail)
        .then(result => {
            window.console.log('result ====> '+result);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'To Do Deleted Successfully!!',
                variant: 'success'
            }),);

            //delete element from array
            this.todos.splice(this.todos.findIndex(i => i.value.Id === event.detail), 1);
        })
        .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: JSON.stringify(error),
                variant: 'error'
            }),);
        })
    }

    handleCompleteItem(event){
      console.log(event.detail);
      
      
      console.log(JSON.stringify(this.todos));
      //let sourceIndex=  this.todos.findIndex(i => i.value.Id === this.itemId);
      //this.todos.find(todo => todo.value.Id === event.detail).value.Title__c = 'Completed';
      let obj= this.todos.find(todo => todo.value.Id === event.detail);
      const returnedTarget = Object.assign({}, obj);
      returnedTarget.value.Title__c = 'Completed';
      console.log(returnedTarget.value.Title__c);
      console.log(JSON.stringify(returnedTarget));
      //this.todos[sourceIndex].value.Title__c = "Completed";
      for (let i in this.todos) {
        if (this.todos[i].value.Id === event.detail) {
         
          //this.todos[i].value.Title__c = "Completed";
          console.log(this.todos[i].value.Title__c);
           break; //Stop this loop, we found it!
        }
      }
    } 
}
