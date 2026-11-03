/**
 * 节气Tứ Trụ 立春/节气边界精确到giờ刻 — 回归测试
 *
 * 背景（2026-09-01）：会员反馈「紫薇Lập lá số里给我排的Tứ TrụBất准…Niên Trụ为QuýMùi…立春是19点…我Bất是GiápThânnăm」。
 * 查证：Âm lịch2004正thángThậpTứ=Dương lịch2004-02-04，立春2004=当Thiên19:56，会员凌晨2:40（Sửugiờ）出生在立春前，
 * Bát字Niên Trụ应为QuýMùi（连带Nguyệt TrụẤtSửu），Lập lá số却给GiápThân/BínhDần。
 * 根因：节气Tứ Trụ原用 lunar-javascript 的 getYearGanByLiChun()/getMonthGan()，是「按立春当Thiên整Thiên」切换、
 * Bất看giờ刻（实测即使传入giờ间也无效），立春当Thiên凌晨出生的被算进新năm。
 * 修复：改用 getEightChar()（精确到立春/节的giờ刻），giờ刻用giờThìn中点(index*2)近似。
 *
 * 本测试锁住：①会员案例修对 ②非节气ngàyBất被误伤 ③立春当Thiên「前/后」正确分档。
 */
import assert from 'node:assert/strict';
import { generateChart } from '../../lib/ziwei/algorithm';

let passed = 0;
const ok = (name: string, cond: boolean) => { assert.ok(cond, `❌ ${name}`); console.log(`  ✅ ${name}`); passed++; };
const sizhu = (y: number, mo: number, d: number, h: number) =>
  (generateChart({ year: y, month: mo, day: d, hour: h, gender: 'male' } as any) as any).lunarInfo;

// ① 会员案例：2004-02-04 Sửugiờ(立春19:56前) → 节气Niên TrụQuýMùi、Nguyệt TrụẤtSửu
const m = sizhu(2004, 2, 4, 1);
ok('会员案例 节气Tứ TrụNiên Trụ=QuýMùi（立春前，Bất是GiápThân）', m.fourPillars?.[0] === 'QuýMùi');
ok('会员案例 节气Tứ TrụNguyệt Trụ=ẤtSửu（连带修正，Bất是BínhDần）', m.fourPillars?.[1] === 'ẤtSửu');
ok('会员案例 非节气Tứ TrụNiên Trụ=GiápThân（Âm lịch正tháng初Nhất口径，保持Bất变）', m.fourPillarsLunar?.[0] === 'GiápThân');

// ② 立春前NhấtThiên/后NhấtThiên：边界两侧正确
ok('2004-02-03 Sửugiờ（立春前NhấtThiên）节气Niên Trụ=QuýMùi', sizhu(2004, 2, 3, 1).fourPillars?.[0] === 'QuýMùi');
ok('2004-02-05 Sửugiờ（立春后NhấtThiên）节气Niên Trụ=GiápThân', sizhu(2004, 2, 5, 1).fourPillars?.[0] === 'GiápThân');

// ③ 立春当Thiên「giờ刻前 vs giờ刻后」正确分档（同NhấtThiênBất同giờThìn）
//    立春=19:56（Tuấtgiờ19-21）。Sửugiờ(idx1=02点)在前→QuýMùi；Hợigiờ(idx11=22点)在后→GiápThân。
ok('2004-02-04 Sửugiờ(立春前) → QuýMùi', sizhu(2004, 2, 4, 1).fourPillars?.[0] === 'QuýMùi');
ok('2004-02-04 Hợigiờ(立春后) → GiápThân', sizhu(2004, 2, 4, 11).fourPillars?.[0] === 'GiápThân');

// ④ 非节气ngàyBất被误伤（固定期望值，防回归giờ被动）
const c = sizhu(1990, 6, 15, 6);
ok('非节气ngày 1990-06-15 Ngọgiờ 节气Tứ Trụ稳定=CanhNgọ/NhâmNgọ/TânHợi/GiápNgọ',
   JSON.stringify(c.fourPillars) === JSON.stringify(['CanhNgọ', 'NhâmNgọ', 'TânHợi', 'GiápNgọ']));

// ⑤ Nhật Trụ、Thời TrụBất受立春影响（会员案例Nhật TrụQuýSửu、Thời TrụQuýSửu）
ok('Nhật TrụBất受立春边界影响（会员案例=QuýSửu）', m.fourPillars?.[2] === 'QuýSửu');
ok('Thời TrụBất受立春边界影响（会员案例Sửugiờ=QuýSửu）', m.fourPillars?.[3] === 'QuýSửu');

console.log(`\n[sizhu-lichun-boundary] ${passed} 项断言Tất cả通过`);
