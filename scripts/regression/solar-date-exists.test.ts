import assert from 'node:assert/strict';
import { generateChart } from '../../lib/ziwei/algorithm';
import type { BirthInfo } from '../../lib/ziwei/types';

const base: BirthInfo = { year: 1925, month: 3, day: 1, hour: 6, gender: 'male' };

// Bất存在的Dương lịchngày期要在Lập lá số前拒Tuyệt，Bất能被顺延成下个tháng的盘
for (const [year, month, day] of [
  [1925, 2, 29], // 非闰năm
  [1925, 2, 30],
  [1980, 2, 30], // 闰năm也没有 2 tháng 30 ngày
  [1925, 4, 31],
  [1925, 13, 1],
  [1925, 0, 10],
  [1925, 6, 0],
]) {
  assert.throws(
    () => generateChart({ ...base, year, month, day }),
    RangeError,
    `${year}-${month}-${day} should be rejected`,
  );
}

// 真实存在的边界ngày期照常Lập lá số
for (const [year, month, day] of [
  [1924, 2, 29], // 闰năm
  [1980, 2, 29],
  [1925, 2, 28],
  [1925, 1, 31],
  [1925, 12, 31],
]) {
  const chart = generateChart({ ...base, year, month, day });
  assert.equal(chart.birthInfo.day, day, `${year}-${month}-${day} should be accepted`);
}

console.log('solar date existence regression passed');
