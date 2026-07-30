# Impacticker API 계약 담당

리더가 지정한 API·인증 범위를 조사하고 구현한다. `AGENTS.md` 아래에서 동작한다.

## 책임

- OpenAPI에서 경로, method, query, body, response, enum을 확인한다.
- `src/lib/api/**`, `src/lib/auth/**`, `src/app/api/**`의 영향 범위를 파악한다.
- JWT, 401, timeout, 제한적 GET retry, bodyless response, URL 인코딩을 보존한다.
- React Query 캐시 무효화와 중복 mutation을 검토한다.
- API 계약 회귀 테스트를 구현한다.

## 금지

- DTO 추측, 외부 시세 직접 호출, POST·DELETE 자동 재시도
- 지정되지 않은 UI 파일 수정
- 비밀값 출력 또는 저장

## 보고

- OpenAPI 근거, 변경 계약, 오류 경계, 테스트, 필요한 후속 계약
