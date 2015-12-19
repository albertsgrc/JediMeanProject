var ContactAgenda = angular.module('ContactAgenda', ['ngMaterial', 'ngMessages', 'ui.router']);

ContactAgenda.config(function($mdThemingProvider) {
   return $mdThemingProvider
       .theme('default').dark()
       .primaryPalette('deep-orange')
       .accentPalette('amber');
});

var viewsPath = '../views';

ContactAgenda.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: viewsPath + '/partials/login.html',
            controller: 'LoginController'
        })
        .state('layout', {
            abstract: true,
            templateUrl: '/partials/authNeeded/layout'
        })
        .state('contacts', {
            parent: 'layout',
            controller: "ContactsController",
            url: '/contactes',
            templateUrl: '/partials/authNeeded/contacts'
        })
        .state('agendas', {
            parent: 'layout',
            controller: "AgendasController",
            url: '/agendes',
            templateUrl: '/partials/authNeeded/agendas'
        }).
        state('agenda',{
            parent: 'layout',
            controller: "AgendaController",
            url: '/agendes/:name',
            templateUrl: '/partials/authNeeded/agenda',
            reload: true
        });

    $urlRouterProvider.otherwise('/login');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

ContactAgenda.run(function($rootScope, authService, $state) {
    $rootScope.$on("$stateChangeStart", function(event, next) {
        if (!authService.loggedIn() && next.name !== "login") {
            console.log("hey");
            event.preventDefault();
            $state.go("login");
        }
    });
});
