import { LightningElement, api, track, wire } from 'lwc';
import getTodosGroupedByType from "@salesforce/apex/toDo.getTodosGroupedByType";
export default class PipelinesCard extends LightningElement {
    @track title;
    @track numbers=[];
    @track todos= [];
    @api
    pipelineHandler(pipelinesAmount) {
     var i;
      for (i = 0; i < pipelinesAmount; i++) {
          console.log(i);
          this.numbers.push(i);
      }
      console.log(this.numbers);
      this.template.querySelector('c-pipeline-column').handleColumn(this.numbers);
    }
    
  @wire(getTodosGroupedByType)
  wiredGResult(groupedResult){
    if(groupedResult.data){
        
        this.todos = groupedResult.data.map(task => {
            return { value: task, type: task.Type__c };
          });
          console.log("HIIIII from Pipelines Card " + JSON.stringify(this.todos));
    }
    let o= this.groupBy(this.todos, 'type');
    console.log("GROUPED: "+ JSON.stringify(o.todo));
  }

  groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }
  
  
  

}