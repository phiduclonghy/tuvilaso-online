/**
 * 主流Lập lá số口径 Tử Vi Đẩu Số算法原始数据
 *
 * 来源：按通行口径整理，并经金标准盘核对
 *
 * 用途：作为「主流口径」模式的参考数据，让我们Lập lá số按主流Lập lá số口径
 *
 * 索引约定（**关键**）：
 *   Sao ID：1-based，0 占位（数组 [0] Bất用）
 *   Cung Vị（Địa支）：1-based「Tý起Nhất」——1=Tý, 2=Sửu, 3=Dần, 4=Mão, 5=Thìn, 6=Tỵ, 7=Ngọ, 8=Mùi, 9=Thân, 10=Dậu, 11=Tuất, 12=Hợi
 *     （★ 2026-06-20 订正：原写「1=Dần」是错的；实测 SB 表是Tý起Nhất，取数 col = branchIdx(Tý0)+1，见 schoolStarBrightness）
 *   亮度值：1=Miếu, 2=Vượng, 3=Đắc, 4=Lợi, 5=Bình, 6=Bất, 7=Hạn；0=默认口径留白（0 BấtHiển thị）
 *     （★ 2026-06-20 订正：原写「1=Bình…7=Miếu」整个方向反了，见 BRIGHTNESS_NUM_TO_CN）
 */

import { SCHOOL_AX } from './school-tables.generated';

// ─── Sao ID → Sao名 映射（数据表内用纯整数 ID，本表是我们整理的常识对应）─────────
export const SCHOOL_STAR_ID_TO_NAME: Record<number, string> = {
  // 14 Chính Tinh（Tử Vi系 6 + Thiên Phủ系 8）
  1: 'Tử Vi', 2: 'Thiên Cơ', 3: 'Thái Dương', 4: 'Vũ Khúc', 5: 'Thiên Đồng', 6: 'Liêm Trinh',
  7: 'Thiên Phủ', 8: 'Thái Âm', 9: 'Tham Lang', 10: 'Cự Môn', 11: 'Thiên Tướng', 12: 'Thiên Lương',
  13: 'Thất Sát', 14: 'Phá Quân',
  // LụcCát
  15: 'Văn Xương', 16: 'Văn Khúc', 17: 'Tả Phù', 18: 'Hữu Bật', 19: 'Thiên Khôi', 20: 'Thiên Việt',
  // Lộc马 + Lục煞
  21: 'Lộc Tồn', 22: 'Thiên Mã', 23: 'Hỏa Tinh', 24: 'Linh Tinh', 25: 'Kình Dương', 26: 'Đà La',
  27: 'Địa Không', 28: 'Địa Kiếp',
  // Tạp Diệu（2026-06-20 按通行口径整理：行号 = SB 亮度表 ID；落Cung仍用 iztro，金标准盘 24/24 验证）
  29: 'Thiên Phúc', 30: 'Thiên Quan', 31: 'Thiên Hình', 32: 'Bát Tọa', 33: 'Tam Thai', 34: 'Thiên Tài',
  37: 'Thiên Không', 38: 'Thiên Diêu', 39: 'Thiên Khốc', 40: 'Thiên Hỷ', 41: 'Thiên Hư', 42: 'Thiên Quý', 43: 'Thiên Thọ',
  45: 'Thiên Đức', 48: 'Cô Thần', 51: 'Hồng Loan',
  52: 'Ân Quang', 53: 'Phá Toái', 55: 'Hoa Cái', 56: 'Giải Thần', 57: 'Quả Tú', 58: 'Phụng Các',
  59: 'Phi Liêm', 60: 'Long Trì', 62: 'Đại Hao', 64: 'Thiên Sứ', 65: 'Thiên Thương',
  77: 'Triệt Không',
  78: 'Phó Tuần',
  79: 'Niên Giải', 80: 'Âm Sát', 81: 'Long Đức', 82: 'Hàm Trì',
  // ★ 2026-10-20 主流Lập lá số默认口径 5 张金标准盘逐Cung反推（会员提供 1 张 + 站长手机 4 张，每颗Sao 5 格观测、唯Nhất解）：
  //   31Thiên Hình、38Thiên Diêu、40Thiên Hỷ 补收；Đại Hao 46→62（46 整行全零，Đại HaoNhất直没亮度；62 原被当成Nguyệt Đức，Nguyệt Đức因此多出亮度）；
  //   Giải Thần 50→56（50 整行全零）；Nguyệt ĐứcBất收（5 张金标准盘都留白，对应行全零）。Phó Triệt / Tuần Không 借Triệt Không 77 / Phó Tuần 78 的行，见 SCHOOL_NAME_ALIAS。
  // ✅ 2026-06-20 NgọCung高清复核:Tam Thai33=Vượng/Thiên Không37=Miếu/Thiên Sứ64=Bình 已确认补上(之前 agent 误判NgọCung无此3颗)。
  // ⚠️ 剔除项(真盘 full diff 对Bất上,留白比贴错好)：
  //   38Thiên Trù(金标准盘NgọCung留白·38给Bình=错已删)、64原误标Phong Cáo已纠为Thiên Sứ。
  //   （10-20：38 实为Thiên Diêu，5 张真盘 5/5；Thiên Trù金标准盘始终留白、Bất收。）
  // ★ 2026-08-14：46Đại Hao按金标准盘核实的公式落Cung；77Triệt Không/Phó TriệtÂm干对调；78Phó Tuần随Tuần Không成对。
};

// ─── Mệnh Chủ表（按MệnhĐịa支 1-12 = DầnMãoThìnTỵNgọMùiThânDậuTuấtHợiTýSửu）──────────────────────
// Mệnh ChủSao ID 表 = [0,9,10,21,16,6,4,14,4,6,16,21,10]
// 索引 1-12 = TýSửuDầnMãoThìnTỵNgọMùiThânDậuTuấtHợi（MệnhĐịa支）
// **注意此表是按"Tý起Nhất"顺序，Bất是Dần起Nhất！** 1=Tý, 2=Sửu, ..., 12=Hợi
export const SCHOOL_MING_ZHU_BY_DIZHI: Record<number, string> = {
  1: 'Tham Lang',   // Tý
  2: 'Cự Môn',   // Sửu
  3: 'Lộc Tồn',   // Dần
  4: 'Văn Khúc',   // Mão
  5: 'Liêm Trinh',   // Thìn
  6: 'Vũ Khúc',   // Tỵ
  7: 'Phá Quân',   // Ngọ
  8: 'Vũ Khúc',   // Mùi
  9: 'Liêm Trinh',   // Thân
  10: 'Văn Khúc',  // Dậu
  11: 'Lộc Tồn',  // Tuất
  12: 'Cự Môn',  // Hợi
};

// ─── Thân Chủ表（按生nămĐịa支 1-12 = TýSửuDầnMãoThìnTỵNgọMùiThânDậuTuấtHợi）─────────────────────
// Thân ChủSao ID 表 = [0,23,11,12,5,15,2,23,11,12,5,15,2]
export const SCHOOL_SHEN_ZHU_BY_DIZHI: Record<number, string> = {
  1: 'Hỏa Tinh',   // Tý
  2: 'Thiên Tướng',   // Sửu
  3: 'Thiên Lương',   // Dần
  4: 'Thiên Đồng',   // Mão
  5: 'Văn Xương',   // Thìn
  6: 'Thiên Cơ',   // Tỵ
  7: 'Hỏa Tinh',   // Ngọ（与Tý同）
  8: 'Thiên Tướng',   // Mùi（与Sửu同）
  9: 'Thiên Lương',   // Thân（与Dần同）
  10: 'Thiên Đồng',  // Dậu（与Mão同）
  11: 'Văn Xương',  // Tuất（与Thìn同）
  12: 'Thiên Cơ',  // Hợi（与Tỵ同）
};

// ─── Ngũ行Cục表（MệnhThiên干组 × MệnhĐịa支组 → Ngũ行Cục数）─────────────────────────
// Ngũ行Cục表 WXJS (6×7 矩阵)
// 横轴：MệnhĐịa支组（1-6，Ngũ行属性分组）
// 纵轴：MệnhThiên干组（1-5）
// 输出：2=Thủy Nhị Cục, 3=Mộc Tam Cục, 4=Kim Tứ Cục, 5=Thổ Ngũ Cục, 6=Hỏa Lục Cục
export const SCHOOL_WUXING_JU_TABLE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 2, 6, 3, 5, 4, 6],
  [0, 6, 5, 4, 3, 2, 5],
  [0, 5, 3, 2, 4, 6, 3],
  [0, 3, 4, 6, 2, 5, 4],
  [0, 4, 2, 5, 6, 3, 2],
];

// ─── ThậpThiên干Tứ Hóa表（含 5 种主流派变体）────────────────────────────────────────
// 生nămTứ Hóa表 SHB (默认表)
// 索引 1-10 = GiápẤtBínhĐinhMậuKỷCanhTânNhâmQuý
// 每行 [0, 化LộcSaoID, 化QuyềnSaoID, 化KhoaSaoID, 化KỵSaoID]
export const SCHOOL_SIHUA_DEFAULT: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 6, 14, 4, 3],    // Giáp: Liêm Trinh6, Phá Quân14, Vũ Khúc4, Thái Dương3
  [0, 2, 12, 1, 8],    // Ất: Thiên Cơ2, Thiên Lương12, Tử Vi1, Thái Âm8
  [0, 5, 2, 15, 6],    // Bính: Thiên Đồng5, Thiên Cơ2, Văn Xương15, Liêm Trinh6
  [0, 8, 5, 2, 10],    // Đinh: Thái Âm8, Thiên Đồng5, Thiên Cơ2, Cự Môn10
  [0, 9, 8, 18, 2],    // Mậu: Tham Lang9, Thái Âm8, Hữu Bật18, Thiên Cơ2
  [0, 4, 9, 12, 16],   // Kỷ: Vũ Khúc4, Tham Lang9, Thiên Lương12, Văn Khúc16
  [0, 3, 4, 8, 5],     // Canh: Thái Dương3, Vũ Khúc4, Thái Âm8, Thiên Đồng5  ← 默认（与 iztro Nhất致）
  [0, 10, 3, 16, 15],  // Tân: Cự Môn10, Thái Dương3, Văn Khúc16, Văn Xương15
  [0, 12, 1, 17, 4],   // Nhâm: Thiên Lương12, Tử Vi1, Tả Phù17, Vũ Khúc4
  [0, 14, 10, 8, 9],   // Quý: Phá Quân14, Cự Môn10, Thái Âm8, Tham Lang9
];

// ─── Ngũ种CanhnămTứ Hóa变体（主流Lập lá số软件Cài đặt中可选）─────────────────────────────────────
export const SCHOOL_SIHUA_GENG_VARIANTS = {
  GYWYT: [0, 3, 4, 8, 5],   // Dương武Âm同（默认）
  GYWTY: [0, 3, 4, 5, 8],   // Dương武同Âm（KhoaKỵ互换说）
  GYWFT: [0, 3, 4, 7, 5],   // Dương武府同
  GYWFX: [0, 3, 4, 7, 11],  // Dương武府相
  GYWTX: [0, 3, 4, 5, 11],  // Dương武同相
} as const;

// ─── 紫府Đối Cung表（已知Tử ViCung Vị查Thiên PhủCung Vị）────────────────────────────────────
// 紫府Đối Cung表 [0,5,4,3,2,1,12,11,10,9,8,7,6]
// Tử Vi在 X Cung → Thiên Phủ在 此表[X] Cung
export const SCHOOL_ZIWEI_TIANFU_PAIR: number[] = [
  0, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 7, 6,
];

// ─── 14 Chính Tinh亮度表（4 套主流派系，可切换）────────────────────────────────────
// 索引：表[Sao ID][Địa支 ID] (1-based, [0][*] 和 [*][0] 是占位)
// 仅取前 14 个Sao（Chính Tinh）的数据；完整亮度表含 85 颗Sao
//
// 亮度值：0=Hạn, 1=Bình, 2=Bất, 3=Địa, 4=Lợi, 5=Đắc, 6=Vượng, 7=Miếu

export type BrightnessSchool = 'QS' | 'XD1' | 'ZZ' | 'XD2';

// 全书派（《Tử Vi Đẩu Số全书》Cổ thư记载）
export const SCHOOL_BRIGHTNESS_QS: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],     // [0] 占位
  [0, 5, 1, 2, 2, 3, 2, 1, 1, 2, 2, 3, 2],     // Tử Vi
  [0, 1, 7, 3, 2, 4, 5, 1, 7, 3, 2, 4, 5],     // Thiên Cơ
  [0, 7, 6, 2, 1, 2, 2, 2, 3, 3, 5, 6, 7],     // Thái Dương
  [0, 2, 1, 3, 4, 1, 5, 2, 1, 3, 4, 1, 5],     // Vũ Khúc
  [0, 2, 6, 4, 5, 5, 1, 7, 6, 2, 5, 5, 1],     // Thiên Đồng
  [0, 5, 4, 1, 5, 4, 7, 5, 4, 1, 5, 4, 7],     // Liêm Trinh
  [0, 1, 1, 1, 3, 1, 3, 2, 1, 3, 2, 1, 3],     // Thiên Phủ
  [0, 1, 1, 2, 7, 7, 7, 6, 6, 4, 2, 2, 1],     // Thái Âm
  [0, 2, 1, 5, 4, 1, 7, 2, 1, 5, 4, 1, 7],     // Tham Lang
  [0, 2, 6, 1, 1, 7, 2, 2, 6, 1, 1, 7, 2],     // Cự Môn
  [0, 1, 1, 1, 7, 3, 3, 1, 3, 1, 7, 3, 3],     // Thiên Tướng
  [0, 1, 2, 1, 1, 1, 3, 1, 2, 7, 3, 1, 7],     // Thiên Lương
  [0, 2, 1, 1, 2, 1, 5, 2, 1, 1, 2, 1, 5],     // Thất Sát
  [0, 1, 2, 3, 7, 2, 5, 1, 2, 3, 7, 2, 5],     // Phá Quân
];

// 现代修正 1（默认口径 fallback）
export const SCHOOL_BRIGHTNESS_XD1: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 5, 1, 1, 2, 3, 2, 1, 1, 2, 2, 3, 2],     // Tử Vi
  [0, 1, 7, 3, 2, 4, 5, 1, 7, 3, 2, 4, 5],     // Thiên Cơ
  [0, 7, 6, 2, 1, 2, 2, 1, 3, 4, 5, 7, 7],     // Thái Dương
  [0, 2, 1, 3, 4, 1, 5, 2, 1, 3, 4, 1, 5],     // Vũ Khúc
  [0, 2, 6, 4, 1, 5, 1, 7, 6, 2, 5, 5, 1],     // Thiên Đồng
  [0, 5, 4, 1, 5, 4, 7, 5, 4, 1, 5, 4, 7],     // Liêm Trinh
  [0, 1, 1, 1, 3, 2, 3, 2, 1, 3, 2, 2, 3],     // Thiên Phủ
  [0, 1, 1, 6, 7, 7, 7, 7, 5, 4, 2, 2, 1],     // Thái Âm
  [0, 2, 1, 5, 3, 1, 7, 2, 1, 5, 4, 1, 7],     // Tham Lang
  [0, 2, 6, 1, 1, 5, 5, 2, 5, 1, 1, 5, 2],     // Cự Môn
  [0, 1, 1, 1, 7, 5, 3, 3, 3, 1, 7, 3, 3],     // Thiên Tướng
  [0, 1, 2, 1, 2, 1, 7, 1, 2, 7, 3, 1, 7],     // Thiên Lương
  [0, 2, 1, 1, 2, 3, 5, 2, 1, 1, 2, 1, 5],     // Thất Sát
  [0, 1, 2, 3, 7, 2, 5, 1, 2, 3, 7, 2, 5],     // Phá Quân
];

// 中州派
export const SCHOOL_BRIGHTNESS_ZZ: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 1, 1, 2, 5, 2, 1, 1, 2, 3, 4, 2],
  [0, 1, 5, 2, 2, 1, 3, 1, 5, 3, 2, 1, 3],
  [0, 5, 5, 2, 1, 2, 2, 1, 3, 4, 4, 5, 5],
  [0, 2, 1, 4, 5, 1, 3, 2, 1, 3, 2, 1, 3],
  [0, 2, 5, 4, 1, 3, 1, 5, 5, 2, 3, 3, 1],
  [0, 3, 2, 1, 4, 2, 5, 3, 1, 1, 3, 2, 5],
  [0, 1, 1, 1, 3, 1, 3, 2, 1, 3, 5, 1, 2],
  [0, 1, 1, 4, 5, 4, 5, 5, 3, 3, 2, 2, 1],
  [0, 2, 1, 3, 4, 1, 5, 2, 1, 3, 3, 1, 5],
  [0, 2, 2, 1, 1, 3, 3, 2, 5, 1, 1, 2, 2],
  [0, 1, 1, 1, 5, 2, 3, 2, 4, 1, 5, 4, 3],
  [0, 1, 2, 1, 1, 2, 5, 1, 2, 5, 4, 2, 5],
  [0, 2, 1, 1, 5, 2, 3, 2, 2, 1, 4, 1, 3],
  [0, 1, 2, 5, 2, 2, 4, 1, 1, 5, 5, 2, 3],
];

// 现代修正 2
export const SCHOOL_BRIGHTNESS_XD2: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 4, 1, 1, 2, 4, 2, 1, 1, 2, 3, 5, 2],
  [0, 1, 5, 2, 2, 2, 3, 1, 5, 2, 2, 2, 3],
  [0, 5, 5, 2, 1, 2, 2, 1, 2, 3, 3, 5, 5],
  [0, 2, 1, 3, 5, 1, 3, 2, 1, 3, 2, 1, 3],
  [0, 2, 5, 3, 1, 2, 1, 5, 5, 2, 3, 3, 1],
  [0, 3, 2, 1, 4, 2, 5, 3, 1, 1, 3, 2, 5],
  [0, 2, 1, 1, 3, 1, 2, 2, 1, 2, 3, 1, 2],
  [0, 1, 1, 5, 5, 5, 5, 5, 5, 2, 2, 1, 1],
  [0, 2, 1, 3, 2, 1, 5, 2, 1, 3, 2, 1, 5],
  [0, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1],
  [0, 1, 1, 1, 5, 2, 3, 2, 3, 1, 5, 5, 3],
  [0, 1, 2, 1, 1, 2, 5, 1, 2, 5, 3, 2, 5],
  [0, 2, 2, 1, 5, 1, 3, 2, 2, 1, 3, 1, 3],
  [0, 1, 1, 5, 2, 2, 3, 1, 1, 5, 5, 2, 3],
];

/** 选择亮度表 */
export function getSchoolBrightnessTable(school: BrightnessSchool = 'XD1'): number[][] {
  switch (school) {
    case 'QS': return SCHOOL_BRIGHTNESS_QS;
    case 'XD1': return SCHOOL_BRIGHTNESS_XD1;
    case 'ZZ': return SCHOOL_BRIGHTNESS_ZZ;
    case 'XD2': return SCHOOL_BRIGHTNESS_XD2;
  }
}

/** 亮度数值 → Tiếng Việt。
 *  ★ 2026-06-20 重大纠正：此前 `{0Hạn,1Bình,2Bất,3Địa,4Lợi,5Đắc,6Vượng,7Miếu}` 整个方向反了（还把「Đắc」误作「Địa」），
 *  导致全站亮度与主流Lập lá số口径对Bất齐。正确口径（金标准盘 19/19 实证）：1=Miếu…7=Hạn，0=BấtHiển thị（留白）。 */
export const BRIGHTNESS_NUM_TO_CN: Record<number, string> = {
  1: 'Miếu', 2: 'Vượng', 3: 'Đắc', 4: 'Lợi', 5: 'Bình', 6: 'Bất', 7: 'Hạn',
};

/** ★ 2026-06-20 ZZ(中州派)/XD2(现代修订Nhị) 是 5 档制（通行口径只有 QS 7 档 + ZZ 5 档两套Hiển thị名，XD1 复用 QS、XD2 复用 ZZ）：
 *  1Miếu 2Vượng 3Bình 4闲 5Hạn。实证：ZZ Hiển thị名逐档对照 QS Hiển thị名(1=Miếu/2=Vượng/3=Bình/5=Hạn)。
 *  ★★ 值4 之前 agent 按位置推为「Bất」〔Mùi核实〕，2026-06-20 金标准盘坐实=「闲」：
 *     金标准盘(现代修订亮度表第Nhị版) Tử Vi@Tý Hiển thị「闲」，全 12 Cung 26/27 仅此Nhất格因映射错(Bất)而Bất符 → 改「闲」后 27/27。中州派传统亦用「闲」级。
 *  Thái DươngTý=Hạn/Ngọ=Miếu、Thái ÂmHợi=Miếu/Mão=Hạn 等学理锚点 7/7 Mệnh中。 */
export const BRIGHTNESS_NUM_TO_CN_5: Record<number, string> = {
  1: 'Miếu', 2: 'Vượng', 3: 'Bình', 4: '闲', 5: 'Hạn',
};

/** 按流派选「数值→Tiếng Việt」映射：QS/XD1 = 7 档；ZZ/XD2 = 5 档。 */
export const BRIGHTNESS_NUM_TO_CN_BY_SCHOOL: Record<BrightnessSchool, Record<number, string>> = {
  QS: BRIGHTNESS_NUM_TO_CN, XD1: BRIGHTNESS_NUM_TO_CN,
  ZZ: BRIGHTNESS_NUM_TO_CN_5, XD2: BRIGHTNESS_NUM_TO_CN_5,
};

/**
 * 把数字亮度表（按Địa支 1=Dần...12=Sửu）转成 iztro 兼容的Tiếng Việt亮度数组
 * iztro 亮度数组顺序：[Dần,Mão,Thìn,Tỵ,Ngọ,Mùi,Thân,Dậu,Tuất,Hợi,Tý,Sửu]
 *
 * Quay lại 14 Chính Tinh名 → 12 元素Tiếng Việt数组的 map
 */
export function schoolBrightnessTableToIztroFormat(
  school: BrightnessSchool,
): Record<string, string[]> {
  const table = getSchoolBrightnessTable(school);
  const starIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const result: Record<string, string[]> = {};

  for (const sid of starIds) {
    const row = table[sid];
    if (!row) continue;
    const name = SCHOOL_STAR_ID_TO_NAME[sid];
    if (!name) continue;
    // 表内索引 1-12 (Dần起Nhất)；iztro 索引 0-11 (Dần起Nhất) — 直接 row.slice(1) 即可
    result[name] = row.slice(1, 13).map((v) => BRIGHTNESS_NUM_TO_CN[v] ?? '');
  }
  return result;
}

// ─── Tinh Diệu亮度（全Sao：Chính Tinh + Phụ Tinh + Sát Tinh + 空劫，凡 SCHOOL_STAR_ID_TO_NAME 收录的）──────────
// ★ 2026-06-20 全套对齐主流Lập lá số口径：之前默认Chính Tinh用手敲善本表、Phụ Tinh用 XD1，都对Bất齐金标准盘。
//   真相 = 主流默认亮度流派 = 全书派（Cài đặt页实证），数据就在 SB_QS 表（整理正确），
//   只是当năm「数值→Tiếng Việt」映射读反了 + 列索引用错了「Dần起Nhất」。纠正后金标准盘复现 19/19。

// Sao名 → Sao ID（SCHOOL_STAR_ID_TO_NAME 反查）
const SCHOOL_NAME_TO_ID: Record<string, number> = {};
for (const k in SCHOOL_STAR_ID_TO_NAME) SCHOOL_NAME_TO_ID[SCHOOL_STAR_ID_TO_NAME[Number(k)]] = Number(k);
// ★ 2026-10-20 成对的两颗共用Nhất行亮度：Phó Triệt用Triệt Không 77、Tuần Không用Phó Tuần 78（5 张默认口径金标准盘逐格吻合；
//   原来这两颗查Bất到 ID，金标准盘标了亮度、我们Nhất直留白）
const SCHOOL_NAME_ALIAS: Record<string, number> = { 'Phó Triệt': 77, 'Phó Tuần': 78 };
for (const [n, id] of Object.entries(SCHOOL_NAME_ALIAS)) SCHOOL_NAME_TO_ID[n] = id;

const SB_BY_SCHOOL: Record<BrightnessSchool, readonly (readonly number[])[]> = {
  QS: SCHOOL_AX.SB_QS, XD1: SCHOOL_AX.SB_XD1, ZZ: SCHOOL_AX.SB_ZZ, XD2: SCHOOL_AX.SB_XD2,
};

/**
 * 查Tinh Diệu亮度。Quay lạiTiếng Việt亮度字，或 undefined（Mùi收录该Sao / 默认口径留白 0）。
 * ★ 默认 school='QS'（全书派）：主流Lập lá số软件「Tinh Diệu亮度」默认勾选「依据Đẩu Số全书」（Cài đặt页实证）。
 *   索引：SB 表「Tý起Nhất」（Tý=列1…Hợi=列12），传入 branchIdx Tý起 0，故 col = branchIdx + 1。
 *   实证：SB_QS + BRIGHTNESS_NUM_TO_CN + Tý起Nhất，金标准盘复现 19/19（10 Chính Tinh + 5 Phụ Tinh + 4 Sát Tinh）。
 * @param branchIdx Sao所在CungĐịa支，Tý起 0（Tý=0…Hợi=11）
 */
export function schoolStarBrightness(
  starName: string,
  branchIdx: number,
  school: BrightnessSchool = 'QS',
): string | undefined {
  const id = SCHOOL_NAME_TO_ID[starName];
  if (id == null) return undefined;
  const v = SB_BY_SCHOOL[school]?.[id]?.[branchIdx + 1]; // Tý起Nhất
  if (v == null || v === 0) return undefined;            // 0 = 默认口径留白，BấtHiển thị
  return BRIGHTNESS_NUM_TO_CN_BY_SCHOOL[school][v];       // 按流派选映射：QS/XD1=7档，ZZ/XD2=5档
}

// ─── 小Sao位置表（24 种辅助Sao，按生tháng或生giờ定位）─────────────────────────────
// 索引：表[index][value0, value1] (大部分按 12 元素，1-12 表示Địa支)

// Trường SinhThậpNhị神 起点表（按Ngũ行Cục 1-6）
export const SCHOOL_CHANGSHENG_QIDIAN: number[][] = [
  [0, 0], [11, 5], [10, 6], [9, 7], [8, 8], [7, 9],
  [6, 10], [5, 11], [4, 12], [3, 1], [2, 2], [1, 3], [12, 4],
];

// ⚠️【2026-05-30 实证修正】此表实为「火铃起点表」(HL = 火铃 HuoLing，非Hồng Loan HongLuan)。
//   证据:4 năm循环(Hồng LoanThiên Hỷ应 12 năm循环);作火铃起点+生giờ顺数，对照 iztro Hỏa TinhLinh Tinh 26/26 Nhất致。
//   Hồng LoanThiên Hỷ真表待定位。本常量名Bất副实、已弃用，Lập lá số以 school-tables.generated.ts 为准。
// Hồng LoanThiên Hỷ表（按生nămĐịa支 1-12）— ❌ 实为火铃起点
export const SCHOOL_HONGLUAN_TIANXI: number[][] = [
  [0, 0], [3, 11], [4, 11], [2, 4], [10, 11], [3, 11],
  [4, 11], [2, 4], [10, 11], [3, 11], [4, 11], [2, 4], [10, 11],
];

// Cô ThầnQuả Tú（按生nămĐịa支 1-12）
export const SCHOOL_GUCHEN_GUASU: number[][] = [
  [0, 0], [3, 11], [3, 11], [6, 2], [6, 2], [6, 2],
  [9, 5], [9, 5], [9, 5], [12, 8], [12, 8], [12, 8], [3, 11],
];

// Triệt Không（按生nămThiên干 1-10，4 种排法可选）
export const SCHOOL_JIEKONG_VARIANTS = {
  v1: [0, 9, 7, 5, 3, 1, 10, 8, 6, 4, 2],           // 常规单Sao法
  v2: [[0, 0], [9, 10], [8, 7], [5, 6], [4, 3], [1, 2], [10, 9], [7, 8], [6, 5], [3, 4], [2, 1]], // 正副双Sao（默认）
  v3: [0, 9, 7, 5, 3, 11, 10, 8, 6, 4, 12],         // 占验派
} as const;

// Tuần Không（按生nămThiên干 1-10）
export const SCHOOL_XUNKONG: number[] = [0, 3, 1, 11, 9, 7, 5, 3, 1, 11, 9, 7, 5];

// Thiên Diêu（按生tháng 1-12）
export const SCHOOL_TIANYAO: number[] = [0, 11, 6, 5, 3, 8, 4, 12, 8, 3, 7, 11, 3];

// Thiên Vu（按生tháng 1-12）
export const SCHOOL_TIANWU: number[] = [0, 6, 9, 3, 12, 6, 9, 3, 12, 6, 9, 3, 12];

// Giải Thần（按生tháng 1-12）
export const SCHOOL_JIESHEN: number[] = [0, 9, 9, 11, 11, 1, 1, 3, 3, 5, 5, 7, 7];

// ⚠️【2026-05-30 实证修正】此值实为「Phi Liêm」(FL，按生năm支)，非Phong Cáo;真Phong Cáo是Nhị维 FG 表。
// Phong Cáo（按生giờ 1-12）— ❌ 实为Phi Liêm，已弃用，Lập lá số以 school-tables.generated.ts 为准
export const SCHOOL_FENGGAO: number[] = [0, 9, 10, 11, 6, 7, 8, 3, 4, 5, 12, 1, 2];

// Phá Toái（按生nămĐịa支 1-12）
export const SCHOOL_POSUI: number[] = [0, 6, 2, 10, 6, 2, 10, 6, 2, 10, 6, 2, 10];

// Hoa Cái（按生nămĐịa支 1-12）
export const SCHOOL_HUAGAI: number[] = [0, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8];

// Hàm Trì（按生nămĐịa支 1-12）
export const SCHOOL_XIANCHI: number[] = [0, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1];

// Thiên Trù（按生nămThiên干 1-10）
export const SCHOOL_TIANCHU: number[] = [0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 12];

// ─── Lưu Niên小Sao表 ──────────────────────────────────────────────────────────
// Lưu Niên岁前 12 神（按Lưu NiênĐịa支×位置 12×12）
export const SCHOOL_LIUNIAN_SUIQIAN: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1],
  [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2],
  [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3],
  [0, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4],
  [0, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5],
  [0, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6],
  [0, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7],
  [0, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8],
  [0, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [0, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
];

// Lưu Niên将前 12 神（按Lưu NiênĐịa支×位置 12×12）
export const SCHOOL_LIUNIAN_JIANGQIAN: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4],
  [0, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
  [0, 3, 12, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6],
  [0, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7],
  [0, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8],
  [0, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3, 12, 9],
  [0, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10],
  [0, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11],
  [0, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3, 12],
  [0, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7, 4, 1],
  [0, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5, 2],
  [0, 12, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3],
];

/**
 * 数据完整性自测
 * 在 dev 模式下调用，验证所有表格的维度是否正确
 */
export function validateSchoolData(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  // Mệnh Chủ表 12 项
  if (Object.keys(SCHOOL_MING_ZHU_BY_DIZHI).length !== 12) {
    errors.push(`MING_ZHU expected 12 entries, got ${Object.keys(SCHOOL_MING_ZHU_BY_DIZHI).length}`);
  }
  // Thân Chủ表 12 项
  if (Object.keys(SCHOOL_SHEN_ZHU_BY_DIZHI).length !== 12) {
    errors.push(`SHEN_ZHU expected 12 entries, got ${Object.keys(SCHOOL_SHEN_ZHU_BY_DIZHI).length}`);
  }
  // 4 套亮度表 × 15 行（[0]+14 Chính Tinh）× 13 列（[0]+12 Địa支）
  for (const [name, tbl] of Object.entries({
    QS: SCHOOL_BRIGHTNESS_QS,
    XD1: SCHOOL_BRIGHTNESS_XD1,
    ZZ: SCHOOL_BRIGHTNESS_ZZ,
    XD2: SCHOOL_BRIGHTNESS_XD2,
  })) {
    if (tbl.length !== 15) errors.push(`亮度表 ${name}: 期望 15 行（含占位），实际 ${tbl.length}`);
    if (tbl[1].length !== 13) errors.push(`亮度表 ${name}: 期望每行 13 列，实际 ${tbl[1].length}`);
  }
  // Tứ Hóa表 11 行（[0]+10 Thiên干）× 5 列
  if (SCHOOL_SIHUA_DEFAULT.length !== 11) errors.push(`Tứ Hóa表: 期望 11 行，实际 ${SCHOOL_SIHUA_DEFAULT.length}`);

  return { ok: errors.length === 0, errors };
}
