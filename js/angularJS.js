var app = angular.module("myApp", []);

app.controller('myCtrl', function($scope) {

    // ------------------ Init ------------------------------
    $scope.fullName = ''; //Full name
    $scope.hourstable = []; //Array : Will contain all the (day, time) values extracted from the initTable
    $scope.registrations = []; //Array: Will contain all the registred/saved entries
    $scope.currentEntry = {}; //Will contain the current entry of a user:  fullName, checked boxes and editedMode value
    $scope.requiredError = false;
    var checkedIndexes = []; //Array containing the index of the slot/times that has already been selected/checked in one of the entries
    $scope.editedMode = {}; // true when a user is editing an entry*/
    var editedEntryChecked = []; //Will contain the edited entry of a user fullName:  checked boxes and editedMode value
    $scope.disableNewInput = false; //To disable the new entries and parallel edit in case of a current edit to an entry

//Initial Table containing the days and the corresponding slots (Used to generate the hourstable array)
    $scope.initTable = [{
        day: "Monday 6",
        slots: ['4:00', '6:00', '8:00', '10:00']
    }, {
        day: "Tuesday 7",
        slots: ['11:00', '12:00', '13:00', '14:00']
    }, {
        day: "Wednesday 8",
        slots: ['18:00', '19:00', '20:00', '22:00']
    }, {
        day: "Thursday 9",
        slots: ['4:00', '6:00', '8:00', '10:00']
    }];

    // All  (day: Day, time: Hours/Slots) 
    var getHours = function() {
        var temp = [];
        for (var i = 0; i < $scope.initTable.length; i++) {
            for (var j = 0; j < $scope.initTable[i].slots.length; j++) {
                temp = temp.concat({
                    'day': $scope.initTable[i].day,
                    'time': $scope.initTable[i].slots[j]
                });
            };
        };
        $scope.hourstable = temp;
    };
    getHours();

    // Save an Entry
    $scope.save = function() {
        //Check if the entry has an empty fullName value
        if (!$scope.currentEntry.fullName || $scope.currentEntry.fullName == '') {
            $scope.requiredError = true;
            return;
        }
        $scope.requiredError = false;
        // Add the entry to the checked list
        for (var key in $scope.currentEntry.checked) {
            if ($scope.currentEntry.checked[key] && checkedIndexes.indexOf(key)==-1)
                checkedIndexes.push(key);
        }
        console.log('checkedIndexes', $scope.currentEntry.checked)
        $scope.registrations.push($scope.currentEntry);
        // Reinitialize the current entry
        $scope.currentEntry = {};
    }

    //Verify if a box corresponding to hourstable[index].time has already been checked by checking if the index is already in the checkedIndexes array
    $scope.isChecked = function(index) {

        for (var i = 0; i < checkedIndexes.length; i++) {
            if (checkedIndexes[i] == index) {
                return true
            }
        }
        return false;
    }

    //Edit the entry corresponding to the registrations[index]
    $scope.edit = function(index) {
        $scope.registrations[index].editedMode = true;
        // Clone object
        editedEntryChecked = JSON.parse(JSON.stringify($scope.registrations[index].checked));
        $scope.disableNewInput = true; //Disable the new Input fields as well as the edit buttons from the nonconcerned entry
    }

    //Verify if a box has already been checked previously (or not) (true->box disabled, false->box enabled)
    $scope.isCheckedEdit = function(index) {
        for (var i = 0; i < checkedIndexes.length; i++) {
            if (checkedIndexes[i] == index && !editedEntryChecked[index]) {
                return true
            }
        };
        return false;
    }

    //Save the new updated entry within the concerned edited entry
    $scope.saveEdit = function(index) {
        $scope.registrations[index].editedMode = false;
        $scope.disableNewInput = false;

        // Add(resp. splice) from checked list if a new(resp. old) value has been checked(resp.unchecked)
        for (var key in $scope.registrations[index].checked) {
            if ($scope.registrations[index].checked[key] && checkedIndexes.indexOf(key)==-1)
                checkedIndexes.push(key);
        };
        for (var key in editedEntryChecked) {
            if (editedEntryChecked[key] == true && $scope.registrations[index].checked[key] == false) {
                var id = checkedIndexes.indexOf(key);
                checkedIndexes.splice(id, 1);
            } 
        };
    };

    //Calculates the number of the values that has already been selected and compares it with the number of objects in hourstable
    $scope.isFull = function(){
        //Equality means all the boxes has been checked
        if(checkedIndexes.length==$scope.hourstable.length){
            return true;
        }
        return false;
    }
});