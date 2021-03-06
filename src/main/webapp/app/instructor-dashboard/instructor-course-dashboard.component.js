(function () {
    'use strict';

    angular
        .module('exerciseApplicationApp')
        .component('instructorCourseDashboard', {
            bindings: {
                courseId: '<'
            },
            controller: InstructorCourseDashboardController,
            templateUrl: 'app/instructor-dashboard/instructor-course-dashboard.html'
        });

    InstructorCourseDashboardController.$inject = ['$window', '$filter', 'moment', '$uibModal','Course', 'CourseResult', 'CourseParticipation'];

    function InstructorCourseDashboardController($window, $filter, moment, $uibModal,Course, CourseResult, CourseParticipation) {
        var vm = this;


        vm.$onInit = init;
        vm.sort = sort;
        vm.course = Course.get({id : vm.courseId});
        vm.rows = [];
        vm.numberOfExercises = 0;

        function init() {
            getResults();
        }



        function getResults() {
            vm.results = CourseResult.query({
                courseId: vm.courseId
            }, groupResults);
            vm.participations = CourseParticipation.query({
                courseId: vm.courseId
            }, groupResults);
        }

        function groupResults() {
            if(!vm.results || !vm.participations || vm.participations.length == 0 || vm.results.length == 0) {
                return
            }
            var rows = {};
            var exercisesSeen = {};
            _.forEach(vm.participations, function (p) {
               if(!rows[p.student.id]) {
                   rows[p.student.id] = {
                       'firstName': p.student.firstName,
                       'lastName': p.student.lastName,
                       'login': p.student.login,
                       'participated': 0,
                       'successful': 0,
                   }
               }
               rows[p.student.id].participated++;
               if(!exercisesSeen[p.exercise.id]) {
                   exercisesSeen[p.exercise.id] = true;
                   vm.numberOfExercises++;
               }
            });
            _.forEach(vm.results, function (r) {
                rows[r.participation.student.id].successful++;
            });
            vm.rows = _.values(rows);

        }



        function sort(item) {
            return item[vm.sortColumn];
        }


    }
})();
