angular.module('ContactAgenda').controller('AgendasController', AgendasController);

function AgendasController($scope, agendasService, toastService, $mdDialog, $state) {
    $scope.searchText = "";
    $scope.agendas = null;
    var indexFromId = {};

    $scope.deleteText = function() {
        $scope.searchText = "";
    };

    $scope.$watch('agendas', function() {
        indexFromId = {};
        if ($scope.agendas === null) return;
        for (var i = 0; i < $scope.agendas.length; ++i) {
            indexFromId[$scope.agendas[i]._id] = i;
        }
    }, true);

    agendasService.getAgendas().then(
        function(agendas) {
            $scope.agendas = agendas;
        },
        function(err) {
            $scope.agendas = [];
            toastService.show('failure', "No s'han pogut obtenir les agendes");
        }
    );

    $scope.showAgenda = function(_id) {
        var index = indexFromId[_id];
        var agenda = $scope.agendas[index];
        $state.go('agenda', { name: agenda.name });
    };


    $scope.showCreateDialog = function(ev) {
        $mdDialog.show({
            controller: createAgendaDialogController,
            templateUrl: '/partials/authNeeded/createAgenda',
            parent: angular.element(document.body),
            targetEvent: ev
        });
    };

    function createAgenda(agenda, dialogInterface) {
        agendasService.addAgenda(agenda).then(
            function(agenda) {
                $scope.agendas.push(agenda);
                dialogInterface.onSuccess();
            },
            function(err) {
                if (err.code === 11000)  toastService.show("failure", "Ja tens una agenda amb aquest nom!");
                else toastService.show("failure", "S'ha produit un error en crear l'agenda");
            }
        )
    }

    $scope.deleteAgenda = function(_id) {
        var index = indexFromId[_id];

        $mdDialog.show(
            $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title("Estàs segur que vols eliminar l'agenda? Això no eliminarà els seus contactes.")
                .ok('Sí')
                .cancel("No")
        ).then(function() {
                agendasService.deleteAgenda($scope.agendas[index]._id)
                    .then(
                    function () {
                        $scope.agendas.splice(index, 1);
                    },
                    function () {
                        toastService.show("failure", "No s'ha pogut esborrar l'agenda");
                    }
                )
            });
    };

    function createAgendaDialogController($scope, $mdDialog) {
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
            if ($scope.form.createAgendaForm.$valid) createAgenda(answer, dialogInterface);
        };
    }


    $scope.filterAgendas = function(agenda) {
        return agenda.name.indexOf($scope.searchText) !== -1;
    };

    var editDialogInterface = {};

    $scope.showEditAgendaDialog = function(_id) {
        index = indexFromId[_id];
        editDialogInterface.editAgenda = $scope.agendas[index];

        $mdDialog.show({
            controller: editAgendaDialogController,
            templateUrl: '/partials/authNeeded/editAgenda',
            parent: angular.element(document.body)
        });
    };

    function editAgendaDialogController($scope, $mdDialog) {
        $scope.form = {};
        $scope.oldAgenda = editDialogInterface.editAgenda;
        $scope.editAgenda = {};
        $scope.editAgenda.name = editDialogInterface.editAgenda.name;
        $scope.editAgenda._id = editDialogInterface.editAgenda._id;

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
            if ($scope.form.editAgendaForm.$valid)
                editAgenda($scope.oldAgenda._id,
                    $scope.oldAgenda, answer);
        };
    }

    function editAgenda(_id, oldAgenda, newAgenda) {
        var index = indexFromId[_id];

        if (oldAgenda.name !== newAgenda.name) {
            agendasService.updateAgenda(oldAgenda._id, { name: newAgenda.name })
                .then(
                function (newAgendaFromDb) {
                    $scope.agendas[index] = newAgendaFromDb;
                    editDialogInterface.onSuccess();
                },
                function () {
                    toastService.show("failure", "No s'ha pogut editar l'agenda");
                }
            )
        }
    }

    $scope.agendaSort = function(agenda) {
        return agenda.name;
    }
}