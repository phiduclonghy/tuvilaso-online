import type { Palace, ZiweiChart } from './types';

export type YunxianView = 'mingpan' | 'daxian' | 'liunian' | 'xiaoxian' | 'liuyue' | 'liuri' | 'liushi';

/** độc lập童限选择的专用 sentinel；-1 保留给“没有所属实际Đại Hạn”。 */
export const CHILDHOOD_DAXIAN_INDEX = -2;

// Tiểu Hạn与Lưu NiênNhất样按所选Lưu Niên（虚岁）定所属Đại Hạn，故同归 FLOW_VIEWS。
const FLOW_VIEWS = new Set<YunxianView>(['liunian', 'xiaoxian', 'liuyue', 'liuri', 'liushi']);

function isValidDaXianIndex(chart: ZiweiChart, index: number | null | undefined): index is number {
  return typeof index === 'number'
    && Number.isInteger(index)
    && index >= 0
    && index < chart.daXians.length;
}

/** 按虚岁查所属Đại Hạn。Đại Hạnnăm龄区间按首尾均包含处理。 */
export function getDaXianIndexForAge(chart: ZiweiChart, age: number): number {
  if (!Number.isFinite(age)) return -1;
  const safeAge = Math.trunc(age);
  return chart.daXians.findIndex(dx => safeAge >= dx.startAge && safeAge <= dx.endAge);
}

/** Âm lịchLưu Niên换算虚岁后查所属Đại Hạn。 */
export function getDaXianIndexForYear(chart: ZiweiChart, year: number): number {
  if (!Number.isFinite(year)) return -1;
  // UI 的 liunianYear 是Âm lịchLưu Niên。春节前出生者的Âm lịch生năm可能比Dương lịch小 1，
  // 虚岁必须用Âm lịchnăm差，否则整组Đại Hạn边界会晚Nhấtnăm。
  return getDaXianIndexForAge(chart, Math.trunc(year) - chart.lunarInfo.lunarYear + 1);
}

/** Đại Hạn起始虚岁换算为对应Âm lịchLưu Niên。 */
export function getDaXianStartYear(chart: ZiweiChart, index: number): number | null {
  if (!isValidDaXianIndex(chart, index)) return null;
  return chart.lunarInfo.lunarYear + chart.daXians[index].startAge - 1;
}

/** Quay lại该Đại Hạn完整对应的Dương lịchLưu Niên；正常Đại Hạn恰好Thậpnăm。 */
export function getDaXianYears(chart: ZiweiChart, index: number): number[] {
  if (!isValidDaXianIndex(chart, index)) return [];
  const dx = chart.daXians[index];
  const startYear = getDaXianStartYear(chart, index);
  if (startYear === null) return [];
  return Array.from({ length: dx.endAge - dx.startAge + 1 }, (_, offset) => startYear + offset);
}

/** 主流Lập lá số口径把第Nhất实际Đại Hạn之前的 1..起限-1 虚岁作为độc lập童限。 */
export function getChildhoodYears(chart: ZiweiChart): number[] {
  const firstStartAge = chart.daXians[0]?.startAge;
  if (!Number.isFinite(firstStartAge) || firstStartAge <= 1) return [];
  return Array.from({ length: firstStartAge - 1 }, (_, offset) => chart.lunarInfo.lunarYear + offset);
}

export function isChildhoodYear(chart: ZiweiChart, year: number): boolean {
  const age = Math.trunc(year) - chart.lunarInfo.lunarYear + 1;
  const firstStartAge = chart.daXians[0]?.startAge;
  return Number.isFinite(firstStartAge) && age >= 1 && age < firstStartAge;
}

/**
 * 童限大Mệnh相对本MệnhMệnh的Địa支偏移（虚岁 1–5）。
 * 与Tứ张金标准盘逐nămCung底「大Mệnh」同Nhất套：虚岁1=本MệnhMệnh，其后 −4/−1/+3/+4。
 * DươngNamHợi→Mùi→Ngọ→Dậu；ÂmNamHợi→Mùi；DươngNữHợi→Mùi→Ngọ→Dậu→Sửu；立春ÂmNữMùi→Mão→Dần→Tỵ→Dậu。
 */
const CHILDHOOD_MING_OFFSET: Record<number, number> = {
  1: 0,
  2: -4,
  3: -5,
  4: -2,
  5: 2,
};

/**
 * 童限大Mệnh所在本Mệnh（用来取Cung干，再走 getSiHuaByStem / 大昌大曲）。
 * 有Âm lịchLưu Niên且虚岁 1–5：按 CHILDHOOD_MING_OFFSET 走Cung。
 * 无năm或表外năm：ÂmNữ回退Mệnh−2（保住已锁 2026=Tỵ），其余取本MệnhMệnh。
 */
export function getChildhoodDaXianPalace(chart: ZiweiChart, year?: number): Palace | null {
  if (getChildhoodYears(chart).length === 0) return null;
  if (year != null) {
    const age = Math.trunc(year) - chart.lunarInfo.lunarYear + 1;
    if (age in CHILDHOOD_MING_OFFSET) {
      const branch = ((chart.mingGongBranch + CHILDHOOD_MING_OFFSET[age]) % 12 + 12) % 12;
      return chart.palaces.find((p) => p.branch === branch) ?? null;
    }
  }
  const yinFemale = chart.yinYangGender === 'ÂmNữ'
    || (chart.birthInfo.gender === 'female' && chart.lunarInfo.yearStem % 2 === 1);
  const branch = yinFemale
    ? ((chart.mingGongBranch - 2) % 12 + 12) % 12
    : chart.mingGongBranch;
  return chart.palaces.find((p) => p.branch === branch) ?? null;
}

/**
 * 所有运限界面共用的Đại Hạn来源：
 * - Đại Hạn视图使用用户点选的Đại Hạn；
 * - Lưu Niên、Lưu Nguyệt、Lưu Nhật、Lưu Thời使用所选Lưu Niên实际所属的Đại Hạn；
 * - 本Mệnh或异常Nhập回退现实当前Đại Hạn。
 */
export function resolveEffectiveDaXianIndex(
  chart: ZiweiChart,
  view: YunxianView,
  liunianYear: number,
  selectedDaXianIndex?: number | null,
): number {
  if (view === 'daxian' && isValidDaXianIndex(chart, selectedDaXianIndex)) {
    return selectedDaXianIndex;
  }
  if (view === 'daxian' && selectedDaXianIndex === CHILDHOOD_DAXIAN_INDEX && getChildhoodYears(chart).length > 0) {
    return CHILDHOOD_DAXIAN_INDEX;
  }

  if (FLOW_VIEWS.has(view)) {
    const yearIndex = getDaXianIndexForYear(chart, liunianYear);
    // -1 表示童限或超出已生成的Đại Hạn范围；Bất能错误回退到现实当前Đại Hạn。
    return isValidDaXianIndex(chart, yearIndex) ? yearIndex : -1;
  }

  if (isValidDaXianIndex(chart, chart.currentDaXianIndex)) return chart.currentDaXianIndex;
  // 真实童限giờ currentDaXianIndex=-1；Bất能为了有值而误套第Nhất个实际Đại Hạn。
  return -1;
}
