angular.module('ContactAgenda').factory('toastService', ToastService);

function ToastService($mdToast) {
    var self = this;

    self.status = "";
    self.text = "";

    function toastHelper() {
        $mdToast.show({
            controller: "ToastController",
            templateUrl: "/views/partials/toast.html",
            hideDelay: 3500,
            position: "bottom left"
        });
    }

    function getStatus() {
        return self.status;
    }

    function getText() {
        return self.text;
    }

    show = function(status, txt) {
        self.status = status;
        self.text = txt;
        toastHelper();
    };

    return {
        show: show,
        getStatus: getStatus,
        getText: getText
    }
}