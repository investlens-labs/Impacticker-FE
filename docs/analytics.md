# 트래픽 분석

Impacticker는 비용 없이 운영 트래픽을 확인하기 위해 Cloudflare Web Analytics를 사용합니다. 방문자를 개인 단위로 추적하지 않는 Cloudflare의 경량 JavaScript 비콘만 사용하며, Google Analytics 같은 별도 분석 SDK는 포함하지 않습니다.

## 운영 구성

| 항목 | 값 |
|---|---|
| 분석 대상 | `impacticker.mandoo4137-a53.workers.dev` |
| 대시보드 | Cloudflare → Analytics → Web analytics |
| 빌드 변수 | `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` |
| 비콘 | `https://static.cloudflareinsights.com/beacon.min.js` |

사이트 토큰은 Cloudflare가 공개 페이지에 삽입하도록 발급하는 식별자이므로 GitHub Actions의 Repository variable로 관리합니다. 토큰이 없거나 32자리 16진수 형식이 아니면 비콘 컴포넌트는 아무것도 렌더링하지 않습니다.

## 확인할 지표

- **Page views / Visits**: 전체 조회수와 방문 수
- **Top pages**: 사용자가 많이 찾는 랜딩·검색·상세 화면
- **Referrers**: 검색엔진, 직접 방문, 외부 링크 유입
- **Countries / Devices / Browsers**: 접속 환경 분포
- **Core Web Vitals**: 실제 사용자 환경의 LCP, INP, CLS

초기에는 주간 단위로 유입 경로와 상위 페이지를 확인하고, 트래픽이 늘면 검색 유입과 회원가입 전환이 높은 화면을 중심으로 개선합니다. 개인을 식별하는 이벤트나 민감한 금융 정보를 분석 데이터에 추가하지 않습니다.

## 배포와 검증

1. GitHub Actions가 Repository variable을 Next.js 빌드에 주입합니다.
2. 루트 레이아웃이 유효한 토큰일 때만 비콘을 `afterInteractive` 전략으로 로드합니다.
3. 운영 스모크 테스트가 랜딩 HTML에서 비콘 URL과 사이트 토큰을 확인합니다.
4. 배포 후 실제 지표가 대시보드에 나타나기까지 몇 분 정도 걸릴 수 있습니다.

로컬에서 비콘 없이 개발하려면 변수를 비워 두면 됩니다. 운영과 동일하게 확인할 때만 `.env.local`에 토큰을 설정하고 서버를 다시 시작합니다.
