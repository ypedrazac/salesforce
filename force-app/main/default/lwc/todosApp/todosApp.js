import { LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from "lightning/uiRecordApi";
import USER_ID from "@salesforce/user/Id";
import NAME_FIELD from "@salesforce/schema/User.Name";

export default class TodosApp extends LightningElement {
  @track name;
  @wire(getRecord, {
    recordId: USER_ID,
    fields: [NAME_FIELD]
  })
  wireuser({ error, data }) {
    if (error) {
      this.error = error;
    } else if (data) {
      this.name = data.fields.Name.value;
    }
  }
  handleFocusOut(event) {
    if (event.target.value) {
      this.template.querySelector("lightning-input").disabled = true;
    }
  }

  handleClick(event) {
    let pipelinesAmount;
    this.validForm = true;
    pipelinesAmount = this.template.querySelector("lightning-input").value;
    if (pipelinesAmount > 7 || pipelinesAmount < 0) {
      this.showErrorToast();
    } else {
      event.preventDefault();
      console.log(pipelinesAmount);
      this.template.querySelector("lightning-button").disabled = true;
      this.template
        .querySelector("c-pipelines-card")
        .pipelineHandler(pipelinesAmount);
    }
  }
  showErrorToast() {
    const evt = new ShowToastEvent({
      title: "Input Error",
      message: "Pipelines amount must be between 0 and 7",
      variant: "error",
      mode: "dismissable"
    });
    this.dispatchEvent(evt);
  }
}
