/**
 * Tứ Hóa工具模块 — năm干 / Đại HạnCung干 / Lưu Niên干 / Lưu Nguyệt干 / Lưu Nhật干 / Lưu Thời干
 *                + Cung干自化检测 + Lai NhânCung追溯
 *
 * Lập lá số口径（2026-07-21 铁律：Lập lá số以金标准盘为准）：
 *   本MệnhTứ Hóa = 出生nămThiên干Tứ Hóa（盘上朱红印章，始终Hiển thị）
 *   运限Tứ Hóa = Đại HạnCung干 / Lưu Niên干 / Lưu Nguyệt干 / Lưu Nhật干 / Lưu Thời干 → 叠层色章
 * 论断正文仍按倪师；本模块供Lập lá số叠层使用。
 */

import { Lunar } from 'lunar-javascript';
import type { ZiweiChart, Palace, SiHua } from './types';
import { SI_HUA_TABLE, STEMS } from './constants';
import { CHILDHOOD_DAXIAN_INDEX, getChildhoodDaXianPalace } from './yunxian-context';

// ─── 1) 由Thiên干索引取Tứ HóaTứSao ───────────────────────────────────
/** Thiên干索引 0-9 → { Lộc, Quyền, Khoa, Kỵ } 对应Sao名 */
export function getSiHuaByStem(stemIndex: number): Record<SiHua, string> {
  const arr = SI_HUA_TABLE[stemIndex];
  if (!arr) return { Lộc: '', Quyền: '', Khoa: '', Kỵ: '' };
  return { Lộc: arr[0], Quyền: arr[1], Khoa: arr[2], Kỵ: arr[3] };
}

/** Sao名 → Tứ Hóa类型（由某Thiên干Xác nhận） */
export function buildStarSiHuaMap(stemIndex: number): Record<string, SiHua> {
  const arr = SI_HUA_TABLE[stemIndex];
  if (!arr) return {};
  return { [arr[0]]: 'Lộc', [arr[1]]: 'Quyền', [arr[2]]: 'Khoa', [arr[3]]: 'Kỵ' };
}

// ─── 2) Dương lịchnăm → Niên TrụThiên干索引 ──────────────────────────────────
/** Dương lịchnăm份 → Niên TrụThiên干索引（0=Giáp, ... 9=Quý） */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** Dương lịchnăm份 → Niên TrụĐịa支索引（0=Tý, ... 11=Hợi） */
export function getYearBranchIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

// ─── 3) Đại HạnTứ Hóa：取Đại HạnCung的Cung干（非本Mệnhnăm干）───────────────
/**
 * Đại HạnCung干Tứ Hóa
 * @param chart Lá số
 * @param dxIndex Đại Hạn索引（chart.daXians[dxIndex]）；童限传 CHILDHOOD_DAXIAN_INDEX
 * @returns 该Đại Hạn的Tứ HóaTứSao
 */
export function getDaXianSiHua(
  chart: ZiweiChart,
  dxIndex: number,
  year?: number,
): { stemIndex: number; stemName: string; transforms: Record<SiHua, string> } | null {
  const dxPalace = dxIndex === CHILDHOOD_DAXIAN_INDEX
    ? getChildhoodDaXianPalace(chart, year)
    : (() => {
        const dx = chart.daXians[dxIndex];
        if (!dx) return null;
        return chart.palaces.find(p => p.branch === dx.palaceBranch) ?? null;
      })();
  if (!dxPalace) return null;
  const stemIndex = dxPalace.stem;
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 4) Lưu NiênTứ Hóa ──────────────────────────────────────────────
export function getLiuNianSiHua(year: number): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
} {
  const stemIndex = getYearStemIndex(year);
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 5) Lưu NguyệtTứ Hóa（Nguyệt TrụThiên干，由năm干 + tháng序推） ───────────────
/**
 * Lưu NguyệtThiên干（Ngũ虎遁：GiápKỷnăm起BínhDần、ẤtCanhnăm起MậuDần、BínhTânnăm起CanhDần、ĐinhNhâmnăm起NhâmDần、MậuQuýnăm起GiápDần）
 * month: Âm lịchtháng 1-12
 */
export function getLiuYueStemIndex(yearStem: number, month: number): number {
  // Ngũ虎遁：正tháng（Dầntháng）Thiên干
  const startStemOfYin: Record<number, number> = {
    0: 2, 5: 2,  // GiápKỷ → Bính
    1: 4, 6: 4,  // ẤtCanh → Mậu
    2: 6, 7: 6,  // BínhTân → Canh
    3: 8, 8: 8,  // ĐinhNhâm → Nhâm
    4: 0, 9: 0,  // MậuQuý → Giáp
  };
  const yinStem = startStemOfYin[yearStem] ?? 0;
  // 从Dần（正tháng）到目标tháng（month 取 1-12）
  return (yinStem + ((month - 1) % 12) + 10) % 10;
}

export interface LiuYueSiHuaOptions {
  /** 闰thángLưu Nguyệt按实际Âm lịchngày的前后半tháng取本tháng/下tháng口径。 */
  isLeapMonth?: boolean;
  liuriDay?: number;
  /** 闰ThậpNhịtháng后半段跨到次năm正thánggiờ使用的năm干。 */
  nextYearStem?: number;
}

export function getEffectiveLiuYueMonth(month: number, options: LiuYueSiHuaOptions = {}): number {
  const normalizedMonth = Math.max(1, Math.min(12, Math.trunc(month)));
  if (!options.isLeapMonth || (options.liuriDay ?? 1) <= 15) return normalizedMonth;
  return normalizedMonth >= 12 ? 1 : normalizedMonth + 1;
}

export function getLiuYueSiHua(yearStem: number, month: number, options: LiuYueSiHuaOptions = {}): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
  month: number;
} {
  const effectiveMonth = getEffectiveLiuYueMonth(month, options);
  const sourceYearStem = options.isLeapMonth
    && effectiveMonth === 1
    && (options.liuriDay ?? 1) > 15
    ? (options.nextYearStem ?? yearStem)
    : yearStem;
  const stemIndex = getLiuYueStemIndex(sourceYearStem, effectiveMonth);
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
    month: effectiveMonth,
  };
}

// ─── 5b) Lưu NhậtTứ Hóa（Âm lịchNhật TrụThiên干）──────────────────────────────
/**
 * Lưu NhậtThiên干Tứ Hóa：用Âm lịchnămthángngày取Nhật Trụ干（通行口径「Hiển thịngày干Tứ Hóa」）。
 * 闰tháng传 isLeapMonth=true（lunar-javascript 以负tháng表示闰tháng）。
 */
export function getLiuRiSiHua(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth = false,
): { stemIndex: number; stemName: string; transforms: Record<SiHua, string> } | null {
  try {
    const monthKey = isLeapMonth ? -Math.abs(lunarMonth) : Math.abs(lunarMonth);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lunar = (Lunar as any).fromYmd(lunarYear, monthKey, lunarDay) as { getDayGan(): string };
    const stemIndex = STEMS.indexOf(lunar.getDayGan());
    if (stemIndex < 0) return null;
    return {
      stemIndex,
      stemName: STEMS[stemIndex] ?? '',
      transforms: getSiHuaByStem(stemIndex),
    };
  } catch {
    return null;
  }
}

// ─── 5c) Lưu ThờiTứ Hóa（Ngũ鼠遁：ngày干起TýgiờThiên干）───────────────────
/** giờ支 0=Tý…11=Hợi；ngày干推giờ干后取Tứ Hóa */
export function getLiuShiSiHua(dayStemIndex: number, hourBranch: number): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
} {
  // GiápKỷ→GiápTý，ẤtCanh→BínhTý，BínhTân→MậuTý，ĐinhNhâm→CanhTý，MậuQuý→NhâmTý
  const ziStemByDayStem: Record<number, number> = {
    0: 0, 5: 0,
    1: 2, 6: 2,
    2: 4, 7: 4,
    3: 6, 8: 6,
    4: 8, 9: 8,
  };
  const branch = ((Math.trunc(hourBranch) % 12) + 12) % 12;
  const stemIndex = ((ziStemByDayStem[dayStemIndex] ?? 0) + branch) % 10;
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 6) Cung干自化检测 ──────────────────────────────────────────
/**
 * 自化：该CungCung干引发的Tứ Hóa，被化Sao恰在Bản Cung
 * e.g. Cung干为Giáp（廉破武Dương），如果Bản CungChính Tinh含"Liêm Trinh"，则该Cung有"自化Lộc"
 */
export interface SelfSihua {
  siHua: SiHua;        // Lộc/Quyền/Khoa/Kỵ
  starName: string;    // 被化的Sao
}

export function detectSelfSihua(palace: Palace): SelfSihua[] {
  const transforms = getSiHuaByStem(palace.stem);
  const found: SelfSihua[] = [];
  const palaceStarNames = new Set(palace.stars.map(s => s.name));
  (['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as SiHua[]).forEach(sh => {
    const starName = transforms[sh];
    if (starName && palaceStarNames.has(starName)) {
      found.push({ siHua: sh, starName });
    }
  });
  return found;
}

// ─── 7) Lai NhânCung追溯 ────────────────────────────────────────────
/**
 * Lai NhânCung：对某颗Sao某种化，追溯是哪个Cung的Cung干"飞"过来的
 *
 * 倪师体系常用：化Kỵ的Lai NhânCung——化Kỵ由哪个Cung Vị的"Cung干"引发，那个Cung Vị就是问题的根源Cung Vị
 *
 * @param chart Lá số
 * @param starName 被化的Sao名（如 "Thái Âm"）
 * @param sihua  Tứ Hóa类型（如 "Kỵ"）
 * @returns 引发该化的Cung Vị数组（通常只有Nhất个，但若多CungCung干相同可能多个）
 */
export function findIncomingPalaces(
  chart: ZiweiChart,
  starName: string,
  sihua: SiHua,
): Palace[] {
  const result: Palace[] = [];
  chart.palaces.forEach(p => {
    const transforms = getSiHuaByStem(p.stem);
    if (transforms[sihua] === starName) {
      result.push(p);
    }
  });
  return result;
}

/**
 * 批量计算盘面所有Cung Vị的自化列表
 */
export function buildAllSelfSihua(chart: ZiweiChart): Record<number, SelfSihua[]> {
  const result: Record<number, SelfSihua[]> = {};
  chart.palaces.forEach(p => {
    const list = detectSelfSihua(p);
    if (list.length > 0) result[p.branch] = list;
  });
  return result;
}

// ─── 8) 综合覆盖（overlay）：多个Tứ Hóa层叠加后的效果 ──────────
/**
 * 生成某Sao名 → 多层Tứ Hóa的合成视图
 * 用于在Cung Vị上同giờHiển thị：本Mệnh化 / Đại Hạn化 / Lưu Niên化
 * 优先级：本Mệnh < Đại Hạn < Lưu Niên（但都标出来）
 */
export interface SiHuaOverlay {
  native?: SiHua;    // 本Mệnh（năm干）
  daXian?: SiHua;    // Đại Hạn
  liuNian?: SiHua;   // Lưu Niên
  liuYue?: SiHua;    // Lưu Nguyệt
}

export function buildOverlayForStar(
  starName: string,
  nativeMap: Record<string, SiHua>,
  daXianMap?: Record<string, SiHua>,
  liuNianMap?: Record<string, SiHua>,
  liuYueMap?: Record<string, SiHua>,
): SiHuaOverlay {
  return {
    native: nativeMap[starName],
    daXian: daXianMap?.[starName],
    liuNian: liuNianMap?.[starName],
    liuYue: liuYueMap?.[starName],
  };
}
