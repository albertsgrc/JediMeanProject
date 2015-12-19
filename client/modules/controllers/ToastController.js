angular.module('ContactAgenda').controller("ToastController", ToastController);

function ToastController($scope, toastService) {
    $scope.text = function() {
        return toastService.getText();
    };

    $scope.class = function() {
        return toastService.getStatus();
    }
}