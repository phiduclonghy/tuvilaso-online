import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { branchFromSolarMinutes, resolveZiweiDayOffset, shiftGregorianDate } from './true-solar-time';

/** 根据北京giờ间 + 经度计算Giờ Thái Dương ThựcgiờThìn支 (0-11) */
export function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

/** BirthFormState → BirthInfo
 *
 * Týgiờ规则（倪海厦体系/Tam Hợp派标准）：
 * · 23:00-23:59 = 晚Týgiờ，**按次ngày**Lập lá số（ngày期 +1）
 * · 00:00-00:59 = 早Týgiờ，按本ngàyLập lá số
 * 这与「giờThìn支同为Tý(0)」并Bất冲突——Týgiờ分早晚两段，需要在ngày期上区分。
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;
  let hour = 0;

  // 晚Týgiờ换ngày按Giờ Thái Dương Thực判定，与giờThìn支同Nhất口径（见 true-solar-time.ts 的 resolveZiweiDayOffset）。
  // 只看钟表 23 点会和经度校正后的giờThìn错位：东经 100° 钟表 23:30 是Giờ Thái Dương Thực 22:10 Hợigiờ，Bất该换ngày。
  if (!form.unknownTime) {
    const solar = (parseInt(form.clockHour) || 0) * 60 + (parseInt(form.clockMinute) || 0) + (form.longitude - 120) * 4;
    const normalizedMinutes = ((solar % 1440) + 1440) % 1440;
    hour = branchFromSolarMinutes(normalizedMinutes);
    const dayOffset = resolveZiweiDayOffset({ dayOffset: Math.floor(solar / 1440), normalizedMinutes, branch: hour });
    if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
      ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
    }
  }

  return {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
  };
}

/** BirthFormState → URLSearchParams（用于Chia sẻ链接） */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== 120) p.set('lo', String(form.longitude));
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>，Bất完整giờQuay lại null */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || '120'),
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
