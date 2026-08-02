# PROJECT 11122 v2.1 업데이트

기존 GitHub 저장소에서 아래 파일을 같은 이름으로 업로드해 교체하세요.

- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png
- .nojekyll

## 적용 순서
1. 현재 앱에서 백업을 저장합니다.
2. ZIP 압축을 풉니다.
3. GitHub 저장소 → Add file → Upload files에서 위 파일을 전부 업로드합니다.
4. Commit changes를 누릅니다.
5. 1~3분 뒤 앱을 완전히 종료하고 다시 엽니다.
6. 구버전이면 사이트 주소 뒤에 `?v=21`을 붙여 한 번 접속합니다.

## v2.1 핵심 기능
- 비수학 자동 계획 생성: All Of KICE, LEAD IN→CORE, LIM IT→사문 실모, 영어 취약 유형
- 실모·기출 결과에 따른 다음 공부 자동 처방
- 필수·권장·여유 우선순위에 따른 미완료 자동 정리
- 자료 보관함과 실모 빠른 입력 템플릿
- 일일 보고서 자동 작성·복사
- 시험·보고서 제출·수행평가 일정 관리
- ICS 가져오기·내보내기: Apple/iCloud/Google Calendar 호환
- Google Calendar API 읽기 전용 연결(BETA)
- 다가오는 일정 D-Day 표시
- 등산 체크 결과에 따른 풀코스·단축·휴식 자동 판단

## Google Calendar 직접 연결
Google Cloud에서 Calendar API를 켜고 OAuth 웹 클라이언트와 API 키를 만들어야 합니다.
승인된 JavaScript 출처에는 앱의 설정 화면에 표시되는 `https://사용자명.github.io`를 입력합니다.
권한은 Calendar 읽기 전용만 사용합니다.
