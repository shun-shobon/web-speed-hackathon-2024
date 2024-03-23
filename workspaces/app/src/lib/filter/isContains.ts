type Params = {
  query: string;
  target: string;
};

function hiraganaToKatakana(str: string) {
  return str.replace(/[\u3041-\u3096]/g, (match) => String.fromCharCode(match.charCodeAt(0) + 0x60));
}

function normalizeString(str: string) {
  // Unicode 正規化と大文字化で基本的な統一を図る
  return str.normalize('NFKC').toUpperCase();
}

export function isContains({ query, target }: Params) {
  // ひらがなをカタカナに統一
  const normalizedQuery = normalizeString(hiraganaToKatakana(query));
  const normalizedTarget = normalizeString(hiraganaToKatakana(target));

  // 統一された形式で含まれているかチェック
  return normalizedTarget.includes(normalizedQuery);
}
