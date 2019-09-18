public with sharing class toDo {
    @AuraEnabled(Cacheable = true)
    public static List<Todo__c> getTodosByType(String type){
         return [Select Id, Description__c, Title__c, Status__c, Type__c from Todo__c Where Type__c like :type];
  
    }
}