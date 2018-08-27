({
	doInit : function(component, event, helper) {		                
        helper.getDataHelper(component, event);
    },
    
    updateColumnSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
      },
    
    handleRowAction: function (cmp, e, h) {
      	h.handleAction(cmp, e, h);  
    },
    
     updateSelectedText : function(component, event, helper){
        var selectedRows = event.getParam('selectedRows');
        //  console.log('selectedRows'+selectedRows);
        component.set("v.selectedRowsCount" ,selectedRows.length );
        let obj =[] ; 
        for (var i = 0; i < selectedRows.length; i++){
            
            obj.push({Name:selectedRows[i].Name});
            
        }
        
        
        component.set("v.selectedRowsDetails" ,JSON.stringify(obj) );
        component.set("v.selectedRowsList" ,event.getParam('selectedRows') );
         console.log("v.selectedRowsList", component.get('v.selectedRowsList'));
        
    },
    handleSelect: function (component, event, helper) {
        var arr = component.get('v.data');
        var obj =  component.get("v.selectedRowsList");
        console.log('obj '+JSON.stringify(obj) );
        var selectedButtonLabel = event.getSource().get("v.label");
        
    },
    Search: function(component, event, helper) {
        var searchField = component.find('searchField');
        var isValueMissing = searchField.get('v.validity').valueMissing;
        var numlength = component.get("v.searchKeyword")
        console.log('event.keyCode=='+event.keyCode);
        // if value is missing show error message and focus on field
        if(isValueMissing) {
            searchField.showHelpMessageIfInvalid();
            searchField.focus();
        }else if(numlength != null && numlength.length <3 && event.keyCode === 8){
            //else call helper function for backspace event
            helper.SearchHelper(component, event);
        }else if(numlength != null && numlength.length >2){
            //else call helper function for search more than two character
            helper.SearchHelper(component, event);
        }
    },
    doAddSelectedInCurrentCAItems: function(component, event, helper) {
        var wee = component.get("v.selectedRowsList");
        console.log('call===='+wee);
        var compEvent = $A.get("e.c:addSelectedToCurrentAgenda");
        //var compEvent = component.getEvent("EvtSelectedTradeInitiatives");
        // set the Selected sObject Record to the event attribute. 
        console.log('compEvent===='+compEvent); 
        //compEvent.setParams({"TradeInitiatives" : component.get("v.selectedRowsList")
                            // });
        console.log('compEventparams===='+compEvent);
        // fire the event
        //compEvent.fire();
        
        var action = component.get("c.getSelectedInitiativeToCurrentAgenda");
        console.log('param1=='+component.get("v.currentCallAgenda"));
        console.log('param2=='+JSON.stringify(component.get("v.selectedRowsList")));
        action.setParams({ "TradeCallAgendaId" :component.get("v.currentCallAgenda"),
                          "TradeInitiatives" : component.get("v.selectedRowsList")});
        // Create a callback that is executed after 
        // the server-side action returns
        console.log('action123'+action);
        action.setCallback(this, function(response) {
            console.log('action456'+response.getState());
            var state = response.getState();
            if (state === "SUCCESS") {
                alert("From server: " + JSON.stringify(response.getReturnValue()));
                compEvent.setParams({"TradeInitiatives" : response.getReturnValue()
                                    });
                console.log('compEventparams===='+compEvent);
                // fire the event
                compEvent.fire();
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