/**
 * 防再犯：同Cung两颗本MệnhTứ HóaSao ≠ bug。
 * Mậunăm（默认Tứ Hóa表）：Tham LangLộc、Thái ÂmQuyền、Hữu BậtKhoa、Thiên CơKỵ —— 可落在同NhấtCung。
 * 金标准 case：1988-10-08 MùigiờNam → Mệnh Thiên CơKỵ+Thái ÂmQuyền；Phụ Mẫu Tham LangLộc+Hữu BậtKhoa。
 */
import assert from 'node:assert/strict';
import { generateChart } from '../../lib/ziwei/algorithm';
import { SCHOOL_SIHUA_DEFAULT, SCHOOL_STAR_ID_TO_NAME } from '../../lib/ziwei/school-data';

// Mậu = index 5 in SCHOOL_SIHUA_DEFAULT rows (row0 pad, Giáp..Quý = 1..10)
const wu = SCHOOL_SIHUA_DEFAULT[5];
assert.deepEqual(wu, [0, 9, 8, 18, 2], '默认MậunămTứ Hóa表被改动');
assert.equal(SCHOOL_STAR_ID_TO_NAME[9], 'Tham Lang');
assert.equal(SCHOOL_STAR_ID_TO_NAME[8], 'Thái Âm');
assert.equal(SCHOOL_STAR_ID_TO_NAME[18], 'Hữu Bật');
assert.equal(SCHOOL_STAR_ID_TO_NAME[2], 'Thiên Cơ');

const chart = generateChart({ year: 1988, month: 10, day: 8, hour: 7, gender: 'male' });
const byPalace = new Map<string, string[]>();
for (const p of chart.palaces) {
  const hits = p.stars.filter(s => s.siHua).map(s => `${s.name}:${s.siHua}`);
  if (hits.length) byPalace.set(p.name, hits);
}

assert.deepEqual(byPalace.get('Mệnh')?.sort(), ['Thiên Cơ:Kỵ', 'Thái Âm:Quyền'].sort());
assert.deepEqual(byPalace.get('Phụ Mẫu')?.sort(), ['Tham Lang:Lộc', 'Hữu Bật:Khoa'].sort());
assert.equal(
  [...byPalace.values()].filter(v => v.length >= 2).length,
  2,
  'Mậunăm此盘应有两Cung各含两颗本MệnhTứ HóaSao',
);

console.log('✓ natal dual-sihua same palace (Mậunăm·默认Tứ Hóa表) is valid, not a display bug');
