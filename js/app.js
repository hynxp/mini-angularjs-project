// AngularJS 모듈 생성: 'TeacherApp'이라는 이름의 새로운 AngularJS 애플리케이션 모듈을 만듭니다.
var app = angular.module('TeacherApp', []);

// 메인 컨트롤러 정의: 'TeacherController'는 교사 목록 관리(조회/추가/수정/삭제) 기능을 담당합니다.
app.controller('TeacherController', function($scope, $http) {
  // 서버에서 받아온 데이터를 저장할 배열
  $scope.teachers = [];
  // 로딩 상태 표시용 변수
  $scope.isLoading = true;
  // 에러 메시지
  $scope.errorMsg = '';

  // 실제 서버에서 데이터를 받아오는 것처럼 $http.get 사용
  $http.get('js/teachers.json')
    .then(function (response) {
      $scope.teachers = response.data;
      $scope.isLoading = false;
    }, function(error) {
      $scope.errorMsg = '데이터를 불러오지 못했습니다.';
      $scope.isLoading = false;
    });

  // 신규 교사 정보 입력을 위한 객체. 폼 입력값이 이 객체에 바인딩됩니다.
  $scope.newTeacher = {};

  // 교사 추가 함수: 폼에서 입력한 정보를 teachers 배열에 추가합니다.
  $scope.addTeacher = function () {
    // 이름이 입력된 경우에만 추가
    if ($scope.newTeacher.name) {
      // 새 교사의 id는 현재 배열의 마지막 id + 1로 설정
      var newId = $scope.teachers.length > 0 ? $scope.teachers[$scope.teachers.length - 1].id + 1 : 1;
      // teachers 배열에 새 객체 추가
      $scope.teachers.push({
        id: newId,
        name: $scope.newTeacher.name,
        visits: $scope.newTeacher.visits || 0, // 방문 수가 없으면 0으로
        newStudents: $scope.newTeacher.newStudents || 0 // 신규 회원 수가 없으면 0으로
      });
      // 입력 폼 초기화
      $scope.newTeacher = {};
    }
  };

  // 교사 삭제 함수: id로 해당 교사를 찾아 배열에서 제거합니다.
  $scope.deleteTeacher = function (id) {
    // filter로 id가 일치하지 않는 교사만 남김
    $scope.teachers = $scope.teachers.filter(function (t) {
      return t.id !== id;
    });
  };

  // 교사 수정 시작 함수: 수정할 교사 정보를 editingTeacher에 복사해 폼에 바인딩합니다.
  $scope.editTeacher = function (teacher) {
    $scope.editingTeacher = angular.copy(teacher); // 깊은 복사로 원본 데이터 보호
  };

  // 교사 수정 완료 함수: editingTeacher의 값을 teachers 배열에 반영합니다.
  $scope.updateTeacher = function () {
    // 수정할 교사의 인덱스 찾기
    var idx = $scope.teachers.findIndex(function (t) {
      return t.id === $scope.editingTeacher.id;
    });
    if (idx !== -1) {
      // 해당 인덱스에 수정된 객체로 교체
      $scope.teachers[idx] = angular.copy($scope.editingTeacher);
      $scope.editingTeacher = null; // 수정 모드 종료
    }
  };

  // 교사 수정 취소 함수: 수정 모드를 종료합니다.
  $scope.cancelEdit = function () {
    $scope.editingTeacher = null;
  };
});
