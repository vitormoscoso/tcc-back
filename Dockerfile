# Etapa de build
FROM node:18-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila o projeto
RUN npm run build

# Gera o client do Prisma
RUN npx prisma generate

# Etapa de produção
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário da etapa anterior
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Variável de ambiente para produção
ENV NODE_ENV=production

# Porta padrão da aplicação NestJS
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
