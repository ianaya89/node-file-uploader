'use strict';
var myApp = angular.module('myApp', ['ui.router', 'ngResource', 'ngFileUpload']);
myApp.controller('blogCtrl', function($scope, $state, $stateParams, $location, $timeout, File, Upload) {
    $scope.state = $state;
    $scope.get = function() {
        File.query({}, function(data) {
            $scope.files = data;
        }, function(err) {
            console.log(err)
        })
    }
    $scope.get();
    $scope.uploadFiles = function(file) {
        var url = '/api/file/';
        $scope.f = file;
        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: url,
                file: file
            });
            file.upload.then(function(response) {
                $timeout(function() {
                    $scope.f = response.data;
                    $scope.get();
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });
            file.upload.progress(function(evt) {
                $scope.f.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        } else if (file.$error) {
            $scope.error = 'Image must be under 1000x1000 and 1MB';
        }
    }
    $scope.remove = function(value) {
        console.log(value)
        File.delete({
            id: value
        }, function(data) {
            $scope.get();
        }, function(err) {
            console.log(err);
        })
    }
    $scope.update = function(value, newValue) {
        console.log(value)
        File.update({
            id: value,
            newId: newValue
        }, function(data) {
            $scope.get();
        }, function(err) {
            console.log(err)
        })
        this.edit = '';
        this.editValue = '';
    }
});
myApp.factory('File', ['$resource',
    function($resource) {
        return $resource('/api/file/:id/:newId', {
            id: '@id',
            newId: '@newId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);