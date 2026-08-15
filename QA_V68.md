# PROJECT 11122 v6.8 QA

## 자동 회귀 테스트
- 미래 날짜 열람 시 자동화 미실행
- 같은 날짜 자동화 중복 실행 방지
- 자동화 실행키 기록
- 대기함 인강 중복 방지
- 실제 반복일의 미완료 충돌 생성
- 이전 미완료 + 오늘 예정분 실제 병합
- 시간표 완료 ↔ 할 일 완료 독립
- 23:30 → 06:40 = 430분
- D-1 취침 + D 기상 매핑
- 인강 1~3강 = 3단위
- 금요일 영어 모의고사와 5교시 대체
- 블록 겹침 감지
- schema 6 → 8 마이그레이션 및 자동화 실행키 추론
- 연말 날짜 경계
- 자정 시간 계산
- 백업 구조 검증

결과: `ALL CORE TESTS PASSED`

## 정적 검사
- JavaScript syntax: PASS
- Service Worker syntax: PASS
- CSS parse error: 0
- HTML duplicate id: 0
- JS 직접 참조 id 누락: 0
- v67 이하 자산 참조: 0

## 브라우저 레이아웃 QA
Chromium/Playwright로 인라인 빌드 렌더링 검사:
- 1365×900: document overflow 없음
- 1024×768: document overflow 없음
- 600×820: document overflow 없음, 상단 탭 높이 40px
- 390×844: document overflow 없음, 상단 탭 높이 42px
- 600×820 별도 화면: 학습 자판기 / 주간 / 시간표 모두 document overflow 없음

주간표 자체는 좁은 화면에서 내부 가로 스크롤을 허용합니다. 문서 전체를 밀어내지는 않습니다.
