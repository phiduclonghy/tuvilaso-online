/**
 * 将前ThậpNhị神 / 岁前ThậpNhị神 —— 按Địa支起的两组ThậpNhị神
 *
 * 为什么要有这个文件（2026-08-12）：
 *   主流Lập lá số软件盘上每个Cung都带这两个神名，我们盘上Nhất直是空的。
 *
 * ── Nhất处更正（重要，别再按旧结论走）──────────────────────────────
 *   之前的判断是「岁前ThậpNhị神主流Lập lá sốBất排，LNSQX 表没有用处」。表确实用Bất上，
 *   但结论错了：主流Lập lá số【排】，只是Bất查表、走公式；
 *   Đại Hạn / Lưu Niên / Lưu Nguyệt / Lưu Nhật / Lưu Thời / Tiểu Hạn 每层都排，且默认全开。
 *
 * 算法出处（按通行口径整理，经金标准盘核对）：
 *
 *   岁前ThậpNhị神 —— 公式，Bất查表
 *       Đối Cung g = 1..12：神序 = 13 - 起点支 + g，若 > 12 则 -12
 *       即「Tuế Kiện落在起点支所在Cung，顺行ThậpNhịCung」。与 LNSQX 表逐格等价（对拍脚本里Nhất并验了）。
 *
 *   将前ThậpNhị神 —— 查 LNJQX 表
 *       对神序 s = 1..12：该神落在Cung LNJQX[s][起点支]
 *       即「神序 s 落在Cung LNJQX[神序][起点支]」。
 *
 *   ★ 两组的起点都是【Địa支】，且都是【该运限的Địa支】：
 *     每个运限（Đại Hạn / Lưu Niên / Lưu Nguyệt / Lưu Nhật / Lưu Thời）都按同Nhất个规则：
 *         跟随运限开关开 → 岁前(该层支)，否则 岁前(生năm支)
 *         跟随运限开关开 → 将前(该层支)，否则 将前(生năm支)
 *     两个开关默认都是开，
 *     即默认跟随运限；本Mệnh态（Mùi选运限）无条件用生năm支起。
 *
 * Cung Vị编码：表内用【Tý起Nhất】(1=Tý … 12=Hợi)。本组自Thân可độc lập验：
 *   LNJQX 的tướng tinh列 = Tam HợpĐế Vượng（ThânTýThìn→Tý、DầnNgọTuất→Ngọ、TỵDậuSửu→Dậu、HợiMãoMùi→Mão）12/12 全中；
 *   Tuế Dịch列与Thiên Mã表逐格相同、Hoa Cái列与Hoa Cái表相同、Hàm Trì列与Hàm Trì表相同。按Dần起Nhất则全错。
 *
 * 本文件对外Nhất律用 0-11 Địa支索引（0=Tý）。
 *
 * Bác SỹThậpNhị神（2026-08-14 金标准盘核对）：从生nămLộc Tồn起，DươngNamÂmNữ顺、ÂmNamDươngNữ逆；Bất跟随运限。
 */

import { LUCUN_TABLE } from './constants';

/** 将前ThậpNhị神，自tướng tinh起顺行。索引 0-11 = 神序。 */
export const JIANG_QIAN_SHEN = [
  'tướng tinh', 'Phan Án', 'Tuế Dịch', 'Tức Thần', 'Hoa Cái', 'Kiếp Sát',
  'Tai Sát', 'Thiên Sát', 'Chỉ Bối', 'Hàm Trì', 'Nguyệt Sát', 'Vong Thần',
] as const;

/** 岁前ThậpNhị神，自Tuế Kiện起顺行。索引 0-11 = 神序。
 * 第 7 位主流Lập lá số盘面写「Tuế Phá」（Tuế KiệnĐối Cung），Bất要写成「Đại Hao」——顶栏năm支Đại Hao是另Nhất颗Sao。 */
export const SUI_QIAN_SHEN = [
  'Tuế Kiện', 'Hối Khí', 'Tang Môn', 'Quán Tác', 'Quan Phù', 'Tiểu Hao',
  'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Thiên Đức', 'Điếu Khách', 'Bệnh Phù',
] as const;

/**
 * Bác SỹThậpNhị神。金标准盘：Cung底第Nhất行所列Bác SỹThậpNhị神。
 * 从生nămLộc Tồn起；DươngNamÂmNữ顺、ÂmNamDươngNữ逆。Bất跟随运限（Lưu Niên选中后仍落在生nămLộc TồnCung）。
 */
export const BOSHI_SHEN = [
  'Bác Sỹ', 'Lực Sỹ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư',
  'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phù',
] as const;

/**
 * tướng tinh落Cung（0-11 Địa支索引）—— Tam HợpCục的Đế Vượng位。
 * ThânTýThìn→Tý、DầnNgọTuất→Ngọ、TỵDậuSửu→Dậu、HợiMãoMùi→Mão，即同Tam Hợp组共用Nhất个tướng tinhCung。
 * anchorBranch 为该运限的Địa支（本Mệnh态传生năm支）。
 */
export function jiangXingBranch(anchorBranch: number): number {
  const b = ((anchorBranch % 12) + 12) % 12;
  // Tý(0)/Thìn(4)/Thân(8) → Tý(0)；Sửu(1)/Tỵ(5)/Dậu(9) → Dậu(9)；
  // Dần(2)/Ngọ(6)/Tuất(10) → Ngọ(6)；Mão(3)/Mùi(7)/Hợi(11) → Mão(3)
  return [0, 9, 6, 3][b % 4];
}

/**
 * 将前ThậpNhị神：Quay lại长度 12 的数组，下标 = CungĐịa支（0-11），值 = 神序（0-11，0=tướng tinh）。
 * tướng tinh起于Tam HợpĐế Vượng位，其后ThậpNhất神顺行。
 */
export function jiangQianShenByBranch(anchorBranch: number): number[] {
  const start = jiangXingBranch(anchorBranch);
  const out = new Array<number>(12);
  for (let shen = 0; shen < 12; shen++) out[(start + shen) % 12] = shen;
  return out;
}

/**
 * 岁前ThậpNhị神：Quay lại长度 12 的数组，下标 = CungĐịa支（0-11），值 = 神序（0-11，0=Tuế Kiện）。
 * Tuế Kiện落在 anchorBranch Cung，其后ThậpNhất神顺行。
 */
export function suiQianShenByBranch(anchorBranch: number): number[] {
  const a = ((anchorBranch % 12) + 12) % 12;
  const out = new Array<number>(12);
  for (let shen = 0; shen < 12; shen++) out[(a + shen) % 12] = shen;
  return out;
}

/** 便Lợi函数：某NhấtCung的将前ThậpNhị神名。 */
export function jiangQianShenName(anchorBranch: number, palaceBranch: number): string {
  return JIANG_QIAN_SHEN[jiangQianShenByBranch(anchorBranch)[((palaceBranch % 12) + 12) % 12]];
}

/** 便Lợi函数：某NhấtCung的岁前ThậpNhị神名。 */
export function suiQianShenName(anchorBranch: number, palaceBranch: number): string {
  return SUI_QIAN_SHEN[suiQianShenByBranch(anchorBranch)[((palaceBranch % 12) + 12) % 12]];
}

/** DươngNamÂmNữ顺，ÂmNamDươngNữ逆。năm干ÂmDương与 calcYinYangGender 同Nhất把尺Tý。 */
export function boshiReverse(yearStem: number, gender: 'male' | 'female'): boolean {
  const yangStem = ((yearStem % 10) + 10) % 10 % 2 === 0;
  return yangStem !== (gender === 'male');
}

/**
 * Bác SỹThậpNhị神：Quay lại长度 12 的数组，下标 = CungĐịa支（0-11），值 = 神序（0-11，0=Bác Sỹ）。
 * 起点 = 生nămLộc Tồn。
 */
export function boshiShenByStem(yearStem: number, gender: 'male' | 'female'): number[] {
  const start = LUCUN_TABLE[((yearStem % 10) + 10) % 10];
  const reverse = boshiReverse(yearStem, gender);
  const out = new Array<number>(12);
  for (let shen = 0; shen < 12; shen++) {
    const branch = reverse ? (start - shen + 12) % 12 : (start + shen) % 12;
    out[branch] = shen;
  }
  return out;
}

export function boshiShenName(
  yearStem: number, gender: 'male' | 'female', palaceBranch: number,
): string {
  return BOSHI_SHEN[boshiShenByStem(yearStem, gender)[((palaceBranch % 12) + 12) % 12]];
}

/**
 * ThậpNhị神的英文名 —— 专用表
 *
 * 为什么单独Nhất张表而Bất直接用共享短语词典 t()：
 * 词典是「词条→译文」Nhất对Nhất，而同Nhất个Tiếng Việt词在Bất同语境下该有Bất同译法——
 * 「tướng tinh」作为将前ThậpNhị神之Nhất要拼音（与另外 23 个Nhất致），但它在散文里是【Thất Sát】的别称
 * （「囚Sao配tướng tinh」= Liêm Trinh配Thất Sát），那里译成 General Star 才读Đắc通。共用Nhất张表迟早打架。
 *
 * 2026-08-12 已把词典里的độc lập词条 Đại Hao/tướng tinh/Bát Tọa 统Nhất成拼音（原为意译，是 25 个杂耀里的
 * Tam个异类），所以此刻两边结果Nhất致；这张表的意义在于把盘上的Sao名标签与散文词典解耦，
 * 之后谁再动词典也Bất会把这Nhất列带歪。
 *
 * 口径：Mệnh Lý专名用拼音（见 /api/interpret 英文指令 "Keep Mệnh Lý proper nouns as pinyin+English"）。
 */
export const SHIER_SHEN_EN: Record<string, string> = {
  // 岁前十二神（Tuế Phá = 主流排盘盘面用字；Đại Hao 留给顶栏年支星 / Bác Sỹ 第十二神）
  'Tuế Kiện': 'Sui Jian', 'Hối Khí': 'Hui Qi', 'Tang Môn': 'Sang Men', 'Quán Tác': 'Guan Suo',
  'Quan Phù': 'Guan Fu', 'Tiểu Hao': 'Xiao Hao', 'Tuế Phá': 'Sui Po', 'Đại Hao': 'Da Hao', 'Long Đức': 'Long De',
  'Bạch Hổ': 'Bai Hu', 'Thiên Đức': 'Tian De', 'Điếu Khách': 'Diao Ke', 'Bệnh Phù': 'Bing Fu',
  // 将前十二神
  'Tướng Tinh': 'Jiang Xing', 'Phan Án': 'Pan An', 'Tuế Dịch': 'Sui Yi', 'Tức Thần': 'Xi Shen',
  'Hoa Cái': 'Hua Gai', 'Kiếp Sát': 'Jie Sha', 'Tai Sát': 'Zai Sha', 'Thiên Sát': 'Tian Sha',
  'Chỉ Bối': 'Zhi Bei', 'Hàm Trì': 'Xian Chi', 'Nguyệt Sát': 'Yue Sha', 'Vong Thần': 'Wang Shen',
  // 博士十二神（与岁前重名的词共用拼音）
  'Bác Sỹ': 'Bo Shi', 'Lực Sỹ': 'Li Shi', 'Thanh Long': 'Qing Long', 'Tướng Quân': 'Jiang Jun',
  'Tấu Thư': 'Zou Shu', 'Phi Liêm': 'Fei Lian', 'Hỷ Thần': 'Xi Shen', 'Phục Binh': 'Fu Bing',
};

/** 按Ngôn ngữ取ThậpNhị神Hiển thị名；Mùi收录则原样Quay lạiTiếng Việt，TuyệtBấtHiển thị undefined。 */
export function shierShenLabel(name: string, lang: string): string {
  return lang === 'en' ? (SHIER_SHEN_EN[name] ?? name) : name;
}
