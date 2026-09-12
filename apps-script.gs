/**
 * 루카831 강남 오피스텔 랜딩페이지 → 구글시트 상담신청 수집
 * ---------------------------------------------------------------
 * [설치 방법]
 *  1) 구글시트 새로 만들기 (sheets.new)
 *  2) 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
 *  3) 기존 코드 전부 지우고 이 파일 내용을 붙여넣기 > 저장
 *  4) 우측 상단 [배포] > [새 배포] > 유형 '웹 앱' 선택
 *       - 설명: luca831
 *       - 다음 사용자 인증 정보로 실행: '나(내 계정)'
 *       - 액세스 권한이 있는 사용자: '모든 사용자'
 *  5) [배포] > 권한 승인 > 나오는 웹 앱 URL(.../exec) 복사
 *  6) 그 URL을 index.html 의 ENDPOINT 값에 붙여넣기
 * ---------------------------------------------------------------
 */

const SHEET_NAME = '상담신청';
const HEADERS = ['접수시각', '성함', '휴대폰', '분양목적', '연락가능시간', '유입경로', '페이지'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const p = (e && e.parameter) || {};
    const now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([
      now,
      p.name    || '',
      p.phone   || '',
      p.purpose || '',
      p.time    || '',
      p.source  || '',
      p.page    || ''
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 브라우저에서 웹앱 URL을 그냥 열었을 때 정상 동작 확인용
function doGet() {
  return json({ ok: true, message: '루카831 상담신청 수집 엔드포인트 정상 동작 중' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
