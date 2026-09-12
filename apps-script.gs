/**
 * 루카831 강남 오피스텔 랜딩페이지 → 구글시트 상담신청 수집 (+ 디스코드/슬랙 알림)
 * ---------------------------------------------------------------
 * [설치 방법]
 *  1) 구글시트 [확장 프로그램] > [Apps Script] 열기
 *  2) 기존 코드 전부 지우고 이 파일 내용을 붙여넣기
 *  3) 아래 WEBHOOK_URL 에 본인 디스코드/슬랙 웹훅 URL 붙여넣기 (비우면 알림 꺼짐)
 *  4) 저장 후 [배포] > [배포 관리] > 연필(편집) > 버전 '새 버전' > [배포]
 *     (이렇게 하면 웹앱 URL은 그대로 유지됩니다)
 * ---------------------------------------------------------------
 */

// ▼▼▼ 여기에 디스코드 또는 슬랙 웹훅 URL 붙여넣기 (레포에는 올리지 마세요) ▼▼▼
const WEBHOOK_URL = '';
// ▲▲▲ 예) 디스코드: https://discord.com/api/webhooks/....  /  슬랙: https://hooks.slack.com/services/.... ▲▲▲

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
    const row = {
      now:     Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      name:    p.name    || '',
      phone:   p.phone   || '',
      purpose: p.purpose || '',
      time:    p.time    || '',
      source:  p.source  || '',
      page:    p.page    || ''
    };
    sheet.appendRow([row.now, row.name, row.phone, row.purpose, row.time, row.source, row.page]);
    notify(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 디스코드/슬랙 웹훅으로 알림 발송 (URL 형식으로 자동 판별)
function notify(row) {
  if (!WEBHOOK_URL) return;
  const text =
    '🔔 새 상담신청 (루카831)\n' +
    '• 성함: '        + (row.name    || '-') + '\n' +
    '• 휴대폰: '      + (row.phone   || '-') + '\n' +
    '• 분양목적: '    + (row.purpose || '-') + '\n' +
    '• 연락가능시간: ' + (row.time    || '-') + '\n' +
    '• 유입경로: '    + (row.source  || '-') + '\n' +
    '• 접수시각: '    + row.now;

  const isSlack = WEBHOOK_URL.indexOf('hooks.slack.com') > -1;
  const payload = isSlack ? { text: text } : { content: text };
  try {
    UrlFetchApp.fetch(WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (e) {}
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
