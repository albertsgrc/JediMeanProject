angular.module('ContactAgenda').factory('authService', AuthService);

function AuthService($http, $window, $q) {
    var SERVER_URL = "http://localhost:8080/user/authenticate";

    function login(username, password) {
        var q = $q.defer();

        $http.post(SERVER_URL, { name: username, password: password })
            .then(
            function(data) {
                user = data.user;
                $window.sessionStorage.token = data.data.token;
                console.log(data.data);
                q.resolve();
            },
            function(err) {
                console.log("Login failed: " + JSON.stringify(err));
                q.reject(err);
            }
        );

        return q.promise;
    }

    function loggedIn() {
        return typeof $window.sessionStorage.token !== "undefined";
    }

    function getUser() {
        return user;
    }

    function logout() {
        user = {};
        delete $window.sessionStorage.token;
    }

    return {
        login: login,
        getUser: getUser,
        loggedIn: loggedIn,
        logout: logout
    }
}