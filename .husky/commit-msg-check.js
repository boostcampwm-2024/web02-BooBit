// .husky/commit-msg-check.js
const fs = require('fs');

const msgPath = process.env.HUSKY_GIT_PARAMS || '.git/COMMIT_EDITMSG';
const message = fs.readFileSync(msgPath, 'utf-8').trim();

const commitMessageRegex = /^(📝Docs\.|♻️Refactor\.|✨Feat\.|🐛Fix\.|⚡️Improve\.|🛠️Update\.|⚙️Config\.)/;

if (!commitMessageRegex.test(message)) {
  console.error(`
    ⛔️ 커밋 메시지 규칙을 지켜주세요!
    포멧 : type. titleName #issue
    - 사용 가능한 이모지와 텍스트 매핑:
      📝Docs: 문서 추가, 삭제, 수정
      ♻️Refactor: 코드 리팩토링
      ✨Feat: 새로운 기능 추가
      🐛Fix: 예상치 못한 버그 수정
      ⚡️Improve: 기존 기능 향상 (기능적)
      🛠️Update: 기존 기능 개선 (코드 품질)
      ⚙️Config : 개발환경 관련 설정
    - 예시: "📝 Docs: 문서 추가"
  `);
  process.exit(1);
}