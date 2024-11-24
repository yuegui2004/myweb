#!/bin/bash

# 创建React项目
echo "创建React项目..."
npx create-react-app frontend

cd frontend

# 安装依赖
echo "安装依赖包..."
npm install @mui/material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux
npm install axios react-router-dom
npm install @mui/icons-material
npm install react-query

# 创建必要的目录结构
echo "创建目录结构..."
mkdir -p src/{components,pages,store,utils,hooks,assets}

# 复制配置文件
echo "配置环境变量..."
cat > .env << EOL
REACT_APP_API_URL=http://localhost:8000
REACT_APP_VERSION=1.0.0
EOL

# 创建开发和生产环境配置
cat > .env.development << EOL
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
EOL

cat > .env.production << EOL
REACT_APP_API_URL=https://api.yoursite.com
REACT_APP_ENV=production
EOL

echo "前端项目配置完成！" 