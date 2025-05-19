# Estágio de build
FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto dos arquivos
COPY . .

# Dar permissão de execução ao tsc
RUN chmod +x node_modules/.bin/tsc

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 