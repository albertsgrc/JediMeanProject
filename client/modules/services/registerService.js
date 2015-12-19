angular.module('ContactAgenda').factory('registerService', RegisterService);

function RegisterService($http, $window, $q) {
    var SERVER_URL = "http://localhost:8080/user/";

    function register(username, password) {
        var q = $q.defer();

        $http.post(SERVER_URL, { name: username, password: password })
            .then(
                function(data) {
                    user = data.data;
                    console.log(user);
                    q.resolve();
                },
                function(err) {
                    console.log("Failed: " + JSON.stringify(err.data));
                    q.reject(err.data);
                }
        );

        return q.promise;
    }

    return {
        register: register
    }
}