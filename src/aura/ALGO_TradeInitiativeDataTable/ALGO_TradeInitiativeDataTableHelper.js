({
	 getDataHelper : function(component, event) {
         var headerActions;
         var actions = [{ label: 'Show details', name: 'show_details' }];
        component.set('v.columns', [
            {label: 'Trade Initiative', fieldName: 'Name', type: 'text',sortable:true},//actions: headerActions
            {label: 'Sponsor', fieldName: 'MyAddy__Sponsor__r.Name', type: 'text',sortable:true},
            {label: 'Start Date', fieldName: 'MyAddy__EffectiveStartDate__c', type: 'Date',sortable:true},
            {label: 'End Date', fieldName: 'MyAddy__EffectiveEndDate__c', type: 'Date',sortable:true},
            { type: 'action', typeAttributes: { rowActions: actions } } 
        ]);
        console.log('existingIdsReciever=='+component.get("v.existingAgendaItemsInitiatives"));
        var action = component.get("c.getTradeInitiativeRecords");
        action.setParams({
            'existingTradeItemIds': component.get("v.existingAgendaItemsInitiatives")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS'){             
                component.set("v.data", response.getReturnValue());   
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
    
    handleAction: function (cmp, e, h) {
        var action = e.getParam('action');
        var row = e.getParam('row');
        switch (action.name) {
            case 'show_details':
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": row.Id,
                    "slideDevName": "detail"
                });
                navEvt.fire();
                break;
        }
    },
        
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.data");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.data", data);
    },
    
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a)?key(a):'', b = key(b)?key(b):'', reverse * ((a > b) - (b > a));
        }
    },
       /*        action.setParams({
                    strObjectName : 'CP_TradeInitiative__c',
                    strFieldSetName : 'TradeInitiativeFieldSet'
                });*/
                //component.set("v.columns", response.getReturnValue().lstDataTableColumns);
                //component.set("v.data", response.getReturnValue().lstDataTableData);  */
    
    SearchHelper: function(component, event) {
        // show spinner message
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.MyAddy.FetchSearchedTradeInitiatives");
        action.setParams({
            'searchedKeyword': component.get("v.searchKeyword")
        });
        action.setCallback(this, function(response) {
            // hide spinner when response coming from server 
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // if storeResponse size is 0 ,display no record found message on screen.
                console.log('storeResponse=='+storeResponse);
                if (storeResponse.length == 0) {
                    component.set("v.Message", true);
                } else {
                    component.set("v.Message", false);
                }               
                // set numberOfRecord attribute value with length of return value from server
                component.set("v.TotalNumberOfRecord", storeResponse.length);               
                // set searchResult list with return value from server.
                component.set("v.data", storeResponse); 
            }else if (state === "INCOMPLETE") {
                alert('Response is Incompleted');
            }else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        alert("Error message: " + 
                              errors[0].message);
                    }
                } else {
                    alert("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})