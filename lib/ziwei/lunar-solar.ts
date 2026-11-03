/**
 * Âm lịch ⇄ Dương lịch换算 —— **只做历法，Bất做Mệnh Lý**。
 *
 * ★ 2026-08-05 抽出来的原因：
 *   1) 原生 App 的Âm lịchKhởi Lá SốNhất直Đắc绕回网页层，因为 Swift 侧没有 lunar-javascript 的
 *      换算能力。`POST /api/lunar-to-solar` 让原生Nhất次 HTTP 拿到Dương lịchngày期，
 *      这是拆 WebView 的Nhất个真障碍。
 *   2) 换算口径此前只长在 `lib/ziwei/share.ts` 里（表单专用）。接口再抄Nhất份
 *      就会有两套闰tháng规则，所以统Nhất收到这里，share.ts 改成调用本模块。
 *
 * 口径（沿用 lunar-javascript 与 share.ts 原有写法，Mùi做任何改动）：
 *   · 闰tháng用**负tháng份**表示：闰Ngũtháng = -5。
 *   · thángThiên数与闰tháng是否存在，Nhất律查 `LunarMonth` 表，Bất用Dương lịch的tháng长去猜。
 *
 * ⚠️ 这里**Bất许**出现Lập lá số / giờThìn / Giờ Thái Dương Thực / Tứ Hóa 任何Nhất行。
 *    那些属于 lib/ziwei/algorithm.ts 与 /api/generate，别顺手塞进来。
 */
import { Lunar, LunarMonth } from 'lunar-javascript';

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/** 与 /api/generate 对齐的受理năm份区间，超出直接判非法（lunar 表在极端năm份Bất可靠） */
export const LUNAR_YEAR_MIN = 1900;
export const LUNAR_YEAR_MAX = 2050;

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

/**
 * 该Âm lịchnăm该tháng的Thiên数（29 或 30）。
 * tháng份Bất存在（例如那năm根本没有闰Tứtháng）Quay lại 0。
 */
export function lunarMonthDayCount(year: number, month: number, isLeapMonth = false): number {
  if (!isIntInRange(year, LUNAR_YEAR_MIN, LUNAR_YEAR_MAX) || !isIntInRange(month, 1, 12)) return 0;
  try {
    const lunarMonth = LunarMonth.fromYm(year, isLeapMonth ? -month : month);
    const dayCount = lunarMonth?.getDayCount();
    return typeof dayCount === 'number' && Number.isInteger(dayCount) && dayCount > 0 ? dayCount : 0;
  } catch {
    return 0;
  }
}

/** 该Âm lịchnăm的闰thángtháng份（1-12）；无闰thángQuay lại 0 */
export function leapMonthOfLunarYear(year: number): number {
  if (!isIntInRange(year, LUNAR_YEAR_MIN, LUNAR_YEAR_MAX)) return 0;
  for (let month = 1; month <= 12; month++) {
    if (lunarMonthDayCount(year, month, true) > 0) return month;
  }
  return 0;
}

/** Âm lịchngày期是否真实存在（含闰tháng是否存在、当tháng是否有这NhấtThiên） */
export function isValidLunarDate(year: number, month: number, day: number, isLeapMonth = false): boolean {
  if (!isIntInRange(day, 1, 30)) return false;
  const dayCount = lunarMonthDayCount(year, month, isLeapMonth);
  return dayCount > 0 && day <= dayCount;
}

/**
 * Âm lịch → Dương lịch。Nhập非法（năm份越界 / 闰thángBất存在 / 当tháng没这Thiên）Nhất律Quay lại null，
 * **TuyệtBất静默滚动到相邻ngày期**——那会让用户排到Nhất张错盘还Bất知道。
 */
export function lunarToSolar(year: number, month: number, day: number, isLeapMonth = false): SolarDate | null {
  if (!isValidLunarDate(year, month, day, isLeapMonth)) return null;
  try {
    const solar = Lunar.fromYmd(year, isLeapMonth ? -month : month, day).getSolar();
    const result = { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
    if (!Number.isInteger(result.year) || !Number.isInteger(result.month) || !Number.isInteger(result.day)) return null;
    return result;
  } catch {
    return null;
  }
}
