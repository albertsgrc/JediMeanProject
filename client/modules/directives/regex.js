angular.module('ContactAgenda').directive("caRegex", function() {
   return {
       restrict: "A",

       require: "ngModel",

       scope: {
           regex: "=caRegex"
       },

       link: function(scope, element, attributes, ngModel) {
           ngModel.$validators.caRegex = function(value) {
               return value === "" || new RegExp(scope.regex).test(value);
           };
       }
   }
});