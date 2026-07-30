# Impacticker Codex CLI 프롬프트 가이드

## 구성

| 파일 | 용도 |
|---|---|
| `AGENTS.md` | 항상 적용되는 최상위 실행 계약 |
| `.codex/prompts/impacticker-master.md` | 전체 자율 실행 마스터 프롬프트 |
| `.codex/prompts/impacticker-api.md` | Swagger, DTO, 인증, 캐시, 오류 |
| `.codex/prompts/impacticker-ui.md` | 화면, 반응형, 디자인, 접근성 |
| `.codex/prompts/impacticker-qa.md` | 회귀, 보안, 접근성 검증 |
| `.codex/prompts/impacticker-release.md` | Issue, 커밋, PR, CI, 병합, 배포 |

## 사용법

Codex CLI를 저장소 루트에서 실행하면 `AGENTS.md`가 적용됩니다. 새 세션에서 전체 자율 실행 의도를 강화하려면 마스터 프롬프트 뒤에 실제 작업을 붙입니다.

```text
[impacticker-master.md 내용]

작업:
종목 검색에서 한국 ETF가 검색되지 않는 원인을 Swagger 기준으로 조사하고,
회귀 테스트와 함께 수정한 뒤 PR 병합과 운영 배포까지 완료해.
```

## 역할 조합

- 작은 작업: 리더 단독
- API+UI: API 계약 조사 → UI 구현 → QA 독립 검증 → 리더 릴리스
- 배포·보안: QA 재현 → 최소 수정 → 독립 검증 → 릴리스 smoke

## 작업 요청 템플릿

```text
Impacticker 저장소 규칙과 .codex/prompts/impacticker-master.md를 따른다.

목표:
<사용자가 얻어야 할 결과>

수용 기준:
- <핵심 동작>
- <오류·빈·로딩 상태>
- <모바일·키보드 요구>

코드 분석, 구현, 테스트, Issue, 커밋, PR, CI, 병합,
Cloudflare 배포와 운영 smoke test까지 중간 승인 없이 수행한다.
```

## 자동화가 멈추는 조건

- GitHub 또는 Cloudflare 자격증명이 실제로 없음
- 명시되지 않은 결제, 도메인 구매, 데이터 삭제
- 필요한 백엔드 API가 없어 프론트만으로 완료할 수 없음

이 경우에도 가능한 조사, 테스트, 문서화와 백엔드 전달 명세까지 완료하고 정확한 재개 조건을 보고합니다.
