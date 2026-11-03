/**
 * Lập lá số流派配置 — 9 类Lập lá số流派开关 + 默认值 + 持久化
 *
 * 数据源：按通行口径整理（详见 docs/school-alignment.md）
 *
 * 用户在 chart 页Cài đặt面板切换，立即Lập lại lá số
 */

import type { BrightnessSchool } from './school-data';

// ─── 9 类流派配置 ───────────────────────────────────────────────────────

/** 1. 14 Chính Tinh亮度表 */
export type BrightnessSchoolOption = 'default' | BrightnessSchool;

/** 2. CanhnămTứ Hóa（5 种变体）*/
export type GengYearSihua =
  | 'GYWYT'   // Dương武Âm同（主流默认口径，与 iztro Nhất致）
  | 'GYWTY'   // Dương武同Âm（KhoaKỵ互换说）
  | 'GYWFT'   // Dương武府同
  | 'GYWFX'   // Dương武府相
  | 'GYWTX';  // Dương武同相

/** 3. 安Thiên Mã */
export type TianmaSchool = 'year-branch' | 'month-branch';

/** 4. 安Thiên Không */
export type TiankongSchool = 'normal' | 'shun-jia-shi';

/** 5. Triệt KhôngTuần Không */
export type JiekongSchool = 'single' | 'double' | 'zhanyan';

/** 6. 安魁钺 */
export type KuiyueSchool = 'qs1' | 'qs2' | 'zhong-yiming' | 'network';

/** 7. 安Thiên SứThiên Thương */
export type TianshiTianshangSchool = 'normal' | 'zhongzhou';

/** 8. 安Trường SinhThậpNhị神 */
export type ChangshengSchool = 'yin-yang-shun-ni' | 'shui-tu' | 'huo-tu';

/** 9. 晚Týgiờ处理 */
export type LateZishi =
  | 'next-day'           // 视为次ngày（主流默认口径 + 我们当前）
  | 'current-day'        // 视为当ngày（倪师派）
  | 'all-current'        // Nhật Trụ当ngàyThời Trụ当ngày（Bát字）
  | 'day-cur-time-next'; // Nhật Trụ当ngàyThời Trụ次ngày（Bát字）

/** 10. 闰tháng处理（用户反馈：倪师派要求闰tháng归下tháng）*/
export type LeapMonth =
  | 'split'         // 分半（前 15 Thiên归上tháng，后 15 Thiên归下tháng）— ★我们默认 = 主流Lập lá số默认口径「tháng中分界」（2026-09-05 150 组金标准盘对照：9 张闰tháng后半tháng盘唯此口径逐Sao全同）
  | 'next-month'    // 整tháng归下tháng（倪师派：闰Tứtháng当Ngũtháng）
  | 'prev-month'    // 整tháng当本tháng普通tháng（闰Tứtháng当Tứtháng）— 可选口径「视为本tháng」；早先 2.6 万盘验证针对的是另Nhất套参照引擎，与金标准盘默认口径BấtNhất致
  | 'origin-month'; // Bất调整（闰Tứtháng仍标闰tháng，iztro fixLeap=false）

// ─── 完整配置对象 ──────────────────────────────────────────────────────

export interface SchoolConfig {
  brightnessSchool: BrightnessSchoolOption;
  gengYearSihua: GengYearSihua;
  tianmaSchool: TianmaSchool;
  tiankongSchool: TiankongSchool;
  jiekongSchool: JiekongSchool;
  kuiyueSchool: KuiyueSchool;
  tianshiTianshang: TianshiTianshangSchool;
  changshengSchool: ChangshengSchool;
  lateZishi: LateZishi;
  leapMonth: LeapMonth;
}

/** 默认配置 = 对齐主流Lập lá số默认口径（Phụ TinhLục煞Tạp Diệu+Tứ Hóa+运限 穷举零差异；闰tháng口径=整tháng归本tháng）*/
/**
 * ★ 2026-09-05 默认闰tháng口径 prev-month → split：150 组金标准盘对照，随机 100 盘 0 排Sao差异，
 * 唯Nhất系统性差异是 9 张闰tháng后半tháng盘——金标准盘默认「tháng中分界」(split)，Metis 旧默认整tháng归本tháng；切 split 后逐Sao全同。
 * 站长 2026-09-05 拍板改默认。algorithm / school-patches / yunxian-palace 的兜底默认都引用这Nhất个常量，别再各写字面量。
 */
export const DEFAULT_LEAP_MONTH: LeapMonth = 'split';

/** Tứ个合法闰tháng口径，供运行giờ校验（引擎对非法 policy 抛 RangeError，Chia sẻ链接解析在到达引擎前回落默认）。 */
const LEAP_MONTH_VALUES: readonly LeapMonth[] = ['split', 'prev-month', 'next-month', 'origin-month'];

export const SCHOOL_DEFAULT_CONFIG: SchoolConfig = {
  brightnessSchool: 'default',           // = 《Đẩu Số全书》（algorithm.ts 把 'default' 当 QS 用，对齐主流Lập lá số默认口径，10-20 改）
  gengYearSihua: 'GYWYT',                // Dương武Âm同
  tianmaSchool: 'year-branch',           // 依据năm支
  tiankongSchool: 'normal',              // 常规
  jiekongSchool: 'double',               // 正副双Sao
  kuiyueSchool: 'qs1',                   // Đẩu Số全书歌诀理解1
  tianshiTianshang: 'normal',            // 常规
  changshengSchool: 'yin-yang-shun-ni',  // 区分ÂmDương顺逆
  lateZishi: 'next-day',                 // 视为次ngày
  leapMonth: DEFAULT_LEAP_MONTH,         // 闰tháng分半（主流Lập lá số默认口径「tháng中分界」，150 组金标准盘对照验证）
};

// ─── localStorage 持久化 key ───────────────────────────────────────────
export const SCHOOL_CONFIG_LS_KEY = 'ziwei-school-config-v1';
/** 2026-09-05 闰tháng默认 prev-month→split 的Nhất次性Thiên Di标记（见 loadSchoolConfig） */
export const SCHOOL_LEAP_MIGRATED_KEY = 'ziwei-school-leap-split-migrated';

/**
 * ★ 2026-10-20 键名统Nhất改名：早期版本存在 `ziwei-<旧名>-config-v1` / `ziwei-<旧名>-leap-split-migrated`。
 * 新键还没有giờ，把旧键里的流派配置（认 brightnessSchool 字段）与闰thángThiên Di标记搬过来、删掉旧键；只认这两种形状，Bất碰别的键。
 */
function migrateLegacyKeys(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) keys.push(k); }
    if (localStorage.getItem(SCHOOL_CONFIG_LS_KEY) === null) {
      for (const k of keys) {
        if (k === SCHOOL_CONFIG_LS_KEY || !/^ziwei-[a-z]+-config-v1$/.test(k)) continue;
        const raw = localStorage.getItem(k);
        let parsed: unknown = null;
        try { parsed = raw ? JSON.parse(raw) : null; } catch { /* Bất是流派配置 */ }
        if (!parsed || typeof parsed !== 'object' || !('brightnessSchool' in parsed)) continue;
        localStorage.setItem(SCHOOL_CONFIG_LS_KEY, raw as string);
        localStorage.removeItem(k);
        break;
      }
    }
    for (const k of keys) {
      if (k === SCHOOL_LEAP_MIGRATED_KEY || !/^ziwei-[a-z]+-leap-split-migrated$/.test(k)) continue;
      if (localStorage.getItem(SCHOOL_LEAP_MIGRATED_KEY) === null) localStorage.setItem(SCHOOL_LEAP_MIGRATED_KEY, localStorage.getItem(k) ?? '1');
      localStorage.removeItem(k);
    }
  } catch { /* localStorage 被禁：照旧走默认 */ }
}

/**
 * 读 localStorage 配置（安全 fallback 到默认）
 * 浏览器端调用，服务端Quay lại默认
 */
export function loadSchoolConfig(): SchoolConfig {
  if (typeof window === 'undefined') return SCHOOL_DEFAULT_CONFIG;
  migrateLegacyKeys();
  try {
    const raw = localStorage.getItem(SCHOOL_CONFIG_LS_KEY);
    if (!raw) return SCHOOL_DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<SchoolConfig>;
    // ★ 2026-09-05 Nhất次性Thiên Di：旧默认 prev-month 是被整份存进 localStorage 的（抽屉存完整配置），分Bất清「默认」还是「手选」；
    //   而旧选项本Thân就标着「默认」，选它的人要的也是对齐默认口径 → 统Nhất迁到新默认 split，只迁Nhất次（Thiên Di标记），之后再手选 prev-month 就尊重
    if (parsed.leapMonth === 'prev-month' && !localStorage.getItem(SCHOOL_LEAP_MIGRATED_KEY)) {
      parsed.leapMonth = DEFAULT_LEAP_MONTH;
      try { localStorage.setItem(SCHOOL_LEAP_MIGRATED_KEY, '1'); localStorage.setItem(SCHOOL_CONFIG_LS_KEY, JSON.stringify({ ...SCHOOL_DEFAULT_CONFIG, ...parsed })); } catch { /* noop */ }
    }
    return normalizeBrightness({ ...SCHOOL_DEFAULT_CONFIG, ...parsed });
  } catch {
    return SCHOOL_DEFAULT_CONFIG;
  }
}

/**
 * ★ 2026-10-18 默认项与它底层的那张表只留Nhất项（站长：两项排出来Nhất样，别并排摆）。
 * ★ 2026-10-20 默认改成《Đẩu Số全书》（主流Lập lá số默认口径，见 algorithm.ts setBrightnessSchool），归并方向随之改：
 *   手选 QS（本机存的、Chia sẻ链接 bs=QS）Nhất律当默认，勾落在「《Đẩu Số全书》派（默认）」；
 *   XD2 Bất再归并——它现在是单独Nhất项「现代修正 v2」，手选了就尊重。
 *   10-18 到 10-20 之间被归成 'default' 的老 XD2 选择分Bất出来，随默认Nhất起变成全书（站长定：跟默认口径走）。
 */
function normalizeBrightness(cfg: SchoolConfig): SchoolConfig {
  return cfg.brightnessSchool === 'QS' ? { ...cfg, brightnessSchool: 'default' } : cfg;
}

/** Lưu配置到 localStorage */
export function saveSchoolConfig(cfg: SchoolConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHOOL_CONFIG_LS_KEY, JSON.stringify(cfg));
  } catch { /* localStorage 满或被禁 */ }
}

/** 重置为默认 */
export function resetSchoolConfig(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(SCHOOL_CONFIG_LS_KEY); } catch { /* noop */ }
}

// ─── 配置 → URL query 双向转换（用于Chia sẻ带流派的Lá số）────────────────────

/**
 * 流派 URL 参数 key 全集 — 与 configToParams 输出NhấtNhất对应，10 类配置 10 个 key。
 *
 * ★ 2026-06-12 修「Chia sẻ链接丢闰tháng口径」：chart 页此前两处手写 key 数组判断
 *   「URL 是否带流派参数」，都漏了 'lm'（闰tháng归属）——用户改成 next-month 后Chia sẻ，
 *   对方打开 ?lm=next-month 被无视、按默认闰tháng口径排出Bất同的盘。
 *   今后判断Nhất律复用本常量；configToParams 加字段giờ必须同步加这里。
 */
export const SCHOOL_PARAM_KEYS = ['bs', 'gys', 'tm', 'tk', 'jk', 'ky', 'tst', 'cs', 'lz', 'lm'] as const;

/** SchoolConfig → URL params（紧凑形式：?bs=qs&sh=GYWTY...）*/
export function configToParams(cfg: SchoolConfig): Record<string, string> {
  const out: Record<string, string> = {};
  if (cfg.brightnessSchool !== 'default') out.bs = cfg.brightnessSchool;
  if (cfg.gengYearSihua !== 'GYWYT') out.gys = cfg.gengYearSihua;
  if (cfg.tianmaSchool !== 'year-branch') out.tm = cfg.tianmaSchool;
  if (cfg.tiankongSchool !== 'normal') out.tk = cfg.tiankongSchool;
  if (cfg.jiekongSchool !== 'double') out.jk = cfg.jiekongSchool;
  if (cfg.kuiyueSchool !== 'qs1') out.ky = cfg.kuiyueSchool;
  if (cfg.tianshiTianshang !== 'normal') out.tst = cfg.tianshiTianshang;
  if (cfg.changshengSchool !== 'yin-yang-shun-ni') out.cs = cfg.changshengSchool;
  if (cfg.lateZishi !== 'next-day') out.lz = cfg.lateZishi;
  if (cfg.leapMonth !== DEFAULT_LEAP_MONTH) out.lm = cfg.leapMonth;   // 老Chia sẻ链接Bất带 lm 的，现按新默认 split 解析（与主流Lập lá số默认口径Nhất致）
  return out;
}

/** URLSearchParams → SchoolConfig（缺省字段用默认值填充）*/
export function paramsToConfig(params: URLSearchParams): SchoolConfig {
  return normalizeBrightness({
    brightnessSchool: (params.get('bs') as BrightnessSchoolOption) || SCHOOL_DEFAULT_CONFIG.brightnessSchool,
    gengYearSihua: (params.get('gys') as GengYearSihua) || SCHOOL_DEFAULT_CONFIG.gengYearSihua,
    tianmaSchool: (params.get('tm') as TianmaSchool) || SCHOOL_DEFAULT_CONFIG.tianmaSchool,
    tiankongSchool: (params.get('tk') as TiankongSchool) || SCHOOL_DEFAULT_CONFIG.tiankongSchool,
    jiekongSchool: (params.get('jk') as JiekongSchool) || SCHOOL_DEFAULT_CONFIG.jiekongSchool,
    kuiyueSchool: (params.get('ky') as KuiyueSchool) || SCHOOL_DEFAULT_CONFIG.kuiyueSchool,
    tianshiTianshang: (params.get('tst') as TianshiTianshangSchool) || SCHOOL_DEFAULT_CONFIG.tianshiTianshang,
    changshengSchool: (params.get('cs') as ChangshengSchool) || SCHOOL_DEFAULT_CONFIG.changshengSchool,
    lateZishi: (params.get('lz') as LateZishi) || SCHOOL_DEFAULT_CONFIG.lateZishi,
    // Chia sẻ链接的 lm 可能是任意字符串（老链接/手改 URL）；引擎现在对非法 policy 抛
    // RangeError，这里先校验，坏值回落默认口径，别让Nhất张坏链接崩掉整页。
    leapMonth: LEAP_MONTH_VALUES.includes(params.get('lm') as LeapMonth)
      ? (params.get('lm') as LeapMonth)
      : SCHOOL_DEFAULT_CONFIG.leapMonth,
  });
}

// ─── UI Hiển thị用：每个开关的所有选项 + Tiếng Việt标签 ──────────────────────────

export const SCHOOL_OPTIONS = {
  // ★ 2026-06-17 统Nhất格式(用户要求):每组【默认项】固定排第Nhất,且 desc 统Nhất以「默认 · xxx」开头
  brightnessSchool: [
    // ★ 10-20 默认项 = 《Đẩu Số全书》（主流Lập lá số默认口径「Tinh Diệu亮度依据Đẩu Số全书」），底层就是 QS 表，所以Bất再另列 QS
    { value: 'default', label: '《Đẩu Số全书》派', desc: '默认 · 与主流Lập lá số软件默认Nhất致' },
    { value: 'XD2', label: '现代修正 v2', desc: '现代修订亮度表（第Nhị版）' },
    { value: 'XD1', label: '现代修正 v1', desc: '现代修订亮度表（第Nhất版）' },
    { value: 'ZZ', label: '中州派', desc: '中州派理论' },
  ],
  gengYearSihua: [
    { value: 'GYWYT', label: 'Dương武Âm同', desc: '默认 · 与 iztro / 主流Nhất致' },
    { value: 'GYWTY', label: 'Dương武同Âm', desc: 'KhoaKỵ互换说' },
    { value: 'GYWFT', label: 'Dương武府同' },
    { value: 'GYWFX', label: 'Dương武府相' },
    { value: 'GYWTX', label: 'Dương武同相' },
  ],
  tianmaSchool: [
    { value: 'year-branch', label: '依据năm支', desc: '默认 · năm支起Thiên Mã' },
    { value: 'month-branch', label: '依据tháng支' },
  ],
  tiankongSchool: [
    { value: 'normal', label: '常规排法', desc: '默认 · 常规起Thiên Không' },
    { value: 'shun-jia-shi', label: '顺加生giờ' },
  ],
  jiekongSchool: [
    { value: 'double', label: '正副双Sao', desc: '默认 · 正副双Sao并用' },
    { value: 'single', label: '常规单Sao' },
    { value: 'zhanyan', label: '占验派' },
  ],
  kuiyueSchool: [
    { value: 'qs1', label: '《Đẩu Số全书》理解 1', desc: '默认 · 全书歌诀理解Nhất' },
    { value: 'qs2', label: '《Đẩu Số全书》理解 2', desc: '差异仅在CanhTânNhâmQuýnăm生人' },
    { value: 'zhong-yiming', label: '钟义明先生书籍排法' },
    { value: 'network', label: '网络流传排法' },
  ],
  tianshiTianshang: [
    { value: 'normal', label: '常规排法', desc: '默认 · Thân ±5 位' },
    { value: 'zhongzhou', label: '中州派排法', desc: '生tháng奇偶 × Giới tính 交换' },
  ],
  changshengSchool: [
    { value: 'yin-yang-shun-ni', label: '区分ÂmDương顺逆', desc: '默认 · ÂmDương顺逆起Trường Sinh' },
    { value: 'shui-tu', label: '水土共Trường Sinh', desc: 'Thổ Ngũ Cục起点 = Thủy Nhị Cục起点 (Thân)' },
    { value: 'huo-tu', label: '火土共Trường Sinh', desc: 'Thổ Ngũ Cục起点 = Hỏa Lục Cục起点 (Dần)' },
  ],
  lateZishi: [
    { value: 'next-day', label: '视为次ngày', desc: '默认 · 主流做法' },
    { value: 'current-day', label: '视为当ngày', desc: '倪师派' },
    { value: 'all-current', label: 'Nhật Trụ当ngày / Thời Trụ当ngày（Bát字）' },
    { value: 'day-cur-time-next', label: 'Nhật Trụ当ngày / Thời Trụ次ngày（Bát字）' },
  ],
  // ★ 2026-06-17 全站约定:每组默认选项Nhất律排第Nhất；去「Thiên Cơ」Nhị字(避商标侵Quyền)
  // ★ 2026-09-05 默认改为分半：主流Lập lá số默认口径「tháng中分界」，150 组金标准盘对照唯此口径逐Sao全同
  leapMonth: [
    { value: 'split', label: '视为分半', desc: '默认 · 「tháng中分界」，与主流Lập lá số软件默认Nhất致（前 15 Thiên归本tháng / 后 15 Thiên归下tháng，150 组对照盘验证）' },
    { value: 'prev-month', label: '视为本tháng', desc: '闰Tứtháng整tháng当Tứtháng普通tháng排' },
    { value: 'next-month', label: '视为下tháng', desc: '倪师派（闰Tứtháng整tháng当Ngũtháng排）' },
    { value: 'origin-month', label: '保持闰tháng', desc: 'Bất调整，闰Tứtháng仍标闰tháng' },
  ],
} as const;

/** 10 类配置的Tiếng Việt标签（用于 UI 标题）*/
export const SCHOOL_LABELS: Record<keyof SchoolConfig, string> = {
  brightnessSchool: 'Tinh Diệu亮度表',
  gengYearSihua: 'CanhnămTứ Hóa',
  tianmaSchool: '安Thiên Mã',
  tiankongSchool: '安Thiên Không',
  jiekongSchool: '安Triệt KhôngTuần Không',
  kuiyueSchool: '安魁钺',
  tianshiTianshang: '安Thiên SứThiên Thương',
  changshengSchool: 'Trường SinhThậpNhị神',
  lateZishi: '晚Týgiờ',
  leapMonth: '闰tháng归属',
};
