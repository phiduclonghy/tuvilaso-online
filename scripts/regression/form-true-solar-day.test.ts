/**
 * formToBirthInfo：晚Týgiờ换ngày要按Giờ Thái Dương Thực判定，与giờThìn支同Nhất口径。
 *
 * giờThìn支按经度校正后的Giờ Thái Dương Thực算，换ngày却曾只看钟表「23 点」，两者错位giờLập lá sốngày差NhấtThiên：
 *   · 东经 100° 钟表 23:30 → Giờ Thái Dương Thực 22:10 Hợigiờ，却被挪到次ngày → 排成次ngàyHợigiờ；
 *   · 东经 135° 钟表 22:30 → Giờ Thái Dương Thực 23:30 晚Týgiờ，却留在本ngày → 排成本ngày早Týgiờ；
 *   · 东经 80° 钟表 00:30 → Giờ Thái Dương Thực前Nhấtngày 21:50 Hợigiờ，却留在本ngày → 排成本ngàyHợigiờ。
 * 换ngày口径与 lib/ziwei/true-solar-time.ts 的 resolveZiweiDayOffset('next-day') Nhất致。
 */
import assert from 'node:assert/strict';
import { formToBirthInfo } from '../../lib/ziwei/share';
import type { BirthFormState } from '../../components/BirthForm';

function formAt(clockHour: string, clockMinute: string, longitude: number): BirthFormState {
  return {
    name: '',
    year: '2000',
    month: '1',
    day: '31',
    clockHour,
    clockMinute,
    unknownTime: false,
    province: longitude === 120 ? '' : '测试',
    city: '',
    longitude,
    gender: 'male',
  };
}

const pick = (b: ReturnType<typeof formToBirthInfo>) => ({ year: b.year, month: b.month, day: b.day, hour: b.hour });

const cases: Array<[string, string, number, { year: number; month: number; day: number; hour: number }, string]> = [
  ['23', '30', 120, { year: 2000, month: 2, day: 1, hour: 0 }, '东经 120° 23:30 晚Týgiờ → 次ngàyTýgiờ'],
  ['0', '30', 120, { year: 2000, month: 1, day: 31, hour: 0 }, '东经 120° 00:30 早Týgiờ → 本ngàyTýgiờ'],
  ['23', '30', 100, { year: 2000, month: 1, day: 31, hour: 11 }, '东经 100° 23:30（Giờ Thái Dương Thực 22:10）→ 本ngàyHợigiờ'],
  ['22', '30', 135, { year: 2000, month: 2, day: 1, hour: 0 }, '东经 135° 22:30（Giờ Thái Dương Thực 23:30）→ 次ngàyTýgiờ'],
  ['0', '30', 80, { year: 2000, month: 1, day: 30, hour: 11 }, '东经 80° 00:30（Giờ Thái Dương Thực前Nhấtngày 21:50）→ 前NhấtngàyHợigiờ'],
  ['23', '50', 130, { year: 2000, month: 2, day: 1, hour: 0 }, '东经 130° 23:50（Giờ Thái Dương Thực次ngày 00:30）→ 次ngàyTýgiờ'],
];

for (const [h, mi, lon, expected, label] of cases) {
  assert.deepEqual(pick(formToBirthInfo(formAt(h, mi, lon))), expected, label);
}

const unknown = formToBirthInfo({ ...formAt('23', '30', 100), unknownTime: true });
assert.deepEqual(pick(unknown), { year: 2000, month: 1, day: 31, hour: 0 }, 'giờThìnBất详Bất换ngày');

console.log('form true-solar day rollover regression passed');
