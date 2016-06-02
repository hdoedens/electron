angular.module('liturgie', [])
    .controller('LiturgieController', function ($scope, $http) {

        $scope.validationRules = []
        $http.get('./resources/validation.json').then(function (response) {
            for (n in response.data) {
                $scope.validationRules.push(new RegExp(response.data[n]));
            }
        });

        $scope.getTekst = function (index) {
            console.log('haal tekst op voor onderdeel: ' + index);
        }

        $scope.onderdelen = [{regel:"", tekst:"foobar"}]

        $scope.manageInputs = function (index, onderdeel) {

            // lege input toevoegen
            if (index == $scope.onderdelen.length - 1 && onderdeel.regel != '') {
                $scope.onderdelen.push({regel:"", tekst:"foobar"})
            }

            // lege input verwijderen
            if (index == $scope.onderdelen.length - 2 && onderdeel.regel == '' && $scope.onderdelen[$scope.onderdelen.length - 1] == '') {
                $scope.onderdelen.pop()
            }

            $scope.onderdelen[index].regel = onderdeel.regel;
        }

    })
    .directive('testValidity', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {

                element.on('blur keyup change', function () {
                    scope.$evalAsync(read);
                });
                read(); // initialize

                // Write data to the model
                function read() {
                    var valid = false
                    for (n in scope.validationRules) {
                        valid = scope.validationRules[n].test(element.val())
                        if (valid) {
                            scope.getTekst(attrs.id);
                            break;
                        }
                    }
                    ngModel.valid = valid;
                    ngModel.invalid = !valid;

                    element.parent().toggleClass('has-error', !valid && element.val() != '');
                    element.parent().toggleClass('has-success', valid);
                }
            }
        }
    })
