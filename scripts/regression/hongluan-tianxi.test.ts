/** Regression coverage for Hongluan/Tianxi placement and palace labels. */
import assert from 'node:assert/strict';
import { generateChart } from '../../lib/ziwei/algorithm';
import { BRANCHES, STEMS } from '../../lib/ziwei/constants';

function placementsFor(year: number, month = 5, day = 15) {
  const chart = generateChart({ year, month, day, hour: 11, gender: 'male', longitude: 120 });
  return chart.palaces.flatMap((palace) =>
    palace.stars
      .filter((star) => star.name === 'Hồng Loan' || star.name === 'Thiên Hỷ')
      .map((star) => ({
        name: star.name,
        branch: BRANCHES[palace.branch],
        palaceLabel: `${STEMS[palace.stem]}${BRANCHES[palace.branch]}`,
      })),
  );
}

const placements = placementsFor(1974, 1, 28);

assert.deepEqual(
  placements.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
  [
    { name: 'Thiên Hỷ', branch: 'Mùi', palaceLabel: 'TânMùi' },
    { name: 'Hồng Loan', branch: 'Sửu', palaceLabel: 'ĐinhSửu' },
  ].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
  'GiápDầnnăm应按Mão起Týnăm逆数Đắc到Hồng LoanSửu、Thiên HỷMùi；ĐinhSửu/TânMùi是所在Cung完整干支',
);

const representativeYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2016, 2017, 2018, 2019];
for (let yearBranch = 0; yearBranch < 12; yearBranch += 1) {
  const year = representativeYears[yearBranch];
  const yearPlacements = placementsFor(year);
  const hongluan = yearPlacements.filter((item) => item.name === 'Hồng Loan');
  const tianxi = yearPlacements.filter((item) => item.name === 'Thiên Hỷ');
  const expectedHongluan = (3 - yearBranch + 12) % 12;
  const expectedTianxi = (expectedHongluan + 6) % 12;

  assert.equal(hongluan.length, 1, `${BRANCHES[yearBranch]}năm应且仅应有Nhất颗Hồng Loan`);
  assert.equal(tianxi.length, 1, `${BRANCHES[yearBranch]}năm应且仅应有Nhất颗Thiên Hỷ`);
  assert.equal(hongluan[0].branch, BRANCHES[expectedHongluan], `${BRANCHES[yearBranch]}nămHồng LoanCung Vị错误`);
  assert.equal(tianxi[0].branch, BRANCHES[expectedTianxi], `${BRANCHES[yearBranch]}nămThiên HỷCung Vị错误`);
  assert.equal(
    (BRANCHES.indexOf(tianxi[0].branch) - BRANCHES.indexOf(hongluan[0].branch) + 12) % 12,
    6,
    `${BRANCHES[yearBranch]}nămHồng Loan与Thiên Hỷ必须互为Đối Cung`,
  );
}

console.log('✓ GiápDần案例与ThậpNhịnăm支Hồng LoanThiên Hỷ映射、唯Nhất性及Đối Cung关系回归通过');
