angular.module('ContactAgenda').controller('LoginController', LoginController);

function LoginController($scope, toastService, authService, registerService, $state) {
    $scope.loginClicked = $scope.registerClicked = false;

    $scope.form = {};

    onLogin = function() {
        $scope.login.username = $scope.login.password = "";
        $scope.loginClicked = false;
        $scope.form.loginForm.username.$setUntouched();
        $scope.form.loginForm.password.$setUntouched();
        $state.go("contacts");
    };

    $scope.login = function() {
        $scope.loginClicked = true;
        if ($scope.form.loginForm.$valid) {
            authService.login($scope.login.username, $scope.login.password).
                then(
                function() {
                    onLogin();
                },
                function(err) {
                    if (err.status === 600) toastService.show("failure", "El nom d'usuari és incorrecte!");
                    else if (err.status === 601) toastService.show("failure", "La contrasenya és incorrecte!");
                    else toastService.show("failure", "S'ha produit un error al intentar entrar");
                }
            )
        }
        else console.log("Login invalid!");
    };

    onRegister = function() {
        toastService.show("success", "S'ha completat el registre correctament");
        $scope.register.username = $scope.register.password = $scope.register.passwordConfirm = "";
        $scope.tabIndex = 0;
        $scope.registerClicked = false;
        $scope.form.registerForm.username.$setUntouched();
        $scope.form.registerForm.password.$setUntouched();
        $scope.form.registerForm.passwordConfirm.$setUntouched();
    };

    $scope.register = function() {
        $scope.registerClicked = true;
        if ($scope.form.registerForm.$valid) {
            registerService.register($scope.register.username, $scope.register.password)
                .then(
                function() {
                    onRegister();
                },
                function(err) {
                    if (err.code === 11000) toastService.show("failure", "Ja existeix un usuari amb aquest nom!");
                    else toastService.show("failure", "S'ha produit un error en el registre");
                }
            )
        }
        else console.log("Register invalid!");
    };
}