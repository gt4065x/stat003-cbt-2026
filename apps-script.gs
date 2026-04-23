// ================================================================
//  경영통계 003분반 중간고사 CBT - Google Drive 수신 서버
//  [설치 방법]
//  1. https://script.google.com 접속 (gt4065x@gmail.com 로그인)
//  2. 새 프로젝트 → 아래 코드 전체 붙여넣기
//  3. 상단 메뉴 [배포] → [새 배포]
//  4. 유형: 웹 앱 / 다음 사용자로 실행: 나(교수 계정) / 액세스 권한: 모든 사용자
//  5. [배포] 클릭 → 생성된 URL 복사
//  6. exam.html 상단의 DRIVE_ENDPOINT 변수에 해당 URL 붙여넣기
// ================================================================

const FOLDER_NAME = '경영통계003_중간고사_답안';

function doPost(e) {
  try {
    const raw = e.postData.contents;
    const data = JSON.parse(raw);

    const meta    = data.meta || {};
    const sid     = meta.studentId   || 'unknown';
    const sname   = meta.studentName || 'unknown';
    const subAt   = meta.submittedAt || new Date().toISOString();
    const ts      = subAt.substring(0, 19).replace('T', '_').replace(/:/g, '-');
    const fileName = `답안_${sid}_${sname}_${ts}.json`;

    const folder = getOrCreateFolder(FOLDER_NAME);
    folder.createFile(
      fileName,
      JSON.stringify(data, null, 2),
      MimeType.PLAIN_TEXT
    );

    const response = { success: true, file: fileName };
    return buildResponse(response);

  } catch (err) {
    const response = { success: false, error: err.toString() };
    return buildResponse(response);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('경영통계 CBT 수신 서버 정상 작동 중 ✓');
}

function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateFolder(name) {
  const iter = DriveApp.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : DriveApp.createFolder(name);
}
