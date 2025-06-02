// AngularJS 모듈 생성: 'TeacherApp'이라는 이름의 새로운 AngularJS 애플리케이션 모듈을 만듭니다.
const app = angular.module('TeacherApp', []);

// 메인 컨트롤러 정의: 'TeacherController'는 교사 목록 관리(조회/추가/수정/삭제) 기능을 담당합니다.
app.controller('TeacherController', ($scope, $http) => {
  // 서버에서 받아온 데이터를 저장할 배열
  $scope.teachers = [];
  // 로딩 상태 표시용 변수
  $scope.isLoading = true;
  // 에러 메시지
  $scope.errorMsg = '';

  // 실제 서버에서 데이터를 받아오는 것처럼 $http.get 사용
  $http.get('js/teachers.json')
    .then(response => {
      $scope.teachers = response.data;
      $scope.isLoading = false;
    })
    .catch(() => {
      $scope.errorMsg = '데이터를 불러오지 못했습니다.';
      $scope.isLoading = false;
    });

  // 신규 교사 정보 입력을 위한 객체. 폼 입력값이 이 객체에 바인딩됩니다.
  $scope.newTeacher = {};

  // 교사 추가 함수: 폼에서 입력한 정보를 teachers 배열에 추가합니다.
  $scope.addTeacher = () => {
    if ($scope.newTeacher.name) {
      const newId = $scope.teachers.length > 0 ? $scope.teachers[$scope.teachers.length - 1].id + 1 : 1;
      $scope.teachers.push({
        id: newId,
        name: $scope.newTeacher.name,
        visits: $scope.newTeacher.visits || 0,
        newStudents: $scope.newTeacher.newStudents || 0
      });
      $scope.newTeacher = {};
    }
  };

  // 교사 삭제 함수: id로 해당 교사를 찾아 배열에서 제거합니다.
  $scope.deleteTeacher = id => {
    $scope.teachers = $scope.teachers.filter(t => t.id !== id);
  };

  // 교사 수정 시작 함수: 수정할 교사 정보를 editingTeacher에 복사해 폼에 바인딩합니다.
  $scope.editTeacher = teacher => {
    $scope.editingTeacher = angular.copy(teacher);
  };

  // 교사 수정 완료 함수: editingTeacher의 값을 teachers 배열에 반영합니다.
  $scope.updateTeacher = () => {
    const idx = $scope.teachers.findIndex(t => t.id === $scope.editingTeacher.id);
    if (idx !== -1) {
      $scope.teachers[idx] = angular.copy($scope.editingTeacher);
      $scope.editingTeacher = null;
    }
  };

  // 교사 수정 취소 함수: 수정 모드를 종료합니다.
  $scope.cancelEdit = () => {
    $scope.editingTeacher = null;
  };

  // 정렬, 페이징 관련 변수 및 함수
  $scope.sortKey = 'id'; // 기본 정렬 키
  $scope.reverseSort = false; // 오름차순
  $scope.pageSize = 5; // 기본 페이지 크기
  $scope.currentPage = 1;

  // 총 페이지 수 계산
  $scope.getTotalPages = () => {
    const filtered = $scope.teachers.filter(t => {
      if (!$scope.searchText) return true;
      const s = $scope.searchText.toLowerCase();
      return (
        (t.name && t.name.toLowerCase().includes(s)) ||
        (t.visits + '').includes(s) ||
        (t.newStudents + '').includes(s)
      );
    });
    return Math.ceil(filtered.length / $scope.pageSize) || 1;
  };

  // 페이지 배열 생성
  $scope.getPageArray = () => {
    const total = $scope.getTotalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  };

  // 페이지 이동
  $scope.setPage = n => {
    if (n < 1) n = 1;
    const max = $scope.getTotalPages();
    if (n > max) n = max;
    $scope.currentPage = n;
  };

  // 검색/정렬/페이지 크기 변경 시 1페이지로 이동
  $scope.$watchGroup(['searchText', 'sortKey', 'pageSize'], () => {
    $scope.currentPage = 1;
  });
});
