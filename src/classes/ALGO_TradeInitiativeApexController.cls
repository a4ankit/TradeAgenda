public class ALGO_TradeInitiativeApexController {
    //This method used to return List of TradeInitiatives records which are not in current CallAgendaItem's trade initiative list
    @AuraEnabled
    public static List<CP_TradeInitiative__c> getTradeInitiativeRecords(List<String> existingTradeItemIds){
        system.debug('existingTradeItemIds: ' + existingTradeItemIds.size());
        List<CP_TradeInitiative__c> initiatives = [Select Name, Id, EffectiveStartDate__c, EffectiveEndDate__c, MyAddy__Sponsor__c, MyAddy__Sponsor__r.Name  
                                                   from CP_TradeInitiative__c
                                                   where Id Not in : existingTradeItemIds
                                                   ORDER BY EffectiveEndDate__c ASC NULLS last];
        system.debug('initiatives: ' + initiatives.size());
        return initiatives;
        
    }
    
    //This method used to fetch searched Trade initiatives user user// NO LONGER NEEDED
    
    @AuraEnabled
        public static List<CP_TradeInitiative__c> FetchSearchedTradeInitiatives(String searchedKeyword){
            String searchKey = searchedKeyword + '%';
            if(searchKey != null && searchKey !=''){
                List<CP_TradeInitiative__c> initiatives = [Select Name, Id, EffectiveStartDate__c, EffectiveEndDate__c, Sponsor__c, Sponsor__r.Name  
                from CP_TradeInitiative__c WHERE Name LIKE: searchKey
                ORDER BY EffectiveEndDate__c ASC NULLS last LIMIT 50000];
                system.debug('initiatives: ' + initiatives);
                return initiatives;
            }else{
                return null;
            }
        }
    
    //This method is used to return all associated CallAgendaItem related to current TradeCallAgenda
    @AuraEnabled
    public static List<CP_TradeCallAgendaItem__c> getChildTradeItems(String TradeCallAgendaId)
    {
        system.debug('TradeCallAgendaId=='+TradeCallAgendaId);
        if(TradeCallAgendaId !=null){
            List<CP_TradeCallAgendaItem__c> TradeCallItemList = [Select Id, Name, TradeCallAgenda__c, MyAddy__TradeInitiative__c , MyAddy__TradeInitiative__r.Name, MyAddy__TradeInitiative__r.EffectiveEndDate__c,  MyAddy__TradeInitiative__r.EffectiveStartDate__c, MyAddy__TradeInitiative__r.Sponsor__r.Name from CP_TradeCallAgendaItem__c where TradeCallAgenda__c =: TradeCallAgendaId];
            system.debug('TradeCallItemList=='+TradeCallItemList);
            return TradeCallItemList;
        }else{
            return null;
        }
    }
    //This method used to delete selected TradeAgendaItems, based on two give following parameters:
    // 1. TradeCallAgendaId : Current Trade Call Agenda Record Id
    // 2. AgendaItemId      : Selected TradeAgendaItem's Id
    @AuraEnabled
    public static CP_TradeInitiative__c getDeleteSelectedItem(String TradeCallAgendaId, String AgendaItemId){
        try{
            system.debug('AgendaItemId==='+AgendaItemId+'TradeCallAgendaId=='+TradeCallAgendaId);
            if(AgendaItemId !=null && AgendaItemId !='' && TradeCallAgendaId !=null && TradeCallAgendaId != ''){
                CP_TradeInitiative__c objRelatedTradeInitiative = new CP_TradeInitiative__c();
                CP_TradeCallAgendaItem__c objAgendaItem = [select id,TradeCallAgenda__c, TradeInitiative__c
                                                           , TradeInitiative__r.Id
                                                           , TradeInitiative__r.Name
                                                           , TradeInitiative__r.Sponsor__c
                                                           , TradeInitiative__r.Sponsor__r.Name
                                                           , TradeInitiative__r.EffectiveStartDate__c
                                                           , TradeInitiative__r.EffectiveEndDate__c
                                                           from CP_TradeCallAgendaItem__c where id =: Id.valueof(AgendaItemId) AND TradeCallAgenda__c =: Id.valueOf(TradeCallAgendaId) LIMIT 1];
                system.debug('objAgendaItem=='+objAgendaItem);
                if(objAgendaItem !=null){
                    system.debug('objAgendaItem.TradeInitiative__r=='+objAgendaItem.TradeInitiative__r);
                    if(objAgendaItem.TradeInitiative__r !=null){
                        objRelatedTradeInitiative = objAgendaItem.TradeInitiative__r;
                    }
                    delete objAgendaItem;
                }
                system.debug('objRelatedTradeInitiative=='+objRelatedTradeInitiative);
                return objRelatedTradeInitiative;
            }else{
                return null;
            }
        }catch (DmlException ex){
            system.debug('Exception comes during delete the selected record :' +ex.getMessage());
            return null;
        }
        
    }
    
    //This method used to fire on "Add Selected to Agenda" button, with following parameters:
    // 1. TradeCallAgendaId   : Current Trade Call Agenda Record Id
    // 2. TradeInitiatives    : Array of Selected checked TradeAgendaItem records
    // Description : It used to move selected TradeInitiatives to Current TrageAgenda.
    @AuraEnabled
    public static List<CP_TradeCallAgendaItem__c> getSelectedInitiativeToCurrentAgenda(String TradeCallAgendaId, List<CP_TradeInitiative__c> TradeInitiatives){
        try{
            system.debug('TradeCallAgendaId--'+TradeCallAgendaId+'TradeInitiatives=='+TradeInitiatives);
            if(TradeCallAgendaId != null && TradeCallAgendaId !='' && TradeInitiatives !=null && !TradeInitiatives.isEmpty()){
                //Iterate all selected TradeInitiative list
                List<CP_TradeCallAgendaItem__c> lstRecordsToReturn = new List<CP_TradeCallAgendaItem__c>();
                for(CP_TradeInitiative__c objTradeInitiative : TradeInitiatives){
                    CP_TradeCallAgendaItem__c objAgendaItem = new CP_TradeCallAgendaItem__c(
                        Name = objTradeInitiative.Name , 
                        MyAddy__TradeCallAgenda__c = Id.valueOf(TradeCallAgendaId) ,
                        MyAddy__TradeInitiative__c = objTradeInitiative.Id,
                        MyAddy__InitiativeEndDate__c = objTradeInitiative.MyAddy__EffectiveEndDate__c,
                        MyAddy__InitiativeStartDate__c = objTradeInitiative.MyAddy__EffectiveStartDate__c
                        
                    );
                    lstRecordsToReturn.add(objAgendaItem);
                }
                system.debug('lstRecordsToReturn==='+lstRecordsToReturn);
                if(!lstRecordsToReturn.isEmpty()){
                    insert lstRecordsToReturn;
                    return lstRecordsToReturn;
                }else{return null;}
            }else{
                return null;
            }
        }catch (DmlException ex){
            system.debug('Exception comes during perform the action:' +ex.getMessage());
            return null;
        }
        
    }
}