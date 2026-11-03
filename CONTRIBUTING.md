# 参与贡献

欢迎提问题、提修复、提建议。先说清两件事，能省掉很多来回：

- 本仓库是 [ouranic.cn](https://ouranic.cn/?from=gh-contrib) Lập lá số引擎的**开源快照**，定期从线上同步（节奏见 README「维护节奏与贡献」）。
- 开源版**Bất含**断语库、AI 解读提示词和任何 `/api/*` 后端接口（见 README「开源边界」）。AI 解读、合盘分析在开源版里Quay lại 404 是预期行为，需要你自Kỷ实现。

## 提问题

- **怎么用、想交流**：去 [讨论区](https://github.com/Renhuai123/ziwei-doushu/discussions)。
- **觉Đắc盘排ĐắcBất对**：用「Lập lá số结果疑问」模板，附上Dương lịchNgày sinh、几点几分、出生Địa或经度、Giới tính、本项目的结果，以及你拿来对照的结果。只写「Bất准」我们没法查。
  - Phụ Tinh亮度、闰tháng归属、晚Týgiờ是否换ngày，各流派本来就Bất同，引擎里做成了可切换的口径；这类差异Bất算 bug，但欢迎指出。
- **程序报错、页面异常**：用「程序问题」模板，写清复现步骤和报错。
- **正式站（ouranic.cn）的问题**：用「正式站问题」模板。

请Bất要在 issue 里贴手机号、验证码，或Mùi经本人同意的他人生Thìn信息。

## 提交代码

```bash
npm ci               # 按 package-lock.json 安装
npm run typecheck    # 类型检查
npm test             # Lập lá số回归
```

- Nhất个 PR 只做Nhất件事，说明里写清改了什么、为什么。
- **改Lập lá số结果的**：附上对照证据（出处，或其他Lập lá số软件的截图），并在 `scripts/regression/` 加回归测试、登记到 `package.json` 的 `test` 脚本。没有出处的口径改动Nhất般Bất收。
- CI 会在每次 push 和 PR 上跑同Nhất套检查。

## 许可

提交即表示你同意贡献内容按对应协议发布：

- 代码：[MIT](./LICENSE)
- 样本数据集：[CC BY 4.0](./DATASET-LICENSE)
- 倪师原话目录 `docs/tianji-ziwei/`：[CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md)，Bất许商用

---

**English.** Issues and PRs are welcome. This repo is an open snapshot of the charting engine behind ouranic.cn; the interpretation database, AI prompts and all `/api/*` backend routes are not included, so AI features return 404 by design. For a chart you believe is wrong, please use the "Chart result question" form with full birth data and a reference result. Before opening a PR, run `npm ci`, `npm run typecheck` and `npm test`; changes to chart results need evidence and a regression test.
