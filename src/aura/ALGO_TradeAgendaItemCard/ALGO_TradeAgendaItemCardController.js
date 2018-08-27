({
    deleteItem : function(component, event, helper) {
        event.stopPropagation();
        var selectedIndex = component.get("v.selectedCardIndex");
        var currentAgendaList = component.get("v.AvailableagendaItems");
        console.log('selectedId=='+component.get("v.item").Id);
        //Call server side controller to delete selected agenda item
        var action = component.get("c.getDeleteSelectedItem");
        action.setParams({ AgendaItemId : component.get("v.item").Id 
                          ,TradeCallAgendaId : component.get("v.item").MyAddy__TradeCallAgenda__c});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(response.getReturnValue()){
                    console.log('esponce123JSON'+response.getReturnValue().MyAddy__Sponsor__r.Name);
                    console.log('esponcString'+JSON.stringify(response.getReturnValue()));
                    currentAgendaList.splice(selectedIndex, 1);
                    component.set("v.AvailableagendaItems", currentAgendaList);
                    console.log('2222'+component.get("v.AvailableagendaItems"));
                }
            } 
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action); 
    }
})