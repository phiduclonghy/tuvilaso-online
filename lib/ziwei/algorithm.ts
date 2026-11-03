/**
 * Tử Vi Đẩu SốLập lá số算法 — 基于 iztro 开源库
 * https://github.com/SylarLong/iztro
 */

import { astro } from 'iztro';
import { Solar, LunarMonth } from 'lunar-javascript';
import type { BirthInfo, LunarInfo, Star, Palace, DaXian, DaXianSiHua, ZiweiChart } from './types';
import { BRANCHES, STEMS } from './constants';
import { schoolStarBrightness, type BrightnessSchool } from './school-data';
import { SCHOOL_AX } from './school-tables.generated';
import { DEFAULT_LEAP_MONTH } from './school-config';
// 飞Sao派工具仅供导出，Bất再在Lập lá sốgiờ调用（倪师《Thiên纪 03》：Tứ HóaSao永远固定Bất动）
// import { detectSelfSihua, getSiHuaByStem } from './sihua';

// Tử Vi Đẩu Số主流派（中州派/全书派/主流Lập lá số软件）采用"正tháng初Nhất换năm"规则（Âm lịchnăm口径）。
// 例：1999/2/11 立春已过（立春=2/4），但春节(2/16)Mùi到 → 仍属MậuDầnnăm腊tháng，非KỷMãonăm。
// 影响 iztro 内部Lập lá số的Ngũ行Cục/Mệnh Chủ/Thân Chủ/Tứ Hóa/Tử Vi定位 — 这是与主流Lập lá số软件对齐的关键。
//
// ★ 修正Lịch sử（2026-05-12）：
// 原配置 yearDivide:'exact'（立春换năm）→ 改为 'normal'（正tháng初Nhất换năm）
// 原因：用户反馈与主流Lập lá số软件的盘"Cung VịNhất样、其他完全BấtNhất样"，
// 经诊断（scripts/diff-chart-vs-other.ts）确认根因是换năm规则，主流派Nhất律用Âm lịchnăm。
//
// ★ Tinh Diệu亮度修正（2026-05-08）
// iztro 默认亮度表与《Tử Vi Đẩu Số全书》存在 24 处差异（14 Chính Tinh + 6 Phụ Tinh），
// 已通过 config.brightness 全量覆写修正。
// 数组索引从Dần起：0=Dần 1=Mão 2=Thìn 3=Tỵ 4=Ngọ 5=Mùi 6=Thân 7=Dậu 8=Tuất 9=Hợi 10=Tý 11=Sửu
// 交叉验证来源：Tử Vi取象派全书解读、令东来Miếu Vượng表、iztro 官方文档、金标准盘
// ★ 抽成具名常量（2026-06-11）：供 setBrightnessSchool('default') 显式还原，根治「切流派后全Cục亮度泄漏」。
//   必须完整覆盖Tất cả 14 Chính Tinh——流派表（schoolBrightnessTableToIztroFormat）覆写 14 Chính Tinh，
//   若此处缺某Chính Tinh键，切流派后该Sao被污染却无键可盖回（实测：Vũ Khúc/Liêm Trinh/Cự Môn/Phá Quân 曾缺失）。
const DEFAULT_BRIGHTNESS: Record<string, string[]> = {
    //            Dần     Mão     Thìn     Tỵ     Ngọ     Mùi     Thân     Dậu     Tuất     Hợi     Tý     Sửu
    // ── Tử Vi系LụcSao ──────────────────────────────────────────
    // Tử Vi：DầnCung Vượng→Miếu（全书：Miếu于DầnNgọSửuMùi）
    'Tử Vi': ['Miếu','Vượng','Đắc','Vượng','Miếu','Miếu','Vượng','Vượng','Đắc','Vượng','Bình','Miếu'],
    // Thiên Cơ：ThìnCung Lợi→Miếu、TuấtCung Lợi→Miếu（依「Thiên CơMiếu于TýNgọThìnTuất」通行Miếu Vượng总诀；善本《全书》Thiên Cơ条无逐Cung原文，此句系后世总诀转述，非善本直证）
    'Thiên Cơ': ['Đắc','Vượng','Miếu','Bình','Miếu','Hạn','Đắc','Vượng','Miếu','Bình','Miếu','Hạn'],
    // Thái Dương：NgọCung Vượng→Miếu（全书：Miếu于MãoNgọ）
    'Thái Dương': ['Vượng','Miếu','Vượng','Vượng','Miếu','Đắc','Đắc','Hạn','Bất','Hạn','Hạn','Bất'],
    // Vũ Khúc：iztro 默认与全书Nhất致 ✓
    // Thiên Đồng：DầnCung Lợi→Vượng（全书：Vượng于TýDầnThân）、NgọCung Hạn→Bất（全书：BấtĐắc Địa于NgọSửuMùi）
    'Thiên Đồng': ['Vượng','Bình','Bình','Miếu','Bất','Bất','Vượng','Bình','Bình','Miếu','Vượng','Bất'],
    // Liêm Trinh：iztro 默认与全书Nhất致 ✓

    // ── Thiên Phủ系BátSao ──────────────────────────────────────────
    // Thiên Phủ：ThìnCung Miếu→Vượng、TuấtCung Miếu→Vượng（全书：Vượng于ThìnTuấtNgọDậu）
    'Thiên Phủ': ['Miếu','Đắc','Vượng','Đắc','Vượng','Miếu','Đắc','Vượng','Vượng','Đắc','Miếu','Miếu'],
    // Thái Âm：DầnCung Vượng→Hạn、DậuCung Bất→Vượng（全书：Miếu于HợiTýSửu，Vượng于DậuTuất，Hạn于DầnMãoThìnTỵNgọ）★ 重大修正
    // ★ 2026-06-10 doctrine 复核（用户留言「Thái DươngThái ÂmMiếu Vượng有误」触发，详见 docs/audits/taiyin-brightness-review.md）：
    //   善本《全书·诸Sao问答论·Thái Âm》逐字（quanshu-juan1-source.ts）：「以MãoThìnTỵNgọMùi为HạnĐịa，以DậuTuấtHợiTýSửu为Đắc垣」
    //   → NgọCung原值'Bất'与上行自引出处及善本两源皆抵触，系 05 tháng校订漏网，校订为'Hạn'。
    //   存疑保留：MùiCung善本作HạnĐịa、此表沿用'Bất'（通行Miếu Vượng表多Bất入Hạn，流派分歧）；DầnCung善本Mùi提，沿用 05 tháng校订'Hạn'。
    'Thái Âm': ['Hạn','Hạn','Hạn','Hạn','Hạn','Bất','Lợi','Vượng','Vượng','Miếu','Miếu','Miếu'],
    // Tham Lang：iztro 原始表为 6 位对称构造（BìnhLợiMiếuHạnVượngMiếu重复），与Cổ thư差异显著，按通行 XD1 表修正
    // ★ 2026-06-11 复核（Nhị次）：XD1 TỵCung=Địa（表内数值 3），iztro Brightness 无'Địa'，映射为'Bình'（同属 normal 区，与金标准盘Hiển thịNhất致）
    'Tham Lang': ['Bất','Bình','Đắc','Bình','Bình','Miếu','Bất','Bình','Đắc','Lợi','Bình','Miếu'],
    // Cự Môn：iztro 默认与全书Nhất致 ✓（全书各源分歧已复核，iztro 取值合理）
    // Thiên Tướng：MãoCung Hạn→Bình、DậuCung Hạn→Bình（依「Thiên TướngBình于MãoDậu」通行Miếu Vượng总诀；善本《全书》Thiên Tướng条无逐Cung原文，且通行Tứ派亮度表此处亦全作「Bình」，故「Bình」站Đắc住）
    'Thiên Tướng': ['Miếu','Bình','Đắc','Đắc','Miếu','Đắc','Miếu','Bình','Đắc','Đắc','Miếu','Miếu'],
    // Thiên Lương：MãoCung Miếu→Đắc、TuấtCung Miếu→Đắc（全书：Đắc Địa于MãoTuất）
    'Thiên Lương': ['Miếu','Đắc','Miếu','Hạn','Miếu','Vượng','Hạn','Đắc','Đắc','Hạn','Miếu','Vượng'],
    // Thất Sát：DậuCung Miếu→Vượng（全书：Vượng于TýNgọMãoDậu）
    'Thất Sát': ['Miếu','Vượng','Miếu','Bình','Vượng','Miếu','Miếu','Vượng','Miếu','Bình','Vượng','Miếu'],
    // Phá Quân：iztro 默认与全书Nhất致 ✓

    // ── Phụ Tinh（LụcCátLục煞）────────────────────────────────────
    // Văn Xương：iztro 默认与全书Nhất致 ✓
    // Văn Khúc：ThìnCung Đắc→Miếu、TýCung Đắc→Miếu（全书：Miếu于TỵDậuSửuTýThìn，共NgũMiếu位）
    'Văn Khúc': ['Bình','Vượng','Miếu','Miếu','Hạn','Vượng','Đắc','Miếu','Hạn','Vượng','Miếu','Miếu'],
    // Hỏa Tinh：iztro 默认与全书Nhất致 ✓
    // Linh Tinh：iztro 错误Địa复制了Hỏa Tinh亮度！全书Linh Tinh与Hỏa TinhBất同 ★ 重大修正
    //   ThìnThân Hạn→Đắc、Mùi Lợi→Đắc、Sửu Đắc→Hạn、Hợi Lợi→Hạn（全书：MiếuDầnNgọTuất，ĐịaThìnTỵMùiThân，HạnSửuHợiTý）
    //   DậuCung：iztro/主流Lập lá số软件/元亨Lợi贞 均为"Đắc"，从众修正
    'Linh Tinh': ['Miếu','Lợi','Đắc','Đắc','Miếu','Đắc','Đắc','Đắc','Miếu','Hạn','Hạn','Hạn'],
    // Kình Dương：DậuCung Hạn→Vượng、TýCung Hạn→Vượng（全书：MiếuThìnTuấtSửuMùi，VượngDậuTý，HạnMãoNgọ）
    'Kình Dương': ['','Hạn','Miếu','','Hạn','Miếu','','Vượng','Miếu','','Vượng','Miếu'],
    // Đà La：iztro 默认与全书Nhất致 ✓

    // ── Vũ Khúc / Liêm Trinh / Cự Môn / Phá Quân ───────────────────────────────
    // 这 4 颗Chính Tinh iztro 原生值与《全书》Nhất致，原先Mùi显式覆写（靠 iztro 内置 fallback）。
    // ★ 2026-06-11 补入原生值（探针 scripts 实测，Dần起）：使 DEFAULT 表完整含 14 Chính Tinh，
    //   流派切换后 setBrightnessSchool('default') 才能全量盖回、还原默认。
    'Vũ Khúc': ['Đắc','Lợi','Miếu','Bình','Vượng','Miếu','Đắc','Lợi','Miếu','Bình','Vượng','Miếu'],
    'Liêm Trinh': ['Miếu','Bình','Lợi','Hạn','Bình','Lợi','Miếu','Bình','Lợi','Hạn','Bình','Lợi'],
    'Cự Môn': ['Miếu','Miếu','Hạn','Vượng','Vượng','Bất','Miếu','Miếu','Hạn','Vượng','Vượng','Bất'],
    'Phá Quân': ['Đắc','Hạn','Vượng','Bình','Miếu','Vượng','Đắc','Hạn','Vượng','Bình','Miếu','Vượng'],
};

// 模块加载即写入默认亮度表 + Âm lịch正tháng初Nhất换năm规则（astro.config 为全Cục副作用）
astro.config({
  yearDivide: 'normal',
  brightness: DEFAULT_BRIGHTNESS,
});

// ─── 亮度流派切换（2026-05-12，金标准盘核对后引入）─────────────────────────
// 默认 = 我们当前的自定义表（基于全书 + 金标准盘交叉验证）
// 切换 = 调 setBrightnessSchool('qs' | 'xd1' | 'zz' | 'xd2') 覆写为通行Tứ派任Nhất套
//
// 注意：astro.config 是全Cục副作用，每次调用影响所有后续 generateChart
//       服务端多用户场景下要小心 race condition（chart 生成是同步的，影响小）

export type SchoolBrightnessKind = 'default' | BrightnessSchool;

// ★ 2026-06-20 Tinh Diệu亮度全套对齐主流Lập lá số口径：全盘亮度改由装配层直接查 SB_[school] 表
//   （schoolStarBrightness：Chính Tinh+Phụ Tinh+Sát Tinh+空劫统NhấtNhất套表/Nhất套映射/Tý起Nhất索引），
//   Bất再走 iztro 的 astro.config 覆写（旧的 DEFAULT_BRIGHTNESS 善本手敲表 + schoolBrightnessTableToIztroFormat
//   方向读反的映射，都已弃用）。
// ★ 2026-10-20 default = 《Đẩu Số全书》QS（站长定：主流Lập lá số默认口径是什么，我们默认就是什么）。
//   证据：主流Lập lá số软件Cài đặt页「重置Cài đặt → 重置为系统默认值」后，Tinh Diệu亮度停在
//   「依据Đẩu Số全书 (默认)」（截图已存档）；会员发来的金标准盘
//   53 颗Sao亮度与 QS 表 53/53 Nhất致、与 XD2 只 44/53。6-20 那次改成 XD2 的「用户实证 27/27」是Nhất台手选了
//   现代修订亮度表（第Nhị版）的机器，Bất是默认口径。流派切换只改此值（同步主辅煞，避免BấtNhất致）。
let currentBrightSchool: BrightnessSchool = 'QS';

export function setBrightnessSchool(school: SchoolBrightnessKind): void {
  currentBrightSchool = school === 'default' ? 'QS' : school;
}

export type LunarMonthPolicy = 'split' | 'next-month' | 'prev-month' | 'origin-month';

export interface EffectiveLunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  rawLunarMonth: number;
  rawLunarDay: number;
}

/**
 * Resolve the lunar month used by the chart and all month-based patches.
 * The raw lunar date remains available so callers can keep split behavior on
 * the real leap month while non-split policies use the same effective date.
 */
export function resolveEffectiveLunarDate(
  year: number,
  month: number,
  day: number,
  policy: LunarMonthPolicy = 'prev-month',
): EffectiveLunarDate {
  // 闰tháng归属是字面量联合类型，但本函数可从运行giờ JavaScript / JSON API 直接调用，
  // 类型形同虚设。拼错的 policy 原本会落进下方 if/else 链的尾部，静默按「归本tháng」
  // Lập lá số且把错误值随 chart.birthInfo.leapMonthPolicy 序列化传播——与 hour、Dương lịchngày期
  // 的既有校验同Nhất口径：无效Nhập当场拒Tuyệt，而Bất是产出Nhất张口径Bất明的盘。
  if (policy !== 'split' && policy !== 'next-month' && policy !== 'prev-month' && policy !== 'origin-month') {
    throw new RangeError(
      `leapMonth policy must be one of 'split' | 'next-month' | 'prev-month' | 'origin-month'; received ${String(policy)}`,
    );
  }
  const lunar = Solar.fromYmd(year, month, day).getLunar();
  const rawLunarMonth = Number(lunar.getMonth());
  const rawLunarDay = Number(lunar.getDay());
  const isRawLeapMonth = rawLunarMonth < 0;
  const absoluteMonth = Math.abs(rawLunarMonth);

  if (!isRawLeapMonth) {
    return {
      lunarYear: Number(lunar.getYear()),
      lunarMonth: absoluteMonth,
      lunarDay: rawLunarDay,
      isLeapMonth: false,
      rawLunarMonth,
      rawLunarDay,
    };
  }

  let lunarYear = Number(lunar.getYear());
  let lunarMonth = absoluteMonth;
  let isLeapMonth = false;

  if (policy === 'split') {
    // Keep iztro's established split rule: days 1-15 use the prior month,
    // and the second half uses the following month.
    if (rawLunarDay > 15) lunarMonth = absoluteMonth + 1;
  } else if (policy === 'next-month') {
    lunarMonth = absoluteMonth + 1;
  } else if (policy === 'origin-month') {
    isLeapMonth = true;
  }

  if (lunarMonth > 12) {
    lunarMonth = 1;
    lunarYear += 1;
  }

  let lunarDay = rawLunarDay;
  try {
    const monthKey = isLeapMonth ? -lunarMonth : lunarMonth;
    const dayCount = LunarMonth.fromYm(lunarYear, monthKey)?.getDayCount?.();
    if (typeof dayCount === 'number' && dayCount > 0 && lunarDay > dayCount) lunarDay = dayCount;
  } catch { /* 查Bất到tháng信息则保留原ngày，维持下游既有容错 */ }

  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeapMonth,
    rawLunarMonth,
    rawLunarDay,
  };
}

// ─── Âm lịch信息（兼容保留）────────────────────────────────────────
export function getLunarInfo(
  year: number,
  month: number,
  day: number,
  hour?: number,
  policy: LunarMonthPolicy = 'prev-month',
): LunarInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const effective = resolveEffectiveLunarDate(year, month, day, policy);
  // lunar-javascript 没有 .d.ts，立春换năm方法只在 runtime 上有，用 any 绕过
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lu = lunar as any;
  // Tử Vi Đẩu SốLập lá sốnăm（正tháng初Nhất换năm，与上方 astro.config:yearDivide='normal' 同口径）
  // 注意：节气Tứ Trụ(下方)用 getEightChar() 精确到立春/节的giờ刻，Bát字Tứ Trụ永远立春换năm，跟Tử Vi的"Âm lịchnăm"是两套
  const yearStem = STEMS.indexOf(lu.getYearGan());
  const yearBranch = BRANCHES.indexOf(lu.getYearZhi());
  // ★ 节气Tứ Trụ（Niên Trụ/Nguyệt Trụ/Nhật Trụ/Thời Trụ）+ 非节气Tứ Trụ（Âm lịch口径Nguyệt Trụ）
  let fourPillars: [string, string, string, string] | undefined;
  let fourPillarsLunar: [string, string, string, string] | undefined;
  try {
    // ★ 2026-09-01 立春/节气边界修正：节气Tứ Trụ的Niên Trụ、Nguyệt Trụ改用 getEightChar()（精确到立春/节的giờ刻）。
    //   原用 getYearGanByLiChun()/getMonthGan() 是「按立春当Thiên整Thiên」切换、Bất看giờ刻 —— 立春当Thiên凌晨出生
    //   的会被算进新的Nhấtnăm，năm/Nguyệt Trụ各差Nhất位（会员实测：2004-02-04 Sửugiờ应为QuýMùi/ẤtSửu，却排成GiápThân/BínhDần）。
    //   立春=2004-02-04 19:56，此人凌晨 2:40 生，本该上NhấtnămQuýMùi。lunar-javascript 的 getYearGanByLiChun
    //   即使传入giờ间也按ngày切换（实测无效），getEightChar 才精确到分。
    //   giờ刻用「giờThìn中点」(index*2 点)近似，与Lập lá số既有的Giờ Thái Dương ThựcgiờThìn同口径；Nhật Trụ/Thời TrụBất受立春影响、保持原算法。
    //   非节气ngày新旧完全Nhất致（只有落在立春/ThậpNhị节当Thiên、交节giờ刻前后的人才会变），已抽样 12 例逐Nhất比对验证。
    const effHour = (hour !== undefined && hour >= 0 && hour <= 11) ? hour * 2 : 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ec = (Solar as any).fromYmdHms(year, month, day, effHour, 0, 0).getLunar().getEightChar();
    const yearGZ = ec.getYear() as string;    // 节气Tứ TrụNiên Trụ：立春精确换năm
    const monthGZ = ec.getMonth() as string;  // 节气Tứ TrụNguyệt Trụ：节气精确换tháng + Ngũ虎遁用立春校正后的năm干
    const dayGZ = `${lu.getDayGan()}${lu.getDayZhi()}`;
    // Thời Trụ：ngày干 + giờ支共同决定；giờ干由 day stem + hour 推
    // 规则：GiápKỷngàyTýgiờ → GiápTý；ẤtCanhngàyTýgiờ → BínhTý；BínhTân → Mậu；ĐinhNhâm → Canh；MậuQuý → Nhâm
    const dayStem = STEMS.indexOf(lu.getDayGan());
    const branchIdx = hour !== undefined && hour >= 0 && hour <= 11 ? hour : 0;
    const timeStemBase = (dayStem % 5) * 2; // Týgiờ起的Thiên干
    const timeStemIdx = (timeStemBase + branchIdx) % 10;
    const timeGZ = `${STEMS[timeStemIdx]}${BRANCHES[branchIdx]}`;
    fourPillars = [yearGZ, monthGZ, dayGZ, timeGZ];

    // ★ 非节气Tứ Trụ（对齐主流Lập lá số软件「非节气Tứ Trụ」）：Niên Trụ用Âm lịchnăm(正tháng初Nhất换năm，与Tử Vi同口径)、
    //   Nguyệt Trụ按Âm lịchtháng(初Nhất换tháng)重算 —— 节气交界ngày(如生在小暑后数Thập分钟)节气版会进下Nhấttháng、Âm lịch版仍在本tháng，Nguyệt Trụ差Nhất位。
    //   ngày/Thời TrụBất受nămtháng口径影响，复用上方。lunar-javascript 无Âm lịch口径Nguyệt Trụ方法，用Ngũ虎遁手算。
    const absM = effective.lunarMonth;
    const yearGZLunar = `${STEMS[yearStem]}${BRANCHES[yearBranch]}`;        // Âm lịchnăm干支(正tháng初Nhất换năm)
    const monthBranchIdx = (absM + 1) % 12;                                 // Âm lịchtháng→tháng支(正tháng=Dần)
    const monthStemBase = ((yearStem % 5) * 2 + 2) % 10;                    // Ngũ虎遁：Âm lịchnăm干定正tháng(Dần)Thiên干
    const monthStemIdx = (monthStemBase + (absM - 1)) % 10;
    const monthGZLunar = `${STEMS[monthStemIdx]}${BRANCHES[monthBranchIdx]}`;
    fourPillarsLunar = [yearGZLunar, monthGZLunar, dayGZ, timeGZ];
  } catch { /* lunar-javascript 接口异常giờ跳过 */ }

  return {
    lunarYear: effective.lunarYear,
    lunarMonth: effective.lunarMonth,
    lunarDay: effective.lunarDay,
    yearStem: yearStem >= 0 ? yearStem : 0,
    yearBranch: yearBranch >= 0 ? yearBranch : 0,
    isLeapMonth: effective.isLeapMonth,
    fourPillars,
    fourPillarsLunar,
  };
}

// ─── Mệnh ChủSao / Thân ChủSao（按Địa支查表）─────────────────────────
const MING_ZHU_TABLE: Record<number, string> = {
  0: 'Tham Lang', 1: 'Cự Môn', 2: 'Lộc Tồn', 3: 'Văn Khúc', 4: 'Liêm Trinh', 5: 'Vũ Khúc',
  6: 'Phá Quân', 7: 'Vũ Khúc', 8: 'Liêm Trinh', 9: 'Văn Khúc', 10: 'Lộc Tồn', 11: 'Cự Môn',
};
const SHEN_ZHU_TABLE: Record<number, string> = {
  0: 'Hỏa Tinh', 6: 'Hỏa Tinh', 1: 'Thiên Tướng', 7: 'Thiên Tướng',
  2: 'Thiên Lương', 8: 'Thiên Lương', 3: 'Thiên Đồng', 9: 'Thiên Đồng',
  4: 'Văn Xương', 10: 'Văn Xương', 5: 'Thiên Cơ', 11: 'Thiên Cơ',
};
export function calcMingZhu(branch: number): string { return MING_ZHU_TABLE[branch] ?? ''; }
export function calcShenZhu(branch: number): string { return SHEN_ZHU_TABLE[branch] ?? ''; }
export function calcYinYangGender(yearStem: number, gender: 'male' | 'female'): string {
  return `${yearStem % 2 === 0 ? 'Dương' : 'Âm'} ${gender === 'male' ? 'Nam' : 'Nữ'}`;
}

// ─── 亮度映射 ────────────────────────────────────────────────────
function mapBrightness(b?: string): 'bright' | 'normal' | 'dim' {
  if (!b) return 'normal';
  if (b === 'Miếu' || b === 'Vượng') return 'bright';
  if (b === 'Hạn' || b === 'Bất' || b === '闲') return 'dim';
  return 'normal';
}

/** 从 iztro 原始亮度文本中提取标准 7 档之Nhất */
function extractRawBrightness(b?: string): import('./types').StarBrightness | undefined {
  if (!b) return undefined;
  const valid: import('./types').StarBrightness[] = ['Miếu', 'Vượng', 'Đắc', 'Lợi', 'Bình', 'Bất', '闲', 'Hạn', 'Địa'];
  for (const x of valid) {
    if (b.includes(x)) return x;
  }
  return undefined;
}

// ─── Tinh Diệu类型映射 ────────────────────────────────────────────────
const SHA_STARS = new Set(['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp',
  'Thiên Không', 'Tuần Không', 'Phó Tuần', 'Triệt Lộ', 'Triệt Không', 'Phó Triệt', 'Đại Hao', 'Thiên Sứ', 'Thiên Thương',
  // ★ 扩充（之前只判主煞，bán hung杂耀漏判）
  'Thiên Hình', 'Thiên Khốc', 'Thiên Hư', 'Thiên Nguyệt', 'Âm Sát', 'Phi Liêm', 'Không Vong',
  'Cô Thần', 'Quả Tú']);
const LUCKY_STARS = new Set(['Văn Xương', 'Văn Khúc', 'Tả Phù', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt',
  'Lộc Tồn', 'Thiên Mã', 'Thiên Quan', 'Thiên Phúc', 'Thiên Tài', 'Thiên Thọ', 'Tam Thai', 'Bát Tọa', 'Ân Quang',
  'Thiên Quý', 'Đài Phụ', 'Long Trì', 'Phụng Các', 'Hồng Loan', 'Thiên Hỷ',
  // ★ 扩充：Cát杂耀
  'Giải Thần', 'Thiên Đức', 'Nguyệt Đức', 'Niên Giải', 'Thiên Vu', 'Hoa Cái', 'Phong Cáo']);

function mapStarType(starName: string, iztroType: string): Star['type'] {
  if (SHA_STARS.has(starName)) return 'sha';
  if (LUCKY_STARS.has(starName)) return 'lucky';
  const t = (iztroType ?? '').toLowerCase();
  if (t === 'Chính Tinh' || t === 'major') return 'major';
  if (t === 'Sát Tinh' || t === 'tough') return 'sha';
  if (t === 'Cát Tinh' || t === 'soft' || t === 'Lộc Tồn' || t === 'Thiên Mã') return 'lucky';
  return 'minor';
}

// ─── Ngũ行Cục名称 → 数字 ──────────────────────────────────────────
function parseWuxingJu(name: string): number {
  if (name.includes('Nhị')) return 2;
  if (name.includes('Tam')) return 3;
  if (name.includes('Tứ')) return 4;
  if (name.includes('Ngũ')) return 5;
  if (name.includes('Lục')) return 6;
  return 3;
}

// ─── 主函数：生成Lá số ────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────
// Thiên KhôiThiên Việt · 默认派(KY1)修正
//
// 用户决策(2026-05-30):Lập lá số对齐主流Lập lá số默认口径(金标准盘对照实证,见 docs/school-parity-report.md)。
// 实测 10 Thiên干năm仅【Tânnăm】与 iztro 现状Bất同:
//   Tânnăm  默认口径 = Thiên Khôi在Dần / Thiên Việt在Ngọ;iztro(主流) = Thiên Khôi在Ngọ / Thiên Việt在Dần。
// ⚠️ 默认派在Tânnăm与主流「Tân马虎 = 魁Ngọ钺Dần」口诀相反(魁钺对调)。这是主流Lập lá số软件的
//    既定排法,此处遵用户「对齐默认口径」决定。其余 9 个Thiên干năm默认口径与 iztro 本就Nhất致。
// 回退:删除 generateChart 内 applySchoolKuiyue(...) 调用即恢复 iztro 主流派。
// ─────────────────────────────────────────────────────────────────────────
function relocateStar(palaces: Palace[], name: string, targetBranch: number): void {
  let moved: Star | undefined;
  for (const p of palaces) {
    const i = p.stars.findIndex((s) => s.name === name);
    if (i >= 0) {
      if (p.branch === targetBranch) return; // 已在目标Cung,无需移动
      moved = p.stars[i];
      p.stars.splice(i, 1);
      break;
    }
  }
  if (!moved) return;
  const target = palaces.find((p) => p.branch === targetBranch);
  if (target) {
    target.stars.push(moved);
    // ★ 2026-06-20 Thiên KhôiThiên Việt换位（默认派 KY1）后,亮度仍是 iztro 旧Cung Vị算的（错位）。按新CungĐịa支重算亮度。
    const rb = schoolStarBrightness(moved.name, targetBranch, currentBrightSchool);
    moved.brightnessRaw = extractRawBrightness(rb);
    moved.brightness = rb ? mapBrightness(rb) : undefined;
  }
}

function applySchoolKuiyue(palaces: Palace[], yearStemCn: string): void {
  const gan = STEMS.indexOf(yearStemCn); // Giáp=0 … Quý=9
  if (gan < 0) return;
  const row = SCHOOL_AX.KY_ARR1[gan + 1]; // KY 表「Giáp=1」起;Tý起Nhất编码
  if (!row) return;
  relocateStar(palaces, 'Thiên Khôi', row[0] - 1); // Tý起Nhất(Tý=1) → BRANCHES 索引(Tý=0)
  relocateStar(palaces, 'Thiên Việt', row[1] - 1);
}

/**
 * 本Mệnh顶栏「Đại Hao」（năm支Sao，Bất是Cung底Bác SỹThậpNhị神那颗）。
 * 2026-08-14 按金标准盘核对ThậpNhịnăm支：Dương支Tuế Phá+1，Âm支Tuế Phá−1。
 * Tý=0 起偶数为Dương支（TýDầnThìnNgọThânTuất）。
 */
export function schoolDahaoBranch(yearBranch: number): number {
  const suiPo = (yearBranch + 6) % 12;
  return yearBranch % 2 === 0 ? (suiPo + 1) % 12 : (suiPo + 11) % 12;
}

function pushNatalStar(palaces: Palace[], branch: number, name: string): void {
  const target = palaces.find((p) => p.branch === branch);
  if (!target || target.stars.some((s) => s.name === name)) return;
  const rb = schoolStarBrightness(name, branch, currentBrightSchool);
  target.stars.push({
    name,
    type: mapStarType(name, ''),
    brightness: rb ? mapBrightness(rb) : undefined,
    brightnessRaw: extractRawBrightness(rb),
  });
}

function applySchoolDahao(palaces: Palace[], yearBranch: number): void {
  pushNatalStar(palaces, schoolDahaoBranch(yearBranch), 'Đại Hao');
}

/**
 * 本Mệnh顶栏Triệt Không/Phó Triệt。
 * 对Tý仍是GiápKỷThânDậu、ẤtCanhNgọMùi、BínhTânThìnTỵ、ĐinhNhâmDầnMão、MậuQuýTýSửu（iztro 已排对）。
 * Dương干Triệt Không落DươngCung、Phó Triệt落ÂmCung；Âm干对调。iztro Nhất律Triệt Lộ=DươngCung、Không Vong=ÂmCung，Âm干要换Cung。
 * 2026-08-14 金标准盘：TânSửuTỵTriệt Không/ThìnPhó Triệt，KỷHợiDậuTriệt Không/ThânPhó Triệt，ẤtTỵMùiTriệt Không/NgọPhó Triệt。
 */
function applySchoolJiekong(palaces: Palace[], yearStem: number): void {
  for (const p of palaces) {
    for (const s of p.stars) {
      if (s.name === 'Triệt Lộ') s.name = 'Triệt Không';
      else if (s.name === 'Không Vong') s.name = 'Phó Triệt';
      else continue;
      // ★ 2026-10-20 改名后按新名字补亮度：iztro 原名查Bất到亮度，Dương干năm（Bất换Cung、下面直接 return）
      //   Triệt Không / Phó TriệtNhất直留白，主流Lập lá số默认口径是有亮度的（真盘：BínhDần ThìnTriệt Không=Hạn、TỵPhó Triệt=Miếu）。Âm干换Cung后下面再按新Cung重算。
      const rb = schoolStarBrightness(s.name, p.branch, currentBrightSchool);
      s.brightness = rb ? mapBrightness(rb) : undefined;
      s.brightnessRaw = extractRawBrightness(rb);
    }
  }
  if (yearStem % 2 === 0) return;
  const jie = palaces.find((p) => p.stars.some((s) => s.name === 'Triệt Không'));
  const fu = palaces.find((p) => p.stars.some((s) => s.name === 'Phó Triệt'));
  if (!jie || !fu || jie === fu) return;
  const jieStar = jie.stars.find((s) => s.name === 'Triệt Không');
  const fuStar = fu.stars.find((s) => s.name === 'Phó Triệt');
  if (!jieStar || !fuStar) return;
  jie.stars = jie.stars.filter((s) => s !== jieStar);
  fu.stars = fu.stars.filter((s) => s !== fuStar);
  const rbJ = schoolStarBrightness('Triệt Không', fu.branch, currentBrightSchool);
  const rbF = schoolStarBrightness('Phó Triệt', jie.branch, currentBrightSchool);
  jieStar.brightness = rbJ ? mapBrightness(rbJ) : undefined;
  jieStar.brightnessRaw = extractRawBrightness(rbJ);
  fuStar.brightness = rbF ? mapBrightness(rbF) : undefined;
  fuStar.brightnessRaw = extractRawBrightness(rbF);
  fu.stars.push(jieStar);
  jie.stars.push(fuStar);
}

/** Tuần Không成对（TýSửu/DầnMão/ThìnTỵ/NgọMùi/ThânDậu/TuấtHợi）。Phó Tuần落在另Nhất支：Tuần KhôngDương支+1、Âm支−1。 */
function applySchoolFuxun(palaces: Palace[]): void {
  const xun = palaces.find((p) => p.stars.some((s) => s.name === 'Tuần Không'));
  if (!xun) return;
  const fu = xun.branch % 2 === 0 ? (xun.branch + 1) % 12 : (xun.branch + 11) % 12;
  pushNatalStar(palaces, fu, 'Phó Tuần');
}

export function generateChart(
  birthInfo: BirthInfo,
  opts?: { leapMonth?: LunarMonthPolicy },
): ZiweiChart {
  const { year, month, day, hour, gender } = birthInfo;
  if (!Number.isInteger(hour) || hour < 0 || hour > 11) {
    throw new RangeError(`hour must be an integer branch index from 0 to 11; received ${hour}`);
  }
  // Dương lịchngày期必须真实存在：2 tháng 30 ngày、非闰năm 2 tháng 29 ngày、4 tháng 31 ngày这类ngày期，
  // iztro Bất报错而是顺延成下个tháng的头几ThiênLập lá số，结果会和真实ngày期的盘重复。
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    !Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) ||
    probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day
  ) {
    throw new RangeError(`solar date does not exist: ${year}-${month}-${day}`);
  }
  const iztroGender = gender === 'male' ? 'Nam' : 'Nữ';

  // 闰tháng处理（流派分歧：归本tháng / 归下tháng / 前后半分）
  // 默认 = DEFAULT_LEAP_MONTH（2026-09-05 起 split：主流Lập lá số默认口径「tháng中分界」，150 组金标准盘对照验证；倪师派归下tháng可经流派抽屉切 next-month）
  // 非 split giờ先算Âm lịch，闰tháng才切 byLunar；非闰tháng仍走 bySolar，与 split 行为完全Nhất致
  const leapMode = opts?.leapMonth ?? DEFAULT_LEAP_MONTH;
  const effectiveLunar = resolveEffectiveLunarDate(year, month, day, leapMode);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let astrolabe: any;

  if (leapMode !== 'split' && effectiveLunar.rawLunarMonth < 0) {
      // 闰tháng生人 → 按用户选项切换tháng份归属
      const lunarDateStr = `${effectiveLunar.lunarYear}-${effectiveLunar.lunarMonth}-${effectiveLunar.lunarDay}`;
      astrolabe = astro.byLunar(
        lunarDateStr,
        hour,
        iztroGender,
        effectiveLunar.isLeapMonth,
        false,
        'vi-VN',
      );
  } else {
    // 非闰tháng或 split 模式：直接 bySolar，保持 iztro 的既有行为
    astrolabe = astro.bySolar(`${year}-${month}-${day}`, hour, iztroGender, true, 'vi-VN');
  }

  // 让序列化后的 chart.birthInfo 继续携带同Nhất闰tháng策略，供客户端运限 helper 重建本Lá số。
  const chartBirthInfo = {
    ...birthInfo,
    leapMonthPolicy: leapMode,
  } as BirthInfo & { leapMonthPolicy: LunarMonthPolicy };

  // ── 组装ThậpNhịCung ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const palaces: Palace[] = astrolabe.palaces.map((p: any) => {
    const branch = BRANCHES.indexOf(p.earthlyBranch as string);
    const stem   = STEMS.indexOf(p.heavenlyStem as string);

    // 合并所有Sao：Chính Tinh + 次Sao + 杂耀
    const allStars: Star[] = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(p.majorStars ?? []).map((s: any) => {
        // ★ 2026-06-20 全套对齐主流Lập lá số口径:亮度统Nhất查 SB_[currentBrightSchool] 表(全书派默认),Bất再用 iztro/善本表
        const rb = schoolStarBrightness(s.name as string, branch, currentBrightSchool);
        return {
          name:          s.name as string,
          type:          'major' as const,
          brightness:    rb ? mapBrightness(rb) : undefined,
          brightnessRaw: extractRawBrightness(rb),
          siHua:         s.mutagen as Star['siHua'],
        };
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(p.minorStars ?? []).map((s: any) => {
        // ★ 2026-06-20 Phụ Tinh(Tả PhùHữu BậtThiên KhôiThiên ViệtLộc TồnThiên Mã) + Sát Tinh(火铃羊陀空劫) 同走 SB 表(同Nhất套映射/索引)
        const rb = schoolStarBrightness(s.name as string, branch, currentBrightSchool);
        return {
          name:          s.name as string,
          type:          mapStarType(s.name as string, s.type as string),
          brightness:    rb ? mapBrightness(rb) : undefined,
          brightnessRaw: extractRawBrightness(rb),
          siHua:         s.mutagen as Star['siHua'],
        };
      }),
      // ★ 之前 adjectiveStars Tất cả强制 type='minor'，绕过了 mapStarType，
      //   导致Hồng Loan/Thiên Hỷ（lucky）、Thiên Hình/Thiên Khốc（sha）等被错分类。改成走映射函数，
      //   让所有Sao正确按性质分到 lucky / sha / minor Tam类，UI 也能正常分区Hiển thị
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(p.adjectiveStars ?? []).map((s: any) => {
        // ★ 2026-06-20 杂耀亮度对齐主流Lập lá số口径：行号 = SB 亮度表 ID（SCHOOL_STAR_ID_TO_NAME 反查），
        //   落Cung沿用 iztro（与金标准盘Nhất致），金标准盘 24/24 验证。名字Bất在表里的杂耀 → undefined（留白，同现状）。
        const rb = schoolStarBrightness(s.name as string, branch, currentBrightSchool);
        return {
          name:          s.name as string,
          type:          mapStarType(s.name as string, (s.type as string) ?? ''),
          brightness:    rb ? mapBrightness(rb) : undefined,
          brightnessRaw: extractRawBrightness(rb),
          siHua:         s.mutagen as Star['siHua'],
        };
      }),
    ];

    // ★ 2026-06-20 对齐主流Lập lá số口径：默认口径把「岁前12神/将前12神」里的特定神煞当本MệnhSaoHiển thị
    //   （Kiếp Sát@将前、Long Đức@岁前），iztro 把这两套放在 jiangqian12/suiqian12 单独字段，
    //   原装配只取 major/minor/adjective Tam类 → 整套漏了。在此补回（这两颗金标准盘亦Bất标亮度，留白）。
    //   năm支Đại HaoBất走岁前12神（iztro 岁前Đại Hao=Tuế Phá，默认口径Bất是），见 applySchoolDahao。
    for (const sname of [p.suiqian12, p.jiangqian12] as (string | undefined)[]) {
      if (sname === 'Kiếp Sát' || sname === 'Long Đức') {
        allStars.push({ name: sname, type: mapStarType(sname, '') });
      }
    }

    const range = p.decadal?.range;
    return {
      branch:        branch >= 0 ? branch : 0,
      stem:          stem >= 0 ? stem : 0,
      name:          p.name as string,
      stars:         allStars,
      daXianAge:     range ? [range[0], range[1]] as [number, number] : undefined,
      isMingGong:    p.name === 'Mệnh',
      isShenGong:    p.isBodyPalace ?? false,
      isCurrentDaXian: false,
    };
  });

  // ★ Thiên KhôiThiên Việt对齐默认派(KY1)——用户决策 2026-05-30,实测仅Tânnăm与现状Bất同(见上方函数注释)
  const yearStemCn = (astrolabe.rawDates?.chineseDate?.yearly?.[0]) as string | undefined;
  if (yearStemCn) applySchoolKuiyue(palaces, yearStemCn);

  // ── 当前năm龄 & Đại Hạn ──
  // ★ 用 iztro horoscope.age.nominalAge（中国虚岁口径，与 daXianAge 范围Nhất致）
  // 旧实现 `currentYear - year` 是năm份差（少 1），导致Đại Hạn边界năm份错位 → 用户感觉
  // "Đại Hạn没走对，似乎还在走上Nhất个Đại Hạn"。统Nhất用 iztro 自Thân口径修复。
  let currentAge: number;
  try {
    const horo = (astrolabe as unknown as { horoscope: () => { age: { nominalAge: number } } }).horoscope();
    currentAge = horo.age.nominalAge;
  } catch {
    // fallback：iztro 接口异常giờ回退到虚岁推导
    currentAge = new Date().getFullYear() - year + 1;
  }

  palaces.forEach(p => {
    if (p.daXianAge && currentAge >= p.daXianAge[0] && currentAge <= p.daXianAge[1]) {
      p.isCurrentDaXian = true;
    }
  });

  // ── 借Đối Cung结构化字段（codex P0：避免文案层从自然Ngôn ngữ反查Mượn Cung信息）──
  palaces.forEach(p => {
    p.oppositeBranch = (p.branch + 6) % 12;
    const mainStars = p.stars.filter(s => s.type === 'major');
    p.isEmpty = mainStars.length === 0;
    if (p.isEmpty) {
      const oppPalace = palaces.find(q => q.branch === p.oppositeBranch);
      if (oppPalace) {
        p.borrowedFromBranch = oppPalace.branch;
        p.borrowedFromName = oppPalace.name;
        p.borrowedStars = oppPalace.stars.filter(s => s.type === 'major').map(s => s.name);
      }
    }
  });

  // ── 关键Cung支 ──
  const mingGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfSoulPalace as string);
  const shenGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfBodyPalace as string);
  const wuxingJuName   = astrolabe.fiveElementsClass as string;
  const wuxingJu       = parseWuxingJu(wuxingJuName);

  // ── Tử ViSao位置 ──
  const ziweiPalace = palaces.find(p => p.stars.some(s => s.name === 'Tử Vi' && s.type === 'major'));
  const ziweiPos    = ziweiPalace?.branch ?? 0;

  // ── Đại Hạn数组（倪师《Thiên纪》正统：Tứ Hóa永远固定，Đại Hạn只看Cung Vị移动）──
  // Bất再生成 daXians[].siHua / stemIndex / stemName（飞Sao派字段已下线）
  const daXians: DaXian[] = palaces
    .filter(p => p.daXianAge)
    .sort((a, b) => a.daXianAge![0] - b.daXianAge![0])
    .map(p => ({
      startAge:    p.daXianAge![0],
      endAge:      p.daXianAge![1],
      palaceBranch: p.branch,
      palaceName:   p.name,
    }));

  // Cung干自化已下线（倪师Bất主张飞Sao派Cung干自化论）

  const currentDaXianIndex = daXians.findIndex(
    dx => currentAge >= dx.startAge && currentAge <= dx.endAge,
  );

  // ── Âm lịch信息（含节气Tứ Trụ）──
  const lunarInfo = getLunarInfo(year, month, day, hour, leapMode);

  // ★ 2026-08-14 金标准盘核对：Triệt Không/Phó TriệtÂm干对调 + năm支Đại Hao + Tuần Không成对Phó Tuần
  applySchoolJiekong(palaces, lunarInfo.yearStem);
  applySchoolDahao(palaces, lunarInfo.yearBranch);
  applySchoolFuxun(palaces);

  // ── Mệnh Chủ / Thân Chủ / ÂmDươngGiới tính ──
  const mingZhu = calcMingZhu(mingGongBranch >= 0 ? mingGongBranch : 0);
  const shenZhu = calcShenZhu(lunarInfo.yearBranch);
  const yinYangGender = calcYinYangGender(lunarInfo.yearStem, gender);

  return {
    birthInfo: chartBirthInfo,
    lunarInfo,
    mingGongBranch: mingGongBranch >= 0 ? mingGongBranch : 0,
    shenGongBranch: shenGongBranch >= 0 ? shenGongBranch : 0,
    wuxingJu,
    wuxingJuName,
    ziweiPos,
    palaces,
    daXians,
    currentAge,
    currentDaXianIndex,
    mingZhu,
    shenZhu,
    yinYangGender,
  };
}
