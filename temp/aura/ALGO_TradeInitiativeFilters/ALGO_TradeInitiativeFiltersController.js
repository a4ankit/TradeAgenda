({
	 toggleFilters : function(component, event, helper) {

      var toggleFilters = component.find("filterCmp");
      $A.util.toggleClass(toggleFilters, "expand");
    }
})