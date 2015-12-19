angular.module('ContactAgenda').directive("equalTo", function() {
   return {
       restrict: "A",

       require: "ngModel",

       scope: {
           otherValue: "=equalTo"
       },

       link: function(scope, element, attributes, ngModel) {
           ngModel.$validators.equalTo = function(value) {
               return value === scope.otherValue;
           };

           scope.$watch("otherValue", function() {
               ngModel.$validate();
           });
       }
   }
});