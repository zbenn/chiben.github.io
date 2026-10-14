# Ben Chi · 个人学术主页

英文简约学术主页，已加入姓名、浙江大学、公开邮箱、手绘头像和 6 条 Google Scholar 论文记录。桌面和手机自适应，页面无需 JavaScript，也没有第三方字体、追踪脚本或运行时依赖。

## 本地预览

使用 Node.js 22 或更新版本，在此目录运行：

```powershell
npm run build
npm run preview
```

浏览器打开 http://127.0.0.1:4173 。修改后重新运行 `npm run build`，刷新浏览器。也可以直接双击构建生成的 `dist/index.html`。按 Ctrl+C 关闭预览服务。

## 日常更新：只改一个内容文件

编辑 `content/profile.json`，无需修改 HTML：

| 字段 | 用途 |
| --- | --- |
| `name` / `nameChinese` | 中英文姓名 |
| `affiliation` / `affiliationUrl` | 单位与链接 |
| `email` | 公开邮箱 |
| `bio` | 简介，每个字符串为一段 |
| `research` | 研究方向标题与简短说明 |
| `publications` | 论文列表，按年份自动降序排列 |
| `news` | 动态；空数组时整个栏目自动隐藏 |
| `githubUrl` | 留空时隐藏 GitHub 链接（当前设置） |
| `cvUrl` | 留空时隐藏 CV；如需启用，将简历放进 `assets/cv.pdf` 并填入该路径 |

JSON 使用英文双引号，不支持注释或最后一项后的多余逗号。页面会自动转义文本，请直接填写文字，不要写 HTML。

添加论文时复制一项，例如（以下是格式示例，不是真实论文）：

```json
{
  "title": "Your paper title",
  "authors": "B. Chi, A. Author",
  "venue": "Journal name",
  "details": "Volume, pages or article number",
  "year": 2026,
  "url": "https://doi.org/your-doi"
}
```

可选字段 `pdf` 和 `code` 会自动生成相应链接。未知年份填写 `null`，页面显示短横线并将该项排在末尾。`B. Chi` 和 `Ben Chi` 会自动加粗。论文按年份排序，同一年保留文件内的顺序。

添加动态的示例：

```json
"news": [{"date": "2026-10", "text": "Your update here."}]
```

替换头像只需覆盖 `assets/photo.png`；如使用其他文件名，同时修改 `photo`。颜色、字号、间距在 `assets/style.css` 中，布局在 `scripts/build.mjs` 中。

## 部署到 GitHub Pages

部署仓库为 `zbenn/chiben.github.io`，对应项目主页 `https://zbenn.github.io/chiben.github.io/`。仓库名称与账号名不同，因此使用项目主页路径。

1. 在 GitHub 新建空仓库 `chiben.github.io`（已有仓库时先检查和备份原内容）。GitHub Free 通常使用公开仓库托管 Pages。
2. 将本项目源码放入仓库根目录，确保包含 `.github/workflows/pages.yml`、`assets/`、`content/`、`scripts/` 和 `package.json`。不要只上传 `dist/`。
3. 仓库进入 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 推送到 `main` 分支，或在 **Actions → Build and deploy homepage → Run workflow** 手动运行。
5. 工作流成功后，从 **Settings → Pages** 打开网站。后续在 GitHub 网页编辑 `content/profile.json` 并提交，工作流就会自动更新网站。

如果使用 Git 上传到一个新建的空仓库，在此目录执行：

```powershell
git init -b main
git add .
git commit -m "Create academic homepage"
git remote add origin https://github.com/zbenn/chiben.github.io.git
git push -u origin main
```

这组命令仅适用于未初始化的本地目录与新建空仓库；现有仓库应先克隆，再合并本项目文件。

也支持 `https://zbenn.github.io/仓库名/` 形式的项目主页，页面资源使用相对路径，无需更改路径前缀。

GitHub 官方说明：[创建 Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[使用自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 内容来源与待补充信息

- 姓名、中文姓名、单位和邮箱由本人提供，GitHub 链接按要求隐藏。
- 论文资料来源：[Google Scholar](https://scholar.google.com/citations?user=EvDI6w4AAAAJ&hl=en)，读取日期 2026-10-13。
- SSRN 文章未提供年份，保留 `null`，并标为 Working paper。正式发表后请更新。
- 简介第二段与三个研究方向说明是依据论文主题撰写的概括，请按个人研究定位调整。
- 未添加未经确认的职称、学位、导师、教育经历或奖励。可后续补充职位/在读阶段、简历和论文 DOI/代码链接。
- 引用次数变化频繁，不在主页固定展示；通过 Scholar 查看。
- 头像采用工作区提供的原图，未修改。
- 参考 [Jon Barron](https://jonbarron.info/) 的简介和论文组织方式，以及 [Andrej Karpathy](https://karpathy.ai/) 的简洁信息层级；本站布局与代码为独立实现。

## 文件结构

```text
content/profile.json          日常内容维护入口
assets/photo.png              头像
assets/style.css              响应式与打印样式
assets/favicon.svg            网站图标
scripts/build.mjs             无第三方依赖的静态生成器
scripts/serve.mjs             本地预览服务
.github/workflows/pages.yml   GitHub 自动部署
dist/                         生成的网站（不提交 Git）
```
