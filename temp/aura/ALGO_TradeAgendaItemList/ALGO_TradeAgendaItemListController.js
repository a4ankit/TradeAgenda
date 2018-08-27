({
	doInit : function(component, e, h) {
		var action = component.get("c.getChildTradeItems");
        action.setParams({
            'TradeCallAgendaId': component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS'){             
                component.set("v.agendaItems", response.getReturnValue());   
            }else if (state === 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }else{
                console.log('Something went wrong, Please check with support if you need assistance');
            }
        });
        $A.enqueueAction(action);
    },
    
    doAddAllCurrent : function (component, event, helper){
        
        var numbers = component.get("v.agendaItems");
        console.log('venet========'+event.getSource());
        var params = event.getParams();
        console.log('params:::::'+JSON.stringify(params));
        var jsonformatevalue;
        for (var i = 0; i < params.TradeInitiatives.length; i++) {
			//console.log('params.TradeInitiatives[i].Name=='+JSON.stringify(params.TradeInitiatives[i]));
			//console.log('1233'+params.TradeInitiatives[i].TradeInitiative__c);
            //jsonformatevalue = '{"Id":"'+params.Id+'","Name":"'+params.Name+'","TradeInitiative__c":"'+params.TradeInitiatives[i].TradeInitiative__c+'","TradeInitiative__r":{"Name":"'+params.TradeInitiatives[i].TradeInitiative__r.Name+'","EffectiveEndDate__c":"'+params.TradeInitiatives[i].TradeInitiative__r.EffectiveEndDate__c+'","EffectiveStartDate__c":"'+params.TradeInitiatives[i].TradeInitiative__r.EffectiveStartDate__c+'","Sponsor__c":"'+params.TradeInitiatives[i].TradeInitiative__r.Sponsor__c+'","Id":"'+params.TradeInitiatives[i].TradeInitiative__c+'","Sponsor__r":{"Name":"'+params.TradeInitiatives[i].TradeInitiative__r.Sponsor__r.Name+'","Id":"'+params.TradeInitiatives[i].TradeInitiative__r.Sponsor__c+'"}}}';
            //var JSONobj = JSON.parse(jsonformatevalue);
            //console.log('jsonformatevalue==='+jsonformatevalue);
            numbers.push({params
                
            });
            // numbers.push({
              //  Name: params.TradeInitiatives[i].Name,
                //TradeInitiative__r.Sponsor__r.Name: params.TradeInitiatives[i].Sponsor__r.Name,
                //TradeInitiative__r.Name: params.TradeInitiatives[i].Name,
                //TradeInitiative__r.EffectiveStartDate__c: params.TradeInitiatives[i].EffectiveStartDate__c,
                //TradeInitiative__r.EffectiveEndDate__c: params.TradeInitiatives[i].EffectiveEndDate__c,
              //  hasAttachment: params.TradeInitiatives[i].hasAttachment
           // });
        }
        component.set("v.agendaItems", numbers); 
    
    },
    
    createRecord: function(cmp, e, h) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
             "entityApiName": "MyAddy__CP_TradeCallAgendaItem__c",
        });
        createRecordEvent.fire();
    },
    navToRecord: function (component, event, helper){
        console.log('NavigateCardCall++++');
    },
    doDeleteSelectedCard: function(component, event, helper){
        console.log('doDeleteSelectedCard++++');
        var evCmp = component.getEvent("DelCardEntReceiver");
        console.log('evCmp=='+evCmp);
        var isDelete = evCmp.getParam("isDeleted");
        console.log('isDelete=='+isDelete);
        if(isDelete){
        	var selectedIndex = evCmp.getParam("selectedItemCardIndex");
            console.log('selectedIndex=='+selectedIndex);
            var currentAgendaList = component.get("v.agendaItems");
            currentAgendaList.splice(selectedIndex, 1);
            component.set("v.agendaItems", currentAgendaList);
        }

    }
})