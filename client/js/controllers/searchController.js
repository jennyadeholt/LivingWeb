angular.module('livingWebApp')
    .controller('SearchCtrl', function SearchController($scope, $routeParams, $http, $location, $filter, BooliService, KeywordService) {
        $scope.init = function () {
            $scope.nbr = 0;
            var keywords = KeywordService.getKeywordsOrNull();

            if (keywords) {
                $scope.searchWords = keywords;
                $scope.keywords = keywords;
                this.onSearch();
            } else {
                $scope.keywords = "";
            }
            setUpAutoComplete($scope, $http, BooliService);
        };

        $scope.itemClicked = function($listing) {
            $updateInfoWindow($listing, $filter);
        }

        $scope.getPagination = function() {
            return $scope.currentPage * $scope.pageSize;
        }

        $scope.onSearch = function () {
            runSearch($scope, $http, $filter, BooliService);
        }

    });

function runSearch($scope, $http, $filter, BooliService) {
    BooliService.getListings($scope, $http).then(function (response) {

        var objects = $scope.soldObjects ? response.data.sold : response.data.listings;




        if (response.data.offset === 0) {
            $scope.totalCount = response.data.totalCount;
            $scope.listings = objects;

            window.alert("Done search we got listings");

            $scope.currentPage = 0;
           // google.maps.event.addDomListener(window, 'load', $initializeListMap($scope, $filter));
        } else if (objects) {
            $.each(objects, function (i, object) {
                $scope.listings.push(object);
            });
        }
        $scope.nbr++;

        if ($scope.totalCount - $scope.listings.length << 0) {
            $scope.search();
        } else {
            $scope.nbr = 0;
        }
    }, function (error) {
        console.log(error);
    });
}
