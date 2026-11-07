# 兴趣伙伴组队系统 · 后端

Spring Boot 服务，端口 8101，接口前缀 `/api`。项目整体说明（功能、技术栈、目录结构、启动步骤）见仓库根目录的 [README](../README.md)。

- 启动：`mvn spring-boot:run`
- 接口文档（Knife4j）：http://localhost:8101/api/doc.html
- 建表脚本：`sql/create_table.sql`（库名 `youxi_dp`，4 张表）
- 本地私有配置：`src/main/resources/application-dev.yml`，由 `application-dev.yml.example` 复制后填写，该文件不入库