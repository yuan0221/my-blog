# My Blog

简要说明与快速上手（核心要点）

**项目简介**
- 这是一个基于 Umi + TypeScript 的博客示例工程，使用 Prisma + PostgreSQL 做数据层，TailwindCSS 负责样式。

**核心技术栈**
- 前端/框架：`Umi` + `React` + `TypeScript`
- 样式：`Tailwind CSS`
- 数据库：`PostgreSQL`，通过 `Prisma` 建模与客户端访问（生成目录：`generated/prisma`）
- 验证/会话：`jsonwebtoken`（JWT），工具位于 `src/utils/jwt.ts`
- 其他：`bcryptjs`（密码哈希）、`@upstash/redis`（可选依赖）、部署配置支持 Vercel（`vercel.json`）

**目录要点**
- `src/pages`：前端页面入口（如首页、帖子页）
- `src/api`：TypeScript 编写的后端 API 路由，用于 Umi 项目内的接口实现（如 `src/api/login.ts`）
- `api/`：工程根目录下的 JS API 文件夹（可能用于直接部署为无服务器函数）
- `src/components`：可重用 UI 组件
- `prisma/`：Prisma schema 与 migrations（`prisma/schema.prisma`、`prisma/migrations`）
- `generated/prisma`：Prisma Client 的生成输出（项目代码以此访问 DB）

**运行与开发（快速）**
1. 安装依赖：

```bash
pnpm install
```

2. 配置环境变量（至少）：
- `DATABASE_URL`：Postgres 连接串
- `JWT_SECRET`：JWT 签名密钥
- 视情况还需 Redis/Upstash 相关配置

3. 本地开发：

```bash
pnpm dev
```

4. Prisma 相关（初始化 / 迁移 / 生成）：

```bash
npx prisma migrate dev --name init --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
```

5. 构建与部署：
- 使用 `pnpm build`（内部为 `umi build`）生成生产包，部署可参考 `vercel.json`。

**注意事项与实现细节**
- 项目使用 `@prisma/adapter-pg` 与自定义 `PrismaClient` 实例（见 `src/api/login.ts`），生成客户端输出在 `generated/prisma`，确保在变更 `schema.prisma` 后运行 `prisma generate`。
- 身份验证：登录接口在 `src/api/login.ts`，使用 `bcryptjs` 校验密码并通过 `signToken` 返回 JWT（并设置 cookie）。
- 前后端相对轻量：前端通过 `/api/posts` 等接口拉取数据，后端采用 Umi 的 API 约定封装路由。

**调试建议**
- 首次运行前确保 `DATABASE_URL` 可用并已创建数据库；若使用本地 Postgres，建议先运行迁移。
- 若部署到 Vercel，确保把必要的环境变量添加到 Vercel 项目配置中。

----
简洁版：聚焦在 `Umi + Prisma + Postgres + Tailwind` 的全栈小应用；主要关注点是数据模型（`prisma/schema.prisma`）、生成后的 Prisma 客户端（`generated/prisma`）、以及 JWT + cookie 的认证流。
