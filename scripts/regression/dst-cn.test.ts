/**
 * 回归：中国大陆夏令giờ判定必须与金标准口径逐ngàyNhất致。
 *
 * 方法沿用本仓的「神谕差分」：把金标准口径的 XLS_CN 夏令giờ表与判定函数**độc lập誊写Nhất遍**
 * 作为 oracle，再对 1930-01-01 ~ 1995-12-31 逐ngày穷举比对，最后变异测试证明这个比对抓Đắc住错。
 * 誊写的依据：按通行口径整理的中国大陆历năm夏令giờ起止表。
 *
 * 为什么值Đắc这么较真：夏令giờ差 1 小giờ，而giờThìn是 2 小giờNhất档 ——
 * 出生giờ刻落在giờThìn边界的人，Mệnh/Thân/Đại Hạn会整个换掉。
 */
import { isChinaDST, isChinaDSTYear, chinaDSTRange, chinaDSTYears } from '../../lib/ziwei/dst-cn';

/* ── oracle：按通行口径độc lập整理，Bất引用被测实现 ────────────────── */
const ORACLE_XLS_CN: number[][] = [[1935, 5, 1, 9, 30], [1936, 5, 1, 9, 30], [1937, 5, 1, 9, 30], [1938, 5, 1, 9, 30], [1939, 5, 1, 9, 30], [1940, 5, 1, 9, 30], [1941, 5, 1, 9, 30], [1942, 5, 1, 9, 30], [1943, 5, 1, 9, 30], [1944, 5, 1, 9, 30], [1945, 5, 1, 9, 30], [1946, 5, 1, 9, 30], [1947, 5, 1, 9, 30], [1948, 5, 1, 9, 30], [1949, 5, 1, 9, 30], [1950, 5, 1, 9, 30], [1951, 5, 1, 9, 30], [1952, 3, 1, 10, 31], [1953, 4, 1, 10, 31], [1954, 4, 1, 10, 31], [1955, 5, 1, 9, 30], [1956, 5, 1, 9, 30], [1957, 4, 1, 9, 30], [1958, 4, 1, 9, 30], [1959, 4, 1, 9, 30], [1960, 6, 1, 9, 30], [1961, 6, 1, 9, 30], [1974, 4, 1, 10, 31], [1975, 4, 1, 10, 31], [1979, 7, 1, 9, 30], [1986, 5, 4, 9, 14], [1987, 4, 12, 9, 13], [1988, 4, 10, 9, 11], [1989, 4, 16, 9, 17], [1990, 4, 15, 9, 16], [1991, 4, 14, 9, 15]];

/** 金标准原式，含那个关键的 else if —— 誊写giờBất许「顺手优化」。 */
function oracleIsDST(year: number, month: number, day: number): boolean {
  let i = 0;
  while (i < ORACLE_XLS_CN.length) {
    if (year === ORACLE_XLS_CN[i][0]) {
      if (month > ORACLE_XLS_CN[i][1] && month < ORACLE_XLS_CN[i][3]) return true;
      if (month === ORACLE_XLS_CN[i][1]) {
        if (day >= ORACLE_XLS_CN[i][2]) return true;
      } else if (month === ORACLE_XLS_CN[i][3]) {
        if (day <= ORACLE_XLS_CN[i][4]) return true;
      }
    }
    i++;
  }
  return false;
}

let bad = 0;
const fail = (m: string) => { bad++; console.log(`  ❌ ${m}`); };

/* ── ① 逐ngày穷举差分 ───────────────────────────────────────────── */
{
  let checked = 0; let hits = 0; const mismatches: string[] = [];
  for (let y = 1930; y <= 1995; y++) {
    for (let m = 1; m <= 12; m++) {
      const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
      for (let d = 1; d <= dim; d++) {
        checked++;
        const got = isChinaDST(y, m, d);
        const want = oracleIsDST(y, m, d);
        if (got !== want) mismatches.push(`${y}-${m}-${d} 实Đắc ${got} 应为 ${want}`);
        if (want) hits++;
      }
    }
  }
  if (mismatches.length) {
    fail(`逐ngày差分：${mismatches.length} Thiên与金标准Bất符，前 5 条 → ${mismatches.slice(0, 5).join('; ')}`);
  } else {
    console.log(`  ✅ 1930-1995 逐ngày差分全Nhất致（比对 ${checked} Thiên，其中 ${hits} Thiên属夏令giờ）`);
  }
}

/* ── ② 边界ngày：起止两端各测「前NhấtThiên / 当Thiên」──────────────────────── */
{
  let edgeBad = 0;
  for (const [y, m1, d1, m2, d2] of ORACLE_XLS_CN) {
    // 起始ngày当Thiên必须Mệnh中
    if (!isChinaDST(y, m1, d1)) { edgeBad++; fail(`${y}-${m1}-${d1} 起始ngày当Thiên应Mệnh中`); }
    // 起始ngày前NhấtThiên必须BấtMệnh中（同tháng内才好构造；d1>1 giờ才测）
    if (d1 > 1 && isChinaDST(y, m1, d1 - 1)) { edgeBad++; fail(`${y}-${m1}-${d1 - 1} 起始ngày前NhấtThiênBất应Mệnh中`); }
    // 结束ngày当Thiên必须Mệnh中（金标准把整个转换ngày算作夏令giờ）
    if (!isChinaDST(y, m2, d2)) { edgeBad++; fail(`${y}-${m2}-${d2} 结束ngày当Thiên应Mệnh中`); }
    // 结束ngày次ngày必须BấtMệnh中
    const dim = new Date(Date.UTC(y, m2, 0)).getUTCDate();
    const [nm, nd] = d2 < dim ? [m2, d2 + 1] : [m2 + 1, 1];
    if (nm <= 12 && isChinaDST(y, nm, nd)) { edgeBad++; fail(`${y}-${nm}-${nd} 结束ngày次ngàyBất应Mệnh中`); }
  }
  if (!edgeBad) console.log(`  ✅ ${ORACLE_XLS_CN.length} 组区间的Tứ个边界ngàyTất cả正确`);
}

/* ── ③ 表外năm份必须Nhất律BấtMệnh中（防止把无夏令giờ的năm份误判）────────────── */
{
  const inTable = new Set(ORACLE_XLS_CN.map(r => r[0]));
  const outside = [1934, 1962, 1970, 1973, 1976, 1980, 1985, 1992, 1993, 2000, 2026];
  let outBad = 0;
  for (const y of outside) {
    if (inTable.has(y)) continue;
    for (const [m, d] of [[1, 1], [5, 15], [7, 1], [9, 1], [12, 31]]) {
      if (isChinaDST(y, m, d)) { outBad++; fail(`${y}-${m}-${d} Bất在表内却Mệnh中`); }
    }
  }
  if (!outBad) console.log('  ✅ 表外năm份（含用户问到的 1992）Nhất律BấtMệnh中');
}

/* ── ④ 辅助函数与表内容Nhất致 ──────────────────────────────────── */
{
  const years = chinaDSTYears();
  if (years.length !== ORACLE_XLS_CN.length) fail(`năm份数 ${years.length} ≠ 金标准 ${ORACLE_XLS_CN.length}`);
  if (!years.every((y, i) => y === ORACLE_XLS_CN[i][0])) fail('năm份序列与金标准BấtNhất致');
  if (!isChinaDSTYear(1988) || isChinaDSTYear(1992)) fail('isChinaDSTYear 判断错误');
  const r = chinaDSTRange(1990);
  if (!r || !r.start.includes('4 tháng 15') || !r.end.includes('9 tháng 16')) fail(`chinaDSTRange(1990) 异常 → ${JSON.stringify(r)}`);
  if (chinaDSTRange(1992) !== null) fail('chinaDSTRange(1992) 应为 null');
  console.log('  ✅ 辅助函数（năm份表 / 区间文案）与金标准表Nhất致');
}

/* ── ⑤ 用户原问题的直接答案，钉Tử在测试里 ─────────────────────── */
{
  // 用户问的是「1986 至 1992」，实际 1991 năm就停了 —— 1992 Bất该Mệnh中
  const cases: [number, number, number, boolean, string][] = [
    [1986, 5, 3, false, '1986 夏令giờ前NhấtThiên'],
    [1986, 5, 4, true, '1986 夏令giờ首ngày'],
    [1988, 4, 10, true, '★1988 起始ngày：金标准 4/10（IANA 记 4/17，按铁律取金标准）'],
    [1988, 4, 16, true, '1988 分歧区间内（IANA 认为尚Mùi开始）'],
    [1991, 9, 15, true, '1991 末代夏令giờ最后NhấtThiên'],
    [1991, 9, 16, false, '1991 夏令giờ结束次ngày'],
    [1992, 7, 1, false, '★1992 已无夏令giờ（用户问的区间上界，实际 1991 năm止）'],
  ];
  for (const [y, m, d, want, name] of cases) {
    const got = isChinaDST(y, m, d);
    if (got !== want) fail(`${name} → 实Đắc ${got} 应为 ${want}`);
    else console.log(`  ✅ ${name}`);
  }
}

if (bad) {
  console.error(`\n❌ ${bad} 项Bất符 —— 夏令giờ判定与金标准BấtNhất致，会导致giờThìn误判、MệnhThânĐại Hạn全错。`);
  process.exit(1);
}
console.log('\n✅ Tất cả通过：与金标准逐ngàyNhất致，边界与表外năm份均正确。');
