var webapp = angular.module('orderByExample', []);

webapp.controller('ExampleController', ['$scope', '$filter', '$http', function($scope, $filter, $http) {
	
	var orderBy = $filter('orderBy');
	$scope.getBack = function(){
		var dirAry = $scope.dir.split("/");
			
		if(dirAry.length > 2){
			
			var prevDir = "/";
			for(var i=0; i<dirAry.length-2; i++){
				prevDir += dirAry[i] + "/";
			}
			
			$http({
				method:'get',
			    url: prevDir
			}).success(function(data){
				$scope.dir = data.dir;
			    $scope.files = data.files;
			}).error(function(data, status, headers, config) {

			});
		}
	};
	
	$scope.getFile = function($event){
		$event.preventDefault();
		//console.log($event.target.innerHTML);
		//console.log($scope.dir);
		
		var myDir = '/'+ $scope.dir + $event.target.innerHTML;
		if(myDir.substr(-1) === "/"){
			$http({
			    method:'get',
			    url: myDir
			}).success(function(data){	
				
					$scope.dir = data.dir;
					$scope.files = data.files;
				
			}).error(function(data, status, headers, config) {
	
			});
		}else{
			window.open(myDir);
		}
		
	};
	
	$http({
	     method:'get',
	     url:'/file/?all=1',
	 }).success(function(data){
	     console.dir(data);
	     $scope.dir = data.dir;
	     $scope.files = data.files;
	 }).error(function(data, status, headers, config) {

	 });
	
	/*$scope.files = [{ 
    		name: 'John/',	
    		time:'555-1212',	
    		size: 10 
    	},{ 
    		name: 'Mary.txt',	
    		time: '555-9876',    
    		size: 19 
    	},{ 
    		name: 'Mike/',    
    		time: '555-4321',    
    		size: 21 
    	},{ 
    		name: 'Adam/',    
    		time: '555-5678',    
    		size: 35 
    	},{ 
    		name: 'Julie.jpg',   
    		time: '555-8765',    
    		size: 29 
    	}
    ];*/
    
    $scope.order = function(predicate, reverse) {
    	$scope.files = orderBy($scope.files, predicate, reverse);
    };
    
    $scope.order('-size',false);
}]);