angular.module('ContactAgenda').controller('AgendaController', AgendaController);

function AgendaController($stateParams, $scope, $mdDialog, agendasService, toastService, contactsService) {
    $scope.searchText = "";
    var agendaContacts = $scope.contacts = null;
    $scope.agenda =  null;
    var indexFromId = {};

    $scope.deleteText = function() {
        $scope.searchText = "";
    };

    $scope.$watch('contacts', function() {
        indexFromId = {};
        agendaContacts = $scope.contacts;
        if ($scope.contacts === null) return;
        for (var i = 0; i < $scope.contacts.length; ++i) {
            indexFromId[$scope.contacts[i]._id] = i;
        }
    }, true);

    agendasService.getAgenda($stateParams.name).then(
        function(agenda) {
            $scope.agenda = agenda;
            $scope.contacts = agenda.contacts;
        },
        function(err) {
            $scope.contacts = [];
            toastService.show('failure', "No s'han pogut obtenir els contactes");
        }
    );

    var showContactDialogInterface = {};

    $scope.showContact = function(_id) {
        index = indexFromId[_id];
        showContactDialogInterface.contact = $scope.contacts[index];
        $mdDialog.show({
            controller: showContactDialogController,
            templateUrl: '/partials/authNeeded/showContact',
            parent: angular.element(document.body)
        });
    };

    function showContactDialogController($scope, $mdDialog) {
        $scope.showContact = showContactDialogInterface.contact;

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
        };
    }

    $scope.showCreateDialog = function(ev) {
        $mdDialog.show({
            controller: addContactDialogController,
            templateUrl: '/partials/authNeeded/addContactToAgenda',
            parent: angular.element(document.body),
            targetEvent: ev
        });
    };

    function addContact(contact, dialogInterface) {
        for (var key in contact)
            if (contact[key] === "") delete contact[key];

        agendasService.addContact($scope.agenda._id, contact._id).then(
            function(_contact) {
                $scope.contacts.push(contact);
                dialogInterface.onSuccess();
            },
            function(err) {
                toastService.show("failure", "S'ha produit un error en crear el contacte");
            }
        )
    }


    $scope.removeContact = function(contact) {
        $mdDialog.show(
            $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title("Estàs segur que vols treure el contacte de l'agenda? No s'eliminarà de la teva llista de contactes")
                .ok('Sí')
                .cancel("No")
        ).then(
            function() {
                agendasService.removeContact($scope.agenda._id, contact._id).then(
                    function(_contact) {
                        $scope.contacts.splice(indexFromId[contact._id], 1);
                    },
                    function(err) {
                        toastService.show("failure", "S'ha produit un error en eliminar el contacte");
                    }
                );
            }
        );
    };

    $scope.deleteContact = function(_id) {
        index = indexFromId[_id];

        $mdDialog.show(
            $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title("Estàs segur que vols eliminar el contacte? S'eliminarà també de la teva llista de contactes")
                .ok('Sí')
                .cancel("No")
        ).then(function() {
                contactsService.deleteContact($scope.contacts[index]._id)
                    .then(
                    function () {
                        $scope.contacts.splice(index, 1);
                    },
                    function () {
                        toastService.show("failure", "No s'ha pogut esborrar el contacte");
                    }
                )
            });
    };

    function addContactDialogController($scope, $mdDialog, contactsService, toastService) {
        var dialogInterface = {};
        $scope.form = {};

        $scope.myAddAgenda = null;

        $scope.nonAgendaContactsNames = null;
        $scope.nonAgendaContacts = null;
        $scope.searchText = "";
        $scope.contacts = null;

        contactsService.getContacts().then(
            function(contacts) {
                $scope.contacts = contacts;
            },
            function(err) {
                $scope.nonAgendaContacts = [];
                $scope.contacts = [];
                toastService.show('failure', "No s'han pogut obtenir els contactes");
            }
        );

        $scope.$watch('contacts', function() {
            var contacts = angular.copy($scope.contacts);
            if (contacts === null) return;
            for (var i = 0; i < agendaContacts.length; ++i) {
                for (var j = 0; j < contacts.length; ++j) {
                    if (agendaContacts[i].name === contacts[j].name && agendaContacts[i].surname === contacts[j].surname) {
                        contacts.splice(j, 1);
                    }
                }
            }
            $scope.nonAgendaContacts = contacts;
            $scope.nonAgendaContactsNames = [];
            for (var i = 0; i < $scope.nonAgendaContacts.length; ++i) {
                $scope.nonAgendaContactsNames.push($scope.nonAgendaContacts[i].name + " " + $scope.nonAgendaContacts[i].surname);
            }
        }, true);

        dialogInterface.onSuccess = function() {
            $scope.addClicked = false;
            $mdDialog.hide();
        };

        $scope.addClicked = false;

        $scope.hide = function() {
            $scope.addClicked = false;
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $scope.addClicked = false;
            $mdDialog.cancel();
        };

        function contactFromName(name) {
            for (var i = 0; i < $scope.nonAgendaContacts.length; ++i) {
                if ($scope.nonAgendaContacts[i].name + " " + $scope.nonAgendaContacts[i].surname === name) {
                    return $scope.nonAgendaContacts[i];
                }
            }
            return "";
        }

        $scope.answer = function() {
            $scope.addClicked = true;
            if ($scope.myAddAgenda !== null) addContact(contactFromName($scope.myAddAgenda), dialogInterface);
        };
    }


    $scope.filterContacts = function(contact) {
        return (contact.name + " " + contact.surname).indexOf($scope.searchText) !== -1;
    };

    var editDialogInterface = {};

    $scope.showEditContactDialog = function(_id) {
        index = indexFromId[_id];
        editDialogInterface.editContact = $scope.contacts[index];

        $mdDialog.show({
            controller: editContactDialogController,
            templateUrl: '/partials/authNeeded/editContact',
            parent: angular.element(document.body)
        });
    };

    function editContactDialogController($scope, $mdDialog) {
        $scope.form = {};
        $scope.oldContact = editDialogInterface.editContact;
        $scope.editContact = angular.copy(editDialogInterface.editContact);

        editDialogInterface.onSuccess = function() {
            $scope.editClicked = false;
            $mdDialog.hide();
        };

        $scope.editClicked = false;

        $scope.hide = function() {
            $scope.editClicked = false;
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $scope.editClicked = false;
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $scope.editClicked = true;
            if ($scope.form.editContactForm.$valid)
                editContact($scope.oldContact._id,
                    $scope.oldContact, answer);
        };
    }

    function editContact(_id, oldContact, newContact) {
        index = indexFromId[_id];

        var updateObj = {
            $set: {},
            $unset: {}
        };

        for (var attr in newContact) {
            if (["telephone", "name", "surname", "company", "email"].indexOf(attr) === -1) continue;
            if (oldContact[attr] === undefined && newContact[attr] !== "") updateObj.$set[attr] = newContact[attr];
            else if (newContact[attr] === "") updateObj.$unset[attr] = 1;
            else if (oldContact[attr] !== newContact[attr]) {
                updateObj.$set[attr] = newContact[attr];
            }
        }


        if (Object.keys(updateObj.$set).length === 0) delete updateObj.$set;
        if (Object.keys(updateObj.$unset).length === 0) delete updateObj.$unset;

        contactsService.updateContact(oldContact._id, updateObj)
            .then(
            function (newContactFromDb) {
                $scope.contacts[index] = newContactFromDb;
                editDialogInterface.onSuccess();
            },
            function () {
                toastService.show("failure", "No s'ha pogut editar el contacte");
            }
        )
    }

    $scope.contactSort = function(contact) {
        return contact.name + " " + contact.surname;
    }
}