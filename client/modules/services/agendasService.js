angular.module('ContactAgenda').factory('agendasService', AgendasService);

function AgendasService($http, $q, authService) {
    var SERVER_URL = "http://localhost:8080/agenda";

    function getAgendas() {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.get(SERVER_URL).then(
                function(agendas) {
                    q.resolve(agendas.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function addContact(agendaid, contactid) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.patch(SERVER_URL + "/" +  agendaid + "/addContact", { contact_id: contactid }).then(
                function(data) {
                    q.resolve(data.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function removeContact(agendaid, contactid) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.patch(SERVER_URL + "/" +  agendaid + "/removeContact", { contact_id: contactid }).then(
                function(data) {
                    q.resolve(data.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function getAgenda(name) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.get(SERVER_URL + "/byname/" + name).then(
                function(agenda) {
                    if (agenda) q.resolve(agenda.data);
                    else q.reject("Not found");
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function deleteAgenda(_id) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.delete(SERVER_URL + "/" + _id).then(
                function(agenda) {
                    q.resolve(agenda.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function updateAgenda(_id, newAgenda) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.patch(SERVER_URL + "/" + _id, newAgenda).then(
                function(agenda) {
                    q.resolve(agenda.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function addAgenda(agenda) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.post(SERVER_URL, agenda).then(
                function(agenda) {
                    q.resolve(agenda.data);
                },
                function(err) {
                    q.reject(err.data);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    return {
        getAgendas: getAgendas,
        deleteAgenda: deleteAgenda,
        updateAgenda: updateAgenda,
        addAgenda: addAgenda,
        getAgenda: getAgenda,
        addContact: addContact,
        removeContact: removeContact
    }
}