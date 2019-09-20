import { LightningElement, api, track } from "lwc";
export default class PipelinesCard extends LightningElement {
  @track title;
  @track numbers = [];
  @track todos = [];
  @track titlelist = [];
  @api
  pipelineHandler(pipelinesAmount) {
    var i;
    for (i = 0; i < pipelinesAmount; i++) {
      console.log(i);
      this.numbers.push(i);
    }
    this.template.querySelector("c-pipeline-column").handleColumn(this.numbers);
  }

  groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }
}
