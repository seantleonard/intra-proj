angular
    .module('intranet')
    .controller('HRController', function($scope,$http, $sce){
        //vm is referring to "THIS" like java/c++ this.something.
        var vm = this;

        /*
        * vm.ann       -> announcement content
                            [1]heading
                            [2]content
                            [3]date_created
        * vm.page_data -> page content
                            [0]id
                            [1]name
                            [2]img_01
                            [3]img_02
                            [4]img_03
                            [5]heading_01
                            [6]heading_02
                            [7]body_01
                            [8]body_02
                            [9]video_01
                            [10]video_02
        *
        *
        */

        vm.ann;
        vm.page_data;


        $http.post("/get_announcement")
        .success(function(data, status, headers, config){
              //console.log("status: "+status);
             //console.log("TEST:" +JSON.stringify(data));
            console.log(data);
            vm.ann=Object.values(data);

            //console.log(vm.ann);
            // console.log("status: "+status);
            // console.log("headers: "+headers);
            // console.log("config: "+config);
        });

        //Fetching the particular page. and send the page_id as payload data to
        //the endpoint which in turn fetches from the DB with the page ID.
        var post_data = JSON.stringify(
            {
                'page_id' : 1
            }
        );
        $http.post('/get_page', post_data)
        .success(function(data){
            console.log(Object.values(data));
            vm.page_data = Object.values(data);
        });

    });
