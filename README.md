# 兴趣伙伴组队系统

前后端分离的兴趣组队社区。用户以帖子的形式发布组队需求（活动内容、时间、想找什么样的伙伴），并打上兴趣标签；其他人按关键词或标签检索帖子、进入详情页查看发帖人信息，再通过点赞、收藏表达意向，从而找到志同道合的队友。

## 功能

- **帖子大厅**：关键词检索（标题/内容）、标签筛选（同时满足 / 任一满足）、按创建时间或点赞数排序、分页
- **帖子详情**：帖子内容、标签、点赞数、收藏数、发帖人昵称与头像
- **内容管理**：发布、编辑、删除自己的帖子；我的帖子列表
- **互动**：点赞、取消点赞、收藏、取消收藏；我的收藏列表
- **用户**：注册、登录、退出、个人中心（昵称、头像、简介）；登录态 30 天有效
- **后台管理**：管理员查看、新建、修改、删除用户，用户角色分为 `user` / `admin` / `ban`

## 技术栈

| 层次 | 技术 |
| --- | --- |
| 后端框架 | Java 8、Spring Boot 2.7.2、Spring MVC、Spring AOP、Spring Scheduler |
| 数据访问 | MyBatis-Plus 3.5.2（分页插件、逻辑删除）、MySQL |
| 缓存 / 会话 | Redis + Spring Session（分布式登录态） |
| 检索 | Elasticsearch（帖子检索，含全量 / 增量同步任务） |
| 存储 | 腾讯云 COS 对象存储（头像等文件上传） |
| 工具 | Knife4j 4.4.0（OpenAPI 文档）、EasyExcel、Hutool、FreeMarker 代码生成器 |
| 前端 | React 18、TypeScript、Ant Design 5、Ant Design Pro Components、Umi Max 4 |

## 目录结构

```
兴趣伙伴组队系统/
├── 兴趣伙伴组队系统(后端)/           Spring Boot 服务，端口 8101，接口前缀 /api
│   ├── src/main/java/com/fly/springbootinit/
│   │   ├── controller/               接口层（user / post / post_thumb / post_favour / file）
│   │   ├── service/                  业务层与校验逻辑
│   │   ├── mapper/                   MyBatis-Plus Mapper
│   │   ├── model/                    entity / dto / vo / enums
│   │   ├── aop/                      @AuthCheck 权限切面、请求日志切面
│   │   ├── config/                   MyBatis-Plus、CORS、COS、Json 等配置
│   │   ├── common/                   统一响应结构、错误码、分页请求
│   │   ├── exception/                自定义业务异常与全局异常处理器
│   │   ├── esdao/                    Elasticsearch 数据访问
│   │   ├── job/                      帖子全量 / 增量同步到 ES 的定时任务
│   │   ├── generate/                 FreeMarker 代码生成器
│   │   └── wxmp/                     微信公众号消息处理（模板预留）
│   ├── sql/create_table.sql          建库建表脚本（库名 youxi_dp，4 张表）
│   ├── doc/swagger.png               接口文档截图
│   ├── Dockerfile                    容器化构建脚本
│   └── pom.xml
└── 兴趣伙伴组队系统(前端)/           Ant Design Pro 前端，开发端口 8000
    ├── config/                       路由、代理、OpenAPI 生成配置
    ├── src/pages/                    Post（大厅/详情/编辑/我的/收藏）、User（登录/注册/个人中心）、Admin（用户管理）
    ├── src/services/backend/         由 Swagger 生成的接口调用代码
    └── src/requestConfig.ts          统一请求配置（响应拦截、401 跳登录）
```

## 数据表

| 表名 | 说明 |
| --- | --- |
| `user` | 用户（账号、密码、昵称、头像、简介、角色） |
| `post` | 帖子（标题、内容、标签 JSON 数组、点赞数、收藏数、作者） |
| `post_thumb` | 点赞记录（用户 + 帖子，硬删除） |
| `post_favour` | 收藏记录（用户 + 帖子，硬删除） |

## 环境要求

- JDK 8、Maven 3.6+
- MySQL 5.7+ / 8.0
- Redis 5+
- Node.js 16+（推荐 18）
- Elasticsearch 7.x（可选，仅 `/api/post/search/page/vo` 检索接口使用）

## 快速开始

### 1. 初始化数据库

```bash
mysql -u root -p < "兴趣伙伴组队系统(后端)/sql/create_table.sql"
```

脚本会创建数据库 `youxi_dp` 及上述 4 张表。

### 2. 配置本地参数

数据库、Redis 连接写在 `兴趣伙伴组队系统(后端)/src/main/resources/application.yml`，默认值为 `localhost:3306/youxi_dp`、`root/123456`、`localhost:6379`，按自己的环境修改。

对象存储密钥单独放在 `application-dev.yml`（该文件已被 `.gitignore` 忽略，不会提交）：

```bash
cd "兴趣伙伴组队系统(后端)/src/main/resources"
cp application-dev.yml.example application-dev.yml
# 然后填入自己的腾讯云 SecretId / SecretKey / 存储桶名称
```

不配置 COS 时，除头像上传外的功能都可以正常使用。

### 3. 启动后端

```bash
cd "兴趣伙伴组队系统(后端)"
mvn spring-boot:run
```

- 服务地址：`http://localhost:8101/api`
- 接口文档（Knife4j）：`http://localhost:8101/api/doc.html`

### 4. 创建管理员账号

注册页注册一个普通账号，然后在数据库里改角色：

```sql
UPDATE user SET userRole = 'admin' WHERE userAccount = '你的账号';
```

登录后左侧菜单会出现「管理页」。

### 5. 启动前端

```bash
cd "兴趣伙伴组队系统(前端)"
npm install
npm start
```

- 访问地址：`http://localhost:8000`
- 前端请求的后端地址配置在 `src/constants/index.ts`（`BACKEND_HOST_LOCAL = http://localhost:8101`）
- 接口代码由 Swagger 生成：后端启动后执行 `npm run openapi` 可重新生成 `src/services/backend`

## 接口概览

所有接口以 `/api` 为前缀，统一返回 `{ code, data, message }`。

| 模块 | 主要接口 |
| --- | --- |
| 用户 | `/user/register`、`/user/login`、`/user/logout`、`/user/get/login`、`/user/update/my`、`/user/list/page` |
| 帖子 | `/post/add`、`/post/update`、`/post/delete`、`/post/get/vo`、`/post/list/page/vo`、`/post/my/list/page/vo`、`/post/search/page/vo` |
| 点赞 | `/post_thumb/` |
| 收藏 | `/post_favour/`、`/post_favour/my/list/page`、`/post_favour/list/page` |
| 文件 | `/file/upload` |

## 实现要点

- **权限**：自定义注解 `@AuthCheck` + AOP 切面做接口级角色校验，未登录 / 越权由全局异常处理器统一返回错误码。
- **统一响应**：`BaseResponse` + `ErrorCode` 枚举 + `ThrowUtils`，配合 `@RestControllerAdvice` 收敛异常处理。
- **点赞 / 收藏**：先按「用户 + 帖子」查重再落库，计数用 SQL 原子自增自减，`@Transactional` 保证记录与计数一致，并用 Redis 计数器缓存点赞数。
- **逻辑删除**：`@TableLogic` 标记 `isDelete` 字段，查询自动过滤，删除只改标记。
- **检索**：MySQL 侧用 MyBatis-Plus 条件构造器拼动态 SQL；ES 侧用 `BoolQueryBuilder` 做多字段匹配 + 分页排序。
- **代码生成**：`generate/CodeGenerator` 按 FreeMarker 模板生成 Controller / Service / DTO / VO。

## 说明

- 仓库不包含真实密钥，数据库口令等本地参数请按自己的环境修改。
- ES 同步任务（`job/cycle/IncSyncPostToEs`、`job/once/FullSyncPostToEs`）的 `@Component` 目前是注释状态，默认不执行；需要时取消注释即可。
- 前端 `src/constants/index.ts` 中的 `BACKEND_HOST_PROD` 仍是模板占位地址，部署时需改成自己的后端域名。
- 组队需求目前以「帖子 + 标签」的形式承载，尚未抽象独立的队伍实体（无队伍人数上限、加入 / 退出队伍等逻辑）。
