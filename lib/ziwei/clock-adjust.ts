/**
 * 出生钟表giờ间Bình移（夏令giờ / 当nămgiờ区与现在Bất同）—— 纯函数，Lập lá số引擎层。
 *
 * 用途：出生那Thiên当Địa在实行夏令giờ（如中国大陆 1986–1991 năm夏季，见 dst-cn.ts），或当nămgiờ区与现在Bất同giờ，
 * 用户报的往往是当năm钟表读数。Lập lá số口径按标准giờ间算（true-solar-time.ts），所以要先把钟表读数换成标准giờ间。
 * 建议做成「用户亲手点、可撤销」的按钮，**Bất要自动改**：程序无法知道用户填的是当năm钟表读数，还是已换算过的标准giờ间
 * （主流Lập lá số软件也只提示、Bất自动减，见 dst-cn.ts 文件头）。
 *
 * 换算方向：标准giờ间 = 钟表读数 −（当năm实际偏移 − 标准偏移）。
 *   · 中国大陆 1986–1991 夏令giờ：差 +60 分钟 → 减 60；
 *   · 海外夏令giờ同理（如美东 −4:00 对 −5:00 → 减 60）；当nămgiờ区比现在慢（如马来西亚 1982 năm前 +7:30、现在 +8:00）：差 −30 → 加 30。
 *
 * 跨ngày（结果Bất在 0:00–23:59）Nhất律给 null，Bất替用户改ngày期：Âm lịchtháng大小、闰tháng、晚Týgiờ换ngày交织，
 * 自动跨ngày容易改错，交给用户手动改ngày期和giờ间。
 */

export interface ClockTime { clockHour: string; clockMinute: string }

/** 当năm钟表读数 → 标准giờ间要Bình移的分钟数（actual、std 都是相对 UTC 的分钟偏移，东正西负） */
export function clockToStandardDelta(actualOffsetMin: number, stdOffsetMin: number): number {
  return stdOffsetMin - actualOffsetMin;
}

/** 钟表giờ间Bình移 deltaMin 分钟；giờ / 分没填、Bất是整数、或Bình移后跨ngày，给 null */
export function shiftClock(t: ClockTime, deltaMin: number): ClockTime | null {
  if (t.clockHour === '' || t.clockMinute === '') return null;
  const h = Number(t.clockHour); const m = Number(t.clockMinute);
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  if (!Number.isInteger(deltaMin) || deltaMin === 0) return null;
  const total = h * 60 + m + deltaMin;
  if (total < 0 || total >= 24 * 60) return null;
  return { clockHour: String(Math.floor(total / 60)), clockMinute: String(total % 60) };
}

/** 「HH:MM」两位补零 */
export function formatClock(t: ClockTime): string {
  return `${t.clockHour.padStart(2, '0')}:${t.clockMinute.padStart(2, '0')}`;
}
