angular.module('ContactAgenda').controller('NavigationController', NavigationController);


function NavigationController(authService, $scope, $location, navigationService, $state) {

    $scope.navItems = navigationService.getNavigationItems();

    $scope.sideItems = navigationService.getSideItems();

    $scope.execute = function(functionName) {
        eval(functionName);
    };

    var logoutClicked = function () {
        authService.logout();
        $state.go('login');
    };

    var contactsClicked = function () {
        $state.go('contacts');
    };

    var agendasClicked = function () {
        $state.go('agendas');
    };

    $scope.isActive = function(route) {
        if (/\/agendes\/+/.test($location.path()) && route === "/agendes") return true;
        return route === $location.path();
    };

    $scope.title = function() {
        if (/\/agendes\/+/.test($location.path())){
            return "Agenda " + $location.path().slice($location.path().lastIndexOf('/') + 1);
        }
        return navigationService.titleFromRoute($location.path());
    }
}
