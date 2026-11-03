/**
 * BirthForm → BirthInfo 转换Nhất致性回归
 *
 * 背景：`BirthFormState → BirthInfo` 的转换在本仓库里必须只有Nhất处实现——
 * `lib/ziwei/share.ts` 的 `formToBirthInfo()`，它负责「晚Týgiờ换ngày」：
 * 23:00–23:59 出生按**次ngày**Lập lá số。这条规则是Tam处规格共同Xác nhận的：
 *   · `lib/ziwei/types.ts` 声明 `BirthInfo.year` 是「已经过Týgiờ换ngày修正后的Lập lá sốngày」；
 *   · `README.md` giờThìn对照表下Nhất行：「23:00–23:59 出生（晚Týgiờ）按次ngàyLập lá số、giờThìn取 0」；
 *   · `scripts/regression/iztro-time-index-boundary.test.ts` 已把它钉成断言。
 *
 * 但 `components/BirthForm.tsx` 的 `handleSubmit` 曾经自行拼装 BirthInfo，
 * `year/month/day` 直接用表单原值，绕过了换ngày。于是同Nhất次出生Nhập：
 *   · `/chart`（`BirthForm.onSubmit` → `generateChart`）排出「填的那Thiên」的盘；
 *   · `/heming`（`formToBirthInfo` → `generateChart`）排出「次ngày」的盘。
 * 两条路径相差Nhất整Thiên，整张Lá số（ThậpNhịCung、Tinh Diệu、Tứ Hóa）都BấtNhất样。
 *
 * 本回归钉住Tam件事：
 *   1. BirthForm 必须复用 `formToBirthInfo`，BấtĐắc自行拼装 BirthInfo；
 *   2. BirthForm BấtĐắc再带Nhất份自Kỷ的 `calcTrueSolarBranch`（Giờ Thái Dương Thực只有Nhất处实现）；
 *   3. `formToBirthInfo` 的晚Týgiờ / 早Týgiờ边界行为，含跨tháng与跨năm进位。
 *
 * 第 1、2 条走源码解析（组件是 .tsx，仓库没有 DOM 测试环境），
 * 与 `famous-hour-consistency.test.ts` 同Nhất做法。
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formToBirthInfo } from '../../lib/ziwei/share';
import type { BirthFormState } from '../../components/BirthForm';

const src = readFileSync(new URL('../../components/BirthForm.tsx', import.meta.url), 'utf8');

// ── 1) 转换只有Nhất处实现：BirthForm 必须复用 share.ts ──────────────
assert.match(
  src,
  /import\s*\{[^}]*\bformToBirthInfo\b[^}]*\}\s*from\s*'@\/lib\/ziwei\/share'/,
  'BirthForm 必须从 @/lib/ziwei/share 引入 formToBirthInfo，Bất能自Kỷ拼 BirthInfo',
);

assert.equal(
  /onSubmit\(\s*\{/.test(src),
  false,
  'BirthForm 的 onSubmit Bất应收到手拼的对象字面量——晚Týgiờ换ngày会因此被绕过，请改走 formToBirthInfo',
);

// ── 2) Giờ Thái Dương ThựcgiờThìn只有Nhất处实现 ─────────────────────────────────
assert.equal(
  /function\s+calcTrueSolarBranch\s*\(/.test(src),
  false,
  'BirthForm BấtĐắc重复实现 calcTrueSolarBranch，请复用 lib/ziwei/share.ts 的同名导出',
);

// ── 3) formToBirthInfo 的边界行为 ───────────────────────────────
function formAt(
  year: string,
  month: string,
  day: string,
  clockHour: string,
  clockMinute = '30',
  overrides: Partial<BirthFormState> = {},
): BirthFormState {
  return {
    name: '',
    year,
    month,
    day,
    clockHour,
    clockMinute,
    unknownTime: false,
    province: '',
    city: '',
    longitude: 120,
    gender: 'male',
    ...overrides,
  };
}

const pick = (b: ReturnType<typeof formToBirthInfo>) => ({
  year: b.year,
  month: b.month,
  day: b.day,
  hour: b.hour,
});

// 晚Týgiờ：按次ngàyLập lá số、giờThìn取 0
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '23'))),
  { year: 2000, month: 2, day: 1, hour: 0 },
  '1/31 23:30 晚Týgiờ应排到 2/1、giờThìn支 0',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '12', '31', '23'))),
  { year: 2001, month: 1, day: 1, hour: 0 },
  '跨năm：12/31 23:30 应排到次năm 1/1',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '2', '28', '23'))),
  { year: 2000, month: 2, day: 29, hour: 0 },
  '闰năm：2/28 23:30 应排到 2/29',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2001', '2', '28', '23'))),
  { year: 2001, month: 3, day: 1, hour: 0 },
  'Bìnhnăm：2/28 23:30 应排到 3/1',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '23', '0'))),
  { year: 2000, month: 2, day: 1, hour: 0 },
  '23:00 整点即进入晚Týgiờ',
);

// 早Týgiờ与 22:xx：Bất换ngày
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '0'))),
  { year: 2000, month: 1, day: 31, hour: 0 },
  '00:30 早Týgiờ留在本ngày、giờThìn支同为 0',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '22', '59'))),
  { year: 2000, month: 1, day: 31, hour: 11 },
  '22:59 是Hợigiờ，Bất应换ngày',
);

// giờThìnBất详：Bất换ngày、支取 0
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '23', '30', { unknownTime: true }))),
  { year: 2000, month: 1, day: 31, hour: 0 },
  'giờThìnBất详giờBất应按晚Týgiờ换ngày',
);

console.log('✅ BirthForm→BirthInfo 转换Nhất致性：单Nhất实现 + 晚Týgiờ边界（跨tháng/跨năm）均正确');
