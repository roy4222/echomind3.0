# EchoMind2

EchoMind2 是一個AI輔助的個人知識管理系統，幫助用戶組織、儲存和檢索他們的思想和筆記。

## 專案架構

該專案使用前後端分離的架構：

- **前端**：使用Next.js + TypeScript + TailwindCSS構建的現代化網頁應用
- **後端**：使用Cloudflare Workers部署的API服務

## 本地開發設置

### 前提條件

- Node.js 18+
- npm 或 yarn
- Cloudflare帳戶（用於後端部署）

### 安裝

1. 克隆儲存庫
```bash
git clone https://github.com/yourusername/echomind2.git
cd echomind2
```

2. 安裝依賴
```bash
npm run setup
```

3. 配置環境變數
```bash
# 前端環境變數
cp frontend/.env.example frontend/.env.local
# 後端環境變數
cp backend/.env.example backend/.env
```

編輯`.env.local`和`.env`文件，填入必要的API金鑰和配置。

### 啟動開發伺服器

同時啟動前端和後端：
```bash
npm run dev
```

或單獨啟動：
```bash
# 僅前端
npm run frontend:dev

# 僅後端
npm run backend:dev
```

## 部署

### 前端

構建並部署前端：
```bash
npm run frontend:build
```

### 後端

部署到Cloudflare Workers暫存環境：
```bash
npm run backend:deploy
```

部署到Cloudflare Workers生產環境：
```bash
npm run backend:deploy:production
```

## 專案結構

```
echomind2/
├── frontend/          # Next.js前端應用
│   ├── app/           # 頁面路由
│   ├── components/    # UI元件
│   ├── lib/           # 共用函數和工具
│   └── contexts/      # React上下文
├── backend/           # Cloudflare Workers API
│   ├── src/           # API源碼
│   └── wrangler.toml  # Cloudflare配置
└── package.json       # 根專案設定
```

## 授權

[MIT](LICENSE)
