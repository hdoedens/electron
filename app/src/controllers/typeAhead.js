function typeAhead($scope) {
  
  $scope.items = [
    'psalm',
    'gezang',
    'liedboek',
    'genesis',
    'exodus',
    'leviticus',
    'numeri',
    'deuteronomium',
    'jozua',
    'richteren',
    'ruth',
    '1 samuel',
    '2 samuel',
    '1 koningen',
    '2 koningen',
    '1 kronieken',
    '2 kronieken',
    'ezra',
    'nehemia',
    'ester',
  ];

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };
  
  $scope.blurred = function blurred(message) {
    console.log(message);
  }
}
