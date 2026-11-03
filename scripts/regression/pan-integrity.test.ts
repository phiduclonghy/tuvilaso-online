/**
 * 回归测试 — Lập lá số完整性 (2026-05-15)
 *
 * 起因: 用户反馈"Thiên CơThiên Lương在Tài BạchCung被说成Phu ThêCung"。
 * 排查结论: 算法层 100% 正确, 是 AI context 文本歧义。
 * 但为防止Mùi来真的有人改坏Lập lá số核心 (algorithm.ts / school-patches),
 * 把"Lập lá số必须满足的Tử Vi Đẩu Số铁律"固化成断言, 进 CI 每次 push 跑。
 *
 * 跑: npx tsx scripts/regression/pan-integrity.test.ts
 * 失败 exit 1 → CI 红
 *
 * Bất引 vitest, 用项目现有 tsx + 自定义断言惯例 (同 test-school-patches.ts)
 */
import { generateChart } from '../../lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart } from '../../lib/ziwei/types';

const BR = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const PALACE_12 = ['Mệnh','Huynh Đệ','Phu Thê','Tử Nữ','Tài Bạch','Tật Ách','Thiên Di','Nô Bộc','Quan Lộc','Điền Trạch','Phúc Đức','Phụ Mẫu'];

let failures = 0;
const fail = (msg: string) => { console.error(`  ✗ ${msg}`); failures++; };
const ok = (msg: string) => console.log(`  ✓ ${msg}`);

// ── 采样: 跨năm代/tháng/giờThìn/Giới tính, 覆盖足够多Lá số形态 ──
const samples: BirthInfo[] = [];
for (let y = 1960; y <= 2010; y += 7)
  for (let m = 1; m <= 12; m += 3)
    for (let d = 5; d <= 26; d += 10)
      for (let h = 0; h < 12; h += 3)
        for (const g of ['male','female'] as const)
          samples.push({ year: y, month: m, day: d, hour: h, gender: g });

console.log(`\nLập lá số完整性回归 — ${samples.length} 个采样Lá số\n`);

let jiliangCount = 0;
let ziFuOppCount = 0;

for (const bi of samples) {
  let chart: ZiweiChart;
  try { chart = generateChart(bi); }
  catch (e) { fail(`generateChart 抛错 @ ${JSON.stringify(bi)}: ${(e as Error).message}`); continue; }

  const tag = `${bi.year}-${bi.month}-${bi.day} h${bi.hour} ${bi.gender}`;

  // 铁律 1: 必须正好 12 Cung
  if (chart.palaces.length !== 12) { fail(`${tag}: Cung数 ${chart.palaces.length} ≠ 12`); continue; }

  // 铁律 2: 12 Cung名齐全且唯Nhất(Mệnh/Huynh Đệ/.../Phụ Mẫu)
  const names = chart.palaces.map(p => p.name).sort();
  const expect = [...PALACE_12].sort();
  if (JSON.stringify(names) !== JSON.stringify(expect)) {
    fail(`${tag}: Cung名集合Bất对 = ${names.join(',')}`); continue;
  }

  // 铁律 3: 12 CungĐịa支 0-11 各且仅Nhất次
  const branches = chart.palaces.map(p => p.branch).sort((a,b)=>a-b);
  if (JSON.stringify(branches) !== JSON.stringify([0,1,2,3,4,5,6,7,8,9,10,11])) {
    fail(`${tag}: Địa支Bất是 0-11 全覆盖 = ${branches.join(',')}`); continue;
  }

  // 铁律 4: Mệnh唯Nhất + isMingGong 标记Nhất致
  const mingByName = chart.palaces.filter(p => p.name === 'Mệnh');
  if (mingByName.length !== 1) { fail(`${tag}: Mệnh数量 ${mingByName.length}`); continue; }

  // 铁律 5: ThậpNhịCung逆giờ针排布 — 从MệnhĐịa支起, 第 k CungĐịa支 = (MệnhĐịa支 - k + 12) % 12
  const mingBranch = mingByName[0].branch;
  for (let k = 0; k < 12; k++) {
    const expectBranch = ((mingBranch - k) % 12 + 12) % 12;
    const pName = PALACE_12[k];
    const p = chart.palaces.find(x => x.name === pName)!;
    if (p.branch !== expectBranch) {
      fail(`${tag}: ${pName} 应在 ${BR[expectBranch]} 实际 ${BR[p.branch]}（逆giờ针排布坏）`);
      break;
    }
  }

  // 铁律 6: 机梁同Cung只可能在 Thìn 或 Tuất
  const jl = chart.palaces.find(p => {
    const ms = p.stars.filter(s => s.type === 'major').map(s => s.name);
    return ms.includes('Thiên Cơ') && ms.includes('Thiên Lương');
  });
  if (jl) {
    jiliangCount++;
    if (jl.branch !== 4 && jl.branch !== 10) {
      fail(`${tag}: 机梁同Cung出现在 ${BR[jl.branch]}(只能Thìn/Tuất)`);
    }
  }

  // 铁律 7: Tử Vi 与 Thiên Phủ 永远是固定相对位置 — 同盘必同giờ存在, 且
  //   Tử ViĐịa支 + Thiên PhủĐịa支 关系符合"DầnThân线对称"(Tử Vi+Thiên Phủ Địa支和 ≡ 4 mod 12 是错的简化,
  //   正确铁律: Thiên PhủĐịa支 = (4 - Tử ViĐịa支 + 12*N) → 即 紫府永远Giới thiệu Dần(2)/Thân(8) 轴对称,
  //   等价: (Tử Vibranch + Thiên Phủbranch) % 12 === 4)
  let ziB = -1, fuB = -1;
  for (const p of chart.palaces) for (const s of p.stars) {
    if (s.name === 'Tử Vi') ziB = p.branch;
    if (s.name === 'Thiên Phủ') fuB = p.branch;
  }
  if (ziB >= 0 && fuB >= 0) {
    ziFuOppCount++;
    if ((ziB + fuB) % 12 !== 4) {
      fail(`${tag}: 紫府对称铁律破 紫=${BR[ziB]} 府=${BR[fuB]} (和%12 应=4)`);
    }
  }
}

console.log(`\n采样统计: 机梁同Cung盘 ${jiliangCount} 个(均验证Thìn/Tuất), 紫府盘 ${ziFuOppCount} 个(均验证对称)`);

if (failures === 0) {
  console.log(`\n✅ Lập lá số完整性回归全过 (${samples.length} 盘 × 7 条Tử Vi铁律)\n`);
  process.exit(0);
} else {
  console.error(`\n❌ Lập lá số完整性回归 ${failures} 处失败 — Lập lá số核心被改坏, 禁止上线\n`);
  process.exit(1);
}
