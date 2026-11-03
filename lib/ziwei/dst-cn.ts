/**
 * 中国大陆夏令giờ判定 —— 逐字对齐主流Lập lá số口径。
 *
 * 起因：用户留言（2026-08-13）「1986năm至1992năm中国大陆执行夏令giờ，Bất知道该软件是否核算在内？」
 * 当giờ答案是「没有」：lib/ziwei/true-solar-time.ts 的口径只有「东Bát区钟表giờ间 + 经度修正 + 均giờ差」，
 * 全站搜Bất到任何夏令giờ处理，表单也无提示。
 *
 * 为什么这条要紧：夏令giờ期间钟表拨快 1 小giờ，而giờThìn是 2 小giờNhất档 ——
 * 出生giờ刻落在giờThìn边界的人，Mệnh/Thân/Đại Hạn会整个换掉。比经度修正（最多 17 分钟）严重Đắc多。
 *
 * ── 数据来源与口径 ───────────────────────────────────────────────
 * 表与判定逻辑**按通行口径整理**（XLS_CN 表与其判定函数），并经金标准盘核对。
 * 本仓铁律是「Lập lá số必须与主流Lập lá số口径Nhất致」，所以照抄，Bất按自Kỷ的理解改。
 *
 * 与 IANA tzdata（Asia/Shanghai）比对过（2026-08-24，用 Node ICU 逐ngày采样）：
 *   · 1986/1987/1989/1990/1991 起始ngày**完全Nhất致**；
 *   · 结束ngày主流口径Nhất律比 IANA「最后Nhất个整Thiên」晚 1 Thiên —— 这是语义差异Bất是数据差异：
 *     IANA 在结束ngày 02:00 转换，主流口径把整个转换ngày算作夏令giờ；
 *   · **1988 起始ngày是真分歧**：主流口径 4/10，IANA 4/17（两Thiên都是周ngày）。按铁律取主流口径。
 *   · 1979 năm之前分歧较大：IANA 的 Asia/Shanghai 对战乱năm代与建国初期记录零散
 *     （多数năm份记为无夏令giờ），主流口径用的是Nhất张简化的全国表。同样按铁律取主流口径。
 *
 * ── 为什么只提示、Bất自动减 1 小giờ ─────────────────────────────
 * 主流Lập lá số软件本Thân就只是弹窗告知（判定为夏令giờgiờ提示Nhất段说明文案，
 * 全程没有任何减 1 小giờ的动作）。这个设计是对的：
 *   **我们无法知道用户报的是夏令giờ读数、还是他自Kỷ已经换算过的标准giờ。**
 * 默默减Nhất小giờ既可能算错，又会把所有存量Lịch sửLá số悄悄改掉。所以只告知，让用户自Kỷ决定。
 * 2026-09-30 站长同意：合盘电脑宽屏的夏令giờ说明浮层里给Nhất个「减 1 小giờ，改为 07:30」按钮 ——
 *   仍是**用户自Kỷ点**、点了可撤销，从Bất自动减（components/heming/HemingStepForm.tsx）。
 */

/** 通行口径 XLS_CN，逐字照抄：[năm, 起tháng, 起ngày, 止tháng, 止ngày]，起止ngày**都含**。 */
const XLS_CN: readonly (readonly [number, number, number, number, number])[] = [
  [1935, 5, 1, 9, 30], [1936, 5, 1, 9, 30], [1937, 5, 1, 9, 30], [1938, 5, 1, 9, 30],
  [1939, 5, 1, 9, 30], [1940, 5, 1, 9, 30], [1941, 5, 1, 9, 30], [1942, 5, 1, 9, 30],
  [1943, 5, 1, 9, 30], [1944, 5, 1, 9, 30], [1945, 5, 1, 9, 30], [1946, 5, 1, 9, 30],
  [1947, 5, 1, 9, 30], [1948, 5, 1, 9, 30], [1949, 5, 1, 9, 30], [1950, 5, 1, 9, 30],
  [1951, 5, 1, 9, 30], [1952, 3, 1, 10, 31], [1953, 4, 1, 10, 31], [1954, 4, 1, 10, 31],
  [1955, 5, 1, 9, 30], [1956, 5, 1, 9, 30], [1957, 4, 1, 9, 30], [1958, 4, 1, 9, 30],
  [1959, 4, 1, 9, 30], [1960, 6, 1, 9, 30], [1961, 6, 1, 9, 30], [1974, 4, 1, 10, 31],
  [1975, 4, 1, 10, 31], [1979, 7, 1, 9, 30], [1986, 5, 4, 9, 14], [1987, 4, 12, 9, 13],
  [1988, 4, 10, 9, 11], [1989, 4, 16, 9, 17], [1990, 4, 15, 9, 16], [1991, 4, 14, 9, 15],
] as const;

/**
 * 该Dương lịchngày期是否处于中国大陆夏令giờ期间。
 *
 * ★ 判定逻辑逐字对齐通行口径（见文件头注）：**纯按ngày期**，Bất看小giờ。
 *   原式：
 *     if (month > m1 && month < m2) return true;
 *     if (month == m1) { if (day >= d1) return true; }
 *     else if (month == m2) { if (day <= d2) return true; }
 *   注意 `else if` —— 当 month == m1 且 day < d1 giờBất会再去比 m2 分支，这与通行口径Nhất致，别「顺手优化」。
 */
export function isChinaDST(year: number, month: number, day: number): boolean {
  for (const [y, m1, d1, m2, d2] of XLS_CN) {
    if (year !== y) continue;
    if (month > m1 && month < m2) return true;
    if (month === m1) {
      if (day >= d1) return true;
    } else if (month === m2) {
      if (day <= d2) return true;
    }
  }
  return false;
}

/** 该năm是否在夏令giờ表内（用于表单在用户选năm份giờ就提前提示，Bất必等排完盘）。 */
export function isChinaDSTYear(year: number): boolean {
  return XLS_CN.some(([y]) => y === year);
}

/** 该năm的夏令giờ区间（供文案展示）。Bất在表内Quay lại null。 */
export function chinaDSTRange(year: number): { start: string; end: string } | null {
  const hit = XLS_CN.find(([y]) => y === year);
  if (!hit) return null;
  const [, m1, d1, m2, d2] = hit;
  return { start: `${m1} tháng ${d1} ngày`, end: `${m2} tháng ${d2} ngày` };
}

/** 该năm的夏令giờ起止（数字，供英文等其他Ngôn ngữ自Kỷ拼thángngày；起止都含）。Bất在表内Quay lại null。 */
export function chinaDSTSpan(year: number): { startMonth: number; startDay: number; endMonth: number; endDay: number } | null {
  const hit = XLS_CN.find(([y]) => y === year);
  if (!hit) return null;
  const [, startMonth, startDay, endMonth, endDay] = hit;
  return { startMonth, startDay, endMonth, endDay };
}

/** 表内覆盖的Tất cảnăm份（升序），供文案与回归使用。 */
export function chinaDSTYears(): number[] {
  return XLS_CN.map(([y]) => y);
}
