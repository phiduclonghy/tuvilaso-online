/**
 * Cổ thư原典查询库 — 类型定义
 *
 * 设计：所有Cổ thư以 JSON 静态数据打包到代码（公版无版Quyền风险）
 * Next.js 启动giờNhất次性加载到内存，零 DB 依赖
 */

export interface Paragraph {
  /** 段落唯Nhất id（用于锚点跳转） */
  id: string;
  /** 段落序号（章节内） */
  idx: number;
  /** 段落原文（古文） */
  text: string;
  /** 现代翻译（可选，Mùi来填充） */
  translation?: string;
  /** 倪师注解（可选，标注来源） */
  niNote?: string;
}

export interface Chapter {
  /** 章节标题（如"卷Nhất"、"总论篇"）*/
  title: string;
  /** 章节副标题/简介（可选）*/
  subtitle?: string;
  paragraphs: Paragraph[];
}

export interface Book {
  /** 书名 */
  title: string;
  /** 书 slug（URL 用，如 'guisuifu'）*/
  slug: string;
  /** 朝代 */
  dynasty: string;
  /** 作者（多人或Bất详giờ填"Bất详"或多人）*/
  author: string;
  /** 简介 */
  intro: string;
  /** 总字数（粗略）*/
  wordCount: number;
  chapters: Chapter[];
}

export interface SearchHit {
  bookSlug: string;
  bookTitle: string;
  chapterTitle: string;
  paragraphId: string;
  /** 高亮片段（含 <mark> 标签） */
  snippet: string;
  /** 原文 */
  text: string;
}
