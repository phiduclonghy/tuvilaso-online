/**
 * 样本giờThìnNhất致性回归（对应 issue #26）
 *
 * FAMOUS_PERSONS 里的 `hour` 是**giờThìnĐịa支索引 0–11**（0=Tý … 11=Hợi），
 * Bất是 0–23 的小giờ数。Lịch sử上注释与索引曾经对Bất上（11 条里错 7 条：
 * hour 5 写成「Ngọgiờ」实为Tỵgiờ、3 写成「Dầngiờ」实为Mãogiờ、4 写成「Mãogiờ」实为Thìngiờ）。
 *
 * 这条回归钉住两件事：
 *   1. 每条样本的 hour 必须落在 0–11；
 *   2. 带「Xgiờ」注释的样本，注释必须与索引对应的Địa支Nhất致。
 *
 * 走源码解析而非运行giờ import —— famous.ts 带 `server-only`，
 * 直接跑需要额外的 node 条件参数，解析源码更省事也更跨Bình台。
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const BRANCH_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const src = readFileSync(new URL('../../lib/ziwei/famous.ts', import.meta.url), 'utf8');

const rows = [...src.matchAll(/hour:\s*(\d+),?[ \t]*(?:\/\/[ \t]*(.*))?/g)];
assert.ok(rows.length > 0, 'famous.ts 里没解析到任何 hour 字段，正则或文件结构变了');

let annotated = 0;
for (const [, raw, comment] of rows) {
  const hour = Number(raw);
  assert.ok(
    Number.isInteger(hour) && hour >= 0 && hour <= 11,
    `hour 必须是 0–11 的giờThìnĐịa支索引，实际 ${raw}`,
  );
  if (!comment) continue;
  const named = BRANCH_NAMES.find((b) => comment.includes(`${b}giờ`));
  if (!named) continue;
  annotated++;
  assert.equal(
    named,
    BRANCH_NAMES[hour],
    `hour: ${hour} 的注释写着「${named}giờ」，但索引 ${hour} 实际是「${BRANCH_NAMES[hour]}giờ」`,
  );
}

console.log(`✅ 样本giờThìnNhất致性：${rows.length} 条样本 hour 均在 0–11，其中 ${annotated} 条带giờThìn注释且与索引Nhất致`);
