/**
 * Cách Cục加分项里的「化Lộc / 化Quyền / 化Khoa」要按Tinh Diệu的 siHua 字段判，Bất是按Sao名。
 *
 * Tứ Hóa挂在 Star.siHua 上（如 { name: 'Thiên Cơ', siHua: 'Khoa' }），盘上没有叫「化Khoa」的Sao。
 * 早先府相朝垣「Mệnh见Lộc」、Dương梁昌Lộc / 机tháng同梁「再会化Khoa」、杀破狼「Tam Phương有化Lộc或化Quyền」
 * 用 hasStar / sanFangAllStars 查「化X」Sao名，永远查Bất到，这几条加分项从来Bất会出现。
 *
 * patterns.ts 带 `server-only`（仓库里没装这个包，Next 构建giờ才有），这里先把它解析成空模块再 import。
 */
import assert from 'node:assert/strict';
import * as nodeModule from 'node:module';
import { generateChart } from '../../lib/ziwei/algorithm';
import type { ZiweiChart, SiHua } from '../../lib/ziwei/types';

// module.registerHooks：Node 22.15+ / 23.5+；@types/node 20 还没有它的声明，这里自带最小类型
type HookResult = { url?: string; format?: string; source?: string; shortCircuit?: boolean };
const { registerHooks } = nodeModule as unknown as {
  registerHooks(hooks: {
    resolve(specifier: string, context: unknown, next: (s: string, c: unknown) => HookResult): HookResult;
    load(url: string, context: unknown, next: (u: string, c: unknown) => HookResult): HookResult;
  }): void;
};
const SERVER_ONLY_STUB = 'data:text/javascript,';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: SERVER_ONLY_STUB, shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === SERVER_ONLY_STUB) return { format: 'commonjs', source: '', shortCircuit: true };
    return nextLoad(url, context);
  },
});

function sanFangHasSiHua(chart: ZiweiChart, hua: SiHua): boolean {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12];
  return chart.palaces.some(p => branches.includes(p.branch) && p.stars.some(s => s.siHua === hua));
}

async function main() {
const { detectPatterns } = await import('../../lib/ziwei/patterns');

// 盘上Bất存在名为「化X」的Sao
const sample = generateChart({ year: 1988, month: 10, day: 8, hour: 7, gender: 'male' });
assert.ok(sample.palaces.every(p => p.stars.every(s => !/^化[LộcQuyềnKhoaKỵ]$/.test(s.name))), 'Sao名里出现了「化X」');

// 逐ngày扫Nhấtnăm、固定Ngọgiờ，统计每个加分项「该出现」与「实际出现」的盘数
const checks: { pattern: string; bonus: string; expect: (c: ZiweiChart) => boolean }[] = [
  {
    pattern: '府相朝垣', bonus: 'Mệnh见Lộc',
    expect: c => c.palaces.some(p => p.branch === c.mingGongBranch && p.stars.some(s => s.name === 'Lộc Tồn' || s.siHua === 'Lộc')),
  },
  { pattern: '杀破狼', bonus: 'Tam Phương有化Lộc或化Quyền（动Đắc有力）', expect: c => sanFangHasSiHua(c, 'Lộc') || sanFangHasSiHua(c, 'Quyền') },
  { pattern: '机tháng同梁', bonus: '再会化Khoa', expect: c => sanFangHasSiHua(c, 'Khoa') },
  { pattern: 'Dương梁昌Lộc', bonus: '再会化Khoa', expect: c => sanFangHasSiHua(c, 'Khoa') },
];
const hits = new Map<string, number>();
const start = Date.UTC(1990, 0, 1);
for (let d = 0; d < 366; d++) {
  const dt = new Date(start + d * 86_400_000);
  const chart = generateChart({
    year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate(), hour: 6, gender: 'male',
  });
  const found = detectPatterns(chart);
  for (const { pattern, bonus, expect } of checks) {
    const p = found.find(x => x.name === pattern);
    if (!p) continue;
    const want = expect(chart);
    const got = p.conditions?.bonus?.includes(bonus) ?? false;
    assert.equal(got, want, `${dt.toISOString().slice(0, 10)} Ngọgiờ ${pattern}「${bonus}」应为 ${want}`);
    if (got) hits.set(pattern, (hits.get(pattern) ?? 0) + 1);
  }
}
for (const { pattern } of checks) {
  assert.ok((hits.get(pattern) ?? 0) > 0, `${pattern} 的Tứ Hóa加分项Nhất次都没触发，样本覆盖Bất到或判断仍按Sao名`);
}

console.log(`✓ Cách CụcTứ Hóa加分项按 siHua 判定（触发盘数：${[...hits].map(([k, v]) => `${k} ${v}`).join('、')}）`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
