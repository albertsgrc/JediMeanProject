angular.module('ContactAgenda').factory('contactsService', ContactsService);

function ContactsService($http, $q, authService) {
    var SERVER_URL = "http://localhost:8080/contact";

    function getContacts() {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.get(SERVER_URL).then(
                function(contacts) {
                    q.resolve(contacts.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function getContact(_id) {

    }

    function deleteContact(_id) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.delete(SERVER_URL + "/" + _id).then(
                function(contact) {
                    q.resolve(contact.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function updateContact(_id, newContact) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.patch(SERVER_URL + "/" + _id, newContact).then(
                function(contact) {
                    console.log(contact);
                    q.resolve(contact.data);
                },
                function(err) {
                    q.reject(err);
                }
            )
        }
        else q.reject("Not logged in");

        return q.promise;
    }

    function addContact(contact) {
        var q = $q.defer();

        if (authService.loggedIn()) {
            $http.post(SERVER_URL, contact).then(
                function(contact) {
                    q.resolve(contact.data);
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
        getContacts: getContacts,
        getContact: getContact,
        deleteContact: deleteContact,
        updateContact: updateContact,
        addContact: addContact
    }
}