# Impacticker 수익화 로드맵

Impacticker의 수익화 기능은 사용자 신뢰와 분석 독립성을 해치지 않도록 작은 버전 단위로 나눠 도입합니다. 버전은 SemVer를 따르며, 수익 모델의 범위가 커질 때 minor 버전을 올립니다.

## 버전 계획

| 버전 | 범위 | 상태 |
|---|---|---|
| `0.2.0` | Google AdSense 기반, 제한된 광고 슬롯, 개인정보 처리방침, 광고 운영 정책, `ads.txt` | 구현 |
| `0.3.0` | 직접 스폰서십과 제휴 링크 관리, 광고주·캠페인·성과 추적 | 예정 |
| `0.4.0` | Impacticker Pro 구독, 광고 제거, 고급 알림과 분석 기능 | 예정 |
| `0.5.0` | B2B 데이터 API와 임베드 위젯, 사용량·계약 관리 | 예정 |

## v0.2.0 운영 원칙

- 랜딩 페이지와 대시보드 오른쪽 보조 영역에만 광고를 배치합니다.
- 광고는 콘텐츠·주요 CTA·오류 복구 UI와 명확히 분리하고 `광고`라고 표시합니다.
- 포트폴리오, 관심 종목, 계정 정보는 광고 타기팅에 사용하지 않습니다.
- Google 요청은 기본적으로 비개인 맞춤 광고 모드로 전송합니다.
- 분석 결과와 광고 구매 여부는 서로 영향을 주지 않습니다.
- 설정이 비어 있거나 형식이 잘못되면 광고 컴포넌트와 자리 자체를 렌더링하지 않습니다.

## 환경 변수

GitHub 저장소의 **Settings → Secrets and variables → Actions → Variables**에 아래 값을 등록합니다.

```dotenv
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
NEXT_PUBLIC_ADSENSE_LANDING_SLOT=0000000000
NEXT_PUBLIC_ADSENSE_DASHBOARD_SLOT=0000000000
NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL=privacy@example.com
```

`NEXT_PUBLIC_ADSENSE_ENABLED`는 아래 운영 준비를 모두 마친 뒤에만 `true`로 변경합니다. CI가 이 값을 Next.js 빌드에 주입하므로 변경 후 `master` 배포가 한 번 실행되어야 합니다.

## 활성화 체크리스트

1. AdSense 사이트 검토와 계정 승인을 완료합니다.
2. AdSense **Privacy & messaging**에서 Google 인증 CMP를 구성하고 적용 대상 지역의 동의 메시지를 게시합니다.
3. 개인정보 문의에 실제로 응답할 이메일을 `NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL`에 등록합니다.
4. 랜딩과 대시보드용 반응형 광고 단위를 각각 생성하고 슬롯 ID를 등록합니다.
5. 배포 후 `/privacy`, `/advertising-policy`, `/ads.txt` 응답을 확인합니다.
6. 모바일·태블릿·데스크톱에서 광고가 콘텐츠를 가리거나 레이아웃 이동을 유발하지 않는지 확인합니다.
7. 본인 광고를 클릭하지 않으며 개발 환경에서는 자동으로 적용되는 테스트 광고 모드를 사용합니다.
8. AdSense 정책 센터와 무효 트래픽 알림을 정기적으로 확인합니다.

## 후속 버전 기준

### v0.3.0 직접 스폰서십·제휴

- 광고주와 노출 기간을 서버에서 관리합니다.
- 모든 스폰서·제휴 콘텐츠에 경제적 이해관계를 명확히 표시합니다.
- 추천·순위·AI 영향 분석과 광고 계약을 분리합니다.

### v0.4.0 Pro

- 광고 없는 사용 경험을 기본 혜택으로 제공합니다.
- 고급 알림·저장·비교 기능은 결제 전후 권한을 서버에서 검증합니다.
- 결제 사업자와 가격은 구현 시점의 규제·수수료·환불 정책을 검토한 뒤 결정합니다.

### v0.5.0 B2B

- 기사 영향 데이터와 종목 위젯을 API 형태로 제공합니다.
- API 키, 호출량 제한, 감사 로그, SLA와 데이터 재배포 조건을 포함합니다.

## 참고 정책

- [Google AdSense 프로그램 정책](https://support.google.com/adsense/answer/48182)
- [Google 게시자 개인정보 보호 및 메시지](https://support.google.com/adsense/answer/10961068)
- [Google `ads.txt` 가이드](https://support.google.com/adsense/answer/7532444)
- [Google 개인 맞춤 및 비개인 맞춤 광고](https://support.google.com/admanager/answer/9005435)
