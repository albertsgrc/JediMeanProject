angular.module('ContactAgenda').controller('ContactsController', ContactsController);

function ContactsController($scope, contactsService, toastService, $mdDialog) {
    $scope.searchText = "";
    $scope.contacts = null;
    var indexFromId = {};

    $scope.deleteText = function() {
        $scope.searchText = "";
    };

    $scope.$watch('contacts', function() {
        indexFromId = {};
        if ($scope.contacts === null) return;
        for (var i = 0; i < $scope.contacts.length; ++i) {
            indexFromId[$scope.contacts[i]._id] = i;
        }
    }, true);

    contactsService.getContacts().then(
        function(contacts) {
            $scope.contacts = contacts;
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
            controller: createContactDialogController,
            templateUrl: '/partials/authNeeded/createContact',
            parent: angular.element(document.body),
            targetEvent: ev
        });
    };

    function createContact(contact, dialogInterface) {
        for (var key in contact)
            if (contact[key] === "") delete contact[key];

        contactsService.addContact(contact).then(
            function(contact) {
                $scope.contacts.push(contact);
                dialogInterface.onSuccess();
            },
            function(err) {
                if (err.code === 11000)  toastService.show("failure", "Ja tens un contacte amb aquest nom i cognom!");
                else toastService.show("failure", "S'ha produit un error en crear el contacte");
            }
        )
    }
    
    $scope.deleteContact = function(_id) {
        index = indexFromId[_id];

        $mdDialog.show(
            $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title("Estàs segur que vols eliminar el contacte?")
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

    function createContactDialogController($scope, $mdDialog) {
        dialogInterface = {};
        $scope.form = {};

        dialogInterface.onSuccess = function() {
            $scope.createClicked = false;
            $mdDialog.hide();
        };

        $scope.createClicked = false;

        $scope.hide = function() {
            $scope.createClicked = false;
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $scope.createClicked = false;
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $scope.createClicked = true;
            if ($scope.form.createContactForm.$valid) createContact(answer, dialogInterface);
        };
    }


    $scope.filterContacts = function(contact) {
        return (contact.name + " " + contact.surname).indexOf($scope.searchText) !== -1;
    };

    editDialogInterface = {};

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