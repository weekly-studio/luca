/* =============================================================
 * Google Analytics 4 (gtag.js) — 공통 로더
 * 모든 페이지가 이 파일 하나를 불러옵니다. 측정 ID와 개인정보
 * 보호 설정은 반드시 여기 한 곳에서만 관리하세요.
 *
 * ⚠ 개인정보 보호 규칙 (반드시 지킬 것)
 *   - 성함, 연락처, 전화번호, 이메일 등 개인을 식별할 수 있는
 *     정보(PII)는 절대 이벤트 파라미터/사용자 속성으로 전송하지
 *     않습니다. (gtag('event', ...) 에 이름·연락처 등 금지)
 *   - IP 주소는 anonymize_ip 로 익명화합니다.
 * ============================================================= */
(function () {
  // TODO: 실제 GA4 측정 ID(G-로 시작)로 교체하세요.
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  // gtag.js 라이브러리 비동기 로드 (페이지 렌더링을 막지 않음)
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  // dataLayer / gtag 초기화.
  // 기존 태그(예: Google Ads)가 이미 정의해 두었다면 그대로 공유합니다.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  window.gtag('js', new Date());

  // 페이지뷰 자동 수집은 기본값(enhanced measurement) 유지.
  // anonymize_ip: IP 익명화. (개인정보 파라미터는 전송하지 않음)
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true
  });
})();
