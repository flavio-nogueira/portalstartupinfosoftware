pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    GIT_BRANCH = 'main'
    
    // Configurações do projeto
    NOME_PROJETO = "startupinfosoftware"
    DOMINIO = "startupinfosoftware.com.br"
    REPO_DIR = "/var/www/${DOMINIO}"
    NGINX_FILE = "/etc/nginx/sites-available/${DOMINIO}"
    NODE_VERSION = "18"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${env.GIT_BRANCH}",
            credentialsId: 'github-token',
            url: 'https://github.com/flavio-nogueira/portalstartupinfosoftware.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          set -e
          echo "📦 Instalando dependências do Node.js..."
          node --version
          npm --version
          npm ci
        '''
      }
    }

    stage('Build Angular') {
      steps {
        sh '''
          set -e
          echo "🏗️ Gerando build de produção..."
          npm run build --prod
          
          echo "📊 Verificando build..."
          ls -lah dist/infosoftware-portal/browser/
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          set -e

          echo "💾 Criando backup do site atual..."
          BACKUP_DIR="/var/www/backups/${NOME_PROJETO}_$(date +%Y%m%d_%H%M%S)"
          if [ -d "$REPO_DIR" ]; then
            sudo -n mkdir -p /var/www/backups
            sudo -n cp -r "$REPO_DIR" "$BACKUP_DIR"
            echo "✅ Backup criado em: $BACKUP_DIR"
          fi

          echo "📤 Fazendo deploy para $REPO_DIR"
          sudo -n mkdir -p "$REPO_DIR"
          sudo -n rsync -a --delete dist/infosoftware-portal/browser/ "$REPO_DIR"/
          sudo -n chown -R www-data:www-data "$REPO_DIR"
          sudo -n chmod -R 755 "$REPO_DIR"

          echo "🌐 Configurando Nginx..."
          sudo -n tee "$NGINX_FILE" >/dev/null <<'NGINX_EOF'
# HTTP - Redirect para HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name startupinfosoftware.com.br www.startupinfosoftware.com.br;
  
  location / {
    return 301 https://$host$request_uri;
  }
}

# HTTPS
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  http2 on;
  
  server_name startupinfosoftware.com.br www.startupinfosoftware.com.br;

  # Certificados SSL
  ssl_certificate /etc/nginx/ssl-certificates/startupinfosoftware.com.br.fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl-certificates/startupinfosoftware.com.br.key;
  
  # SSL Security
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Root e Index
  root /var/www/startupinfosoftware.com.br;
  index index.html;

  # Gzip Compression
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;
  gzip_comp_level 6;

  # Cache para assets estáticos
  location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  # Cache para favicon
  location = /favicon.png {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  # Angular Routes (SPA)
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Security Headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # Logs
  access_log /var/log/nginx/startupinfosoftware-access.log;
  error_log /var/log/nginx/startupinfosoftware-error.log;
}
NGINX_EOF

          echo "🔗 Habilitando site no Nginx..."
          sudo -n ln -sf "$NGINX_FILE" /etc/nginx/sites-enabled/
          
          echo "✅ Testando configuração do Nginx..."
          if sudo -n nginx -t; then
            echo "♻️ Recarregando Nginx..."
            sudo -n systemctl reload nginx
          else
            echo "❌ Configuração do Nginx inválida!"
            exit 2
          fi

          echo "🧹 Limpando backups antigos (mantém últimos 5)..."
          sudo -n bash -c 'cd /var/www/backups && ls -t | grep startupinfosoftware_ | tail -n +6 | xargs -r rm -rf'
        '''
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          set -e
          
          echo "🩺 Verificando se o site está online..."
          URL="https://${DOMINIO}"
          TRIES=10
          SLEEP=3
          
          for i in $(seq 1 $TRIES); do
            STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" "$URL" || echo 000)
            if [ "$STATUS" = "200" ]; then
              echo "✅ Site OK - HTTP $STATUS"
              echo "🌐 Acessível em: $URL"
              exit 0
            fi
            echo "⏳ Aguardando... ($i/$TRIES) - Status: $STATUS"
            sleep "$SLEEP"
          done
          
          echo "❌ Site não respondeu corretamente!"
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Deploy realizado com sucesso!'
      echo "🌐 Site disponível em: https://startupinfosoftware.com.br"
    }
    
    failure {
      echo '❌ Erro no deploy!'
      sh '''
        echo "🔄 Tentando restaurar último backup..."
        LAST_BACKUP=$(sudo -n ls -t /var/www/backups | grep startupinfosoftware_ | head -n 1)
        if [ ! -z "$LAST_BACKUP" ]; then
          echo "📥 Restaurando backup: $LAST_BACKUP"
          sudo -n rm -rf "$REPO_DIR"/*
          sudo -n cp -r /var/www/backups/"$LAST_BACKUP"/* "$REPO_DIR"/
          sudo -n systemctl reload nginx
          echo "✅ Backup restaurado"
        else
          echo "⚠️ Nenhum backup encontrado"
        fi
      '''
    }
    
    always {
      echo '🧹 Limpando workspace...'
      cleanWs()
    }
  }
}
