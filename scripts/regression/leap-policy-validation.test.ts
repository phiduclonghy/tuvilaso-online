/**
 * 回归：闰tháng归属 policy 的运行giờ校验与Tứ口径互异性。
 *
 * `generateChart` / `resolveEffectiveLunarDate` 可从运行giờ JavaScript 与 JSON API 直接调用，
 * `LunarMonthPolicy` 的字面量联合类型形同虚设。拼错的 policy 原本会落进 if/else 链尾部、
 * 静默按「归本tháng」Lập lá số，且错误值随 `chart.birthInfo.leapMonthPolicy` 序列化传播——
 * 与 gender 校验（#38）同族：类型在运行giờBất设防。
 *
 * 口径神谕表（độc lập誊写自 README/注释里的Tứ口径定义，Bất引用被测实现的分支）：
 * 对闰tháng内的某ngày（rawLunarDay 记 d）：
 *   origin-month → 真闰本tháng（isLeapMonth=true，tháng份Bất变）
 *   prev-month   → 归本tháng（isLeapMonth=false，tháng份Bất变）
 *   split        → d ≤ 15 归本tháng，d > 15 归下tháng（isLeapMonth=false）
 *   next-month   → 归下tháng（tháng份 +1，isLeapMonth=false）
 *
 * 为什么值Đắc这么较真：闰tháng归属差Nhất个tháng，Mệnh/Thân/Tứ Hóa整盘皆错，而拼错 policy
 * 原本没有任何报错。
 */
import { generateChart, resolveEffectiveLunarDate } from '../../lib/ziwei/algorithm';

const POLICIES = ['split', 'next-month', 'prev-month', 'origin-month'] as const;

/** 2025 năm闰Lụctháng（Dương lịch 2025-07-25 ~ 2025-08-22），取上半tháng与下半tháng各NhấtThiên。 */
const LEAP_MONTH_DATES: Array<[number, number, number]> = [
  [2025, 8, 10], // 闰Lụctháng初Thập（上半tháng）
  [2025, 8, 18], // 闰Lụctháng下旬（下半tháng）
];

let bad = 0;
const fail = (m: string) => { bad++; console.log(`  ❌ ${m}`); };

/* ── ① 无效 policy 必须当场 RangeError ──────────────────────────── */
{
  console.log('① 无效 policy 当场拒Tuyệt');
  const invalid: unknown[] = ['nextmonth', 'next-monthh', '', 'NEXT-MONTH', null, 42, true];
  for (const p of invalid) {
    try {
      resolveEffectiveLunarDate(2025, 8, 10, p as never);
      fail(`policy=${JSON.stringify(p)} Mùi被拒Tuyệt（静默按归本thángLập lá số）`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!(e instanceof RangeError) || !msg.includes('leapMonth policy')) {
        fail(`policy=${JSON.stringify(p)} 抛错类型/信息Bất对：${msg}`);
      }
    }
  }
  if (!bad) console.log('  ✅ 7 个无效值Tất cả RangeError 且信息点名 leapMonth policy');
}

/* ── ② 显式 undefined = 走默认值，BấtĐắc报错 ──────────────────────── */
{
  console.log('② 显式 undefined 走默认 prev-month');
  try {
    const r = resolveEffectiveLunarDate(2025, 8, 10);
    console.log('  ✅ 默认口径可用');
    void r;
  } catch (e) {
    fail(`默认调用被误拒：${e instanceof Error ? e.message : String(e)}`);
  }
}

/* ── ③ Tứ口径在闰tháng内互异，且与神谕表逐项Nhất致 ────────────────────── */
{
  console.log('③ Tứ口径与神谕表逐项Nhất致（闰Lụctháng上/下半tháng各NhấtThiên）');
  for (const [y, m, d] of LEAP_MONTH_DATES) {
    for (const policy of POLICIES) {
      const r = resolveEffectiveLunarDate(y, m, d, policy);
      if (r.rawLunarMonth !== -6) {
        fail(`${y}-${m}-${d} Bất是闰Lụctháng（rawLunarMonth=${r.rawLunarMonth}），神谕表基准失效`);
        continue;
      }
      const day = r.rawLunarDay;
      // 神谕表：按Tứ口径定义độc lập誊写
      const want =
        policy === 'origin-month' ? { month: 6, leap: true }
        : policy === 'prev-month' ? { month: 6, leap: false }
        : policy === 'next-month' ? { month: 7, leap: false }
        : (day > 15 ? { month: 7, leap: false } : { month: 6, leap: false });
      if (r.lunarMonth !== want.month || r.isLeapMonth !== want.leap) {
        fail(`${policy} @ 闰Lụctháng${day}ngày → 实Đắc (tháng${r.lunarMonth}, 闰=${r.isLeapMonth})，应为 (tháng${want.month}, 闰=${want.leap})`);
      }
    }
  }
  if (!bad) console.log('  ✅ Tứ口径 × 两ngày期Tất cả与神谕表Nhất致');
}

/* ── ④ generateChart 端到端：合法 policy 正常Lập lá số并回写 ──────────── */
{
  console.log('④ generateChart 端到端（合法 policy Lập lá số并回写 leapMonthPolicy）');
  for (const policy of POLICIES) {
    try {
      const chart = generateChart(
        { year: 2025, month: 8, day: 10, hour: 5, gender: 'female' },
        { leapMonth: policy },
      );
      const echoed = (chart.birthInfo as { leapMonthPolicy?: string }).leapMonthPolicy;
      if (echoed !== policy) fail(`policy=${policy} 回写Bất符：${String(echoed)}`);
      if (!chart.palaces || chart.palaces.length !== 12) fail(`policy=${policy} Lập lá số结果异常`);
    } catch (e) {
      fail(`policy=${policy} Lập lá số抛错：${e instanceof Error ? e.message : String(e)}`);
    }
  }
  if (!bad) console.log('  ✅ Tứ口径端到端Lập lá số正常，leapMonthPolicy 回写Nhất致');
}

if (bad) {
  console.error(`\n❌ ${bad} 项Bất符 —— 闰tháng归属 policy 校验或口径与定义BấtNhất致，会导致整盘错位。`);
  process.exit(1);
}
console.log('\n✅ Tất cả通过：无效 policy 当场拒Tuyệt，Tứ口径互异且与定义Nhất致。');
