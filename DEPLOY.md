# 🚀 Deploy com Jenkins - startupinfosoftware.com.br

## 📋 Pré-requisitos na VPS

### 1. Configurar Permissões Sudo para Jenkins

Edite o arquivo sudoers:
```bash
sudo visudo
```

Adicione as seguintes linhas no final:
```bash
# Jenkins - Permissões para deploy
jenkins ALL=(ALL) NOPASSWD: /bin/mkdir
jenkins ALL=(ALL) NOPASSWD: /bin/cp
jenkins ALL=(ALL) NOPASSWD: /bin/rsync
jenkins ALL=(ALL) NOPASSWD: /bin/chown
jenkins ALL=(ALL) NOPASSWD: /bin/chmod
jenkins ALL=(ALL) NOPASSWD: /bin/rm
jenkins ALL=(ALL) NOPASSWD: /bin/ln
jenkins ALL=(ALL) NOPASSWD: /bin/tee
jenkins ALL=(ALL) NOPASSWD: /bin/bash
jenkins ALL=(ALL) NOPASSWD: /usr/sbin/nginx
jenkins ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
```

### 2. Criar Estrutura de Pastas

```bash
sudo mkdir -p /var/www/startupinfosoftware.com.br
sudo mkdir -p /var/www/backups
sudo chown -R jenkins:jenkins /var/www/startupinfosoftware.com.br
sudo chown -R jenkins:jenkins /var/www/backups
```

### 3. Instalar Node.js no Servidor Jenkins

```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 4. Configurar Certificado SSL

```bash
sudo mkdir -p /etc/nginx/ssl-certificates

# Gerar certificado com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d startupinfosoftware.com.br -d www.startupinfosoftware.com.br

# Copiar certificados para pasta padrão
sudo cp /etc/letsencrypt/live/startupinfosoftware.com.br/fullchain.pem /etc/nginx/ssl-certificates/startupinfosoftware.com.br.fullchain.pem
sudo cp /etc/letsencrypt/live/startupinfosoftware.com.br/privkey.pem /etc/nginx/ssl-certificates/startupinfosoftware.com.br.key
```

## 🔧 Configurar Job no Jenkins

### 1. Criar Novo Job

1. Acesse Jenkins: `http://seu-servidor:8080`
2. Clique em **"New Item"**
3. Nome: `startupinfosoftware-portal`
4. Tipo: **Pipeline**
5. Clique em **OK**

### 2. Configurar Pipeline

**Na seção "Pipeline":**
- **Definition:** Pipeline script from SCM
- **SCM:** Git
- **Repository URL:** `https://github.com/seu-usuario/infosoftware-portal.git`
- **Credentials:** Selecione suas credenciais GitHub (id: `github-token`)
- **Branch:** `*/main`
- **Script Path:** `Jenkinsfile`

### 3. Configurar Build Triggers (Opcional)

**Para deploy automático:**
- ✅ **Poll SCM:** `H/5 * * * *` (verifica a cada 5 minutos)

**OU**

- ✅ **GitHub hook trigger** (webhook do GitHub)

### 4. Salvar e Executar

1. Clique em **Save**
2. Clique em **Build Now**
3. Acompanhe o log em **Console Output**

## 📝 Estrutura do Pipeline

```
1. Checkout          → Clona o repositório
2. Install Deps      → npm ci
3. Build Angular     → npm run build --prod
4. Deploy            → Copia para /var/www/
5. Health Check      → Verifica se site está online
```

## 🔄 Rollback Automático

Se o deploy falhar, o Jenkins automaticamente:
1. Restaura o último backup
2. Recarrega o Nginx
3. Notifica o erro

## 📊 Monitoramento

**Logs do Nginx:**
```bash
sudo tail -f /var/log/nginx/startupinfosoftware-access.log
sudo tail -f /var/log/nginx/startupinfosoftware-error.log
```

**Verificar site:**
```bash
curl -I https://startupinfosoftware.com.br
```

**Listar backups:**
```bash
ls -lah /var/www/backups/
```

## 🚨 Troubleshooting

### Pipeline falha em "nginx -t"
```bash
# Verificar sintaxe manualmente
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log
```

### Site retorna 404
```bash
# Verificar arquivos
ls -lah /var/www/startupinfosoftware.com.br/

# Verificar permissões
sudo chown -R www-data:www-data /var/www/startupinfosoftware.com.br/
sudo chmod -R 755 /var/www/startupinfosoftware.com.br/
```

### Health Check falha
```bash
# Testar manualmente
curl -I https://startupinfosoftware.com.br

# Verificar certificado SSL
openssl s_client -connect startupinfosoftware.com.br:443
```

## 📱 URLs

- **Produção:** https://startupinfosoftware.com.br
- **Jenkins:** http://seu-servidor:8080/job/startupinfosoftware-portal
- **SonarQube:** (opcional) http://seu-servidor:9000

## ✅ Checklist Final

- [ ] Node.js instalado no Jenkins
- [ ] Permissões sudo configuradas
- [ ] Pastas criadas (/var/www/startupinfosoftware.com.br)
- [ ] Certificado SSL configurado
- [ ] Credenciais GitHub adicionadas no Jenkins
- [ ] Job criado no Jenkins
- [ ] Jenkinsfile commitado no repositório
- [ ] Primeiro build executado com sucesso
- [ ] Site acessível via HTTPS

## 🎉 Pronto!

Agora sempre que você fizer push para a branch `main`, o Jenkins vai:
1. Detectar mudanças
2. Fazer build do Angular
3. Fazer deploy automático
4. Verificar se tudo está OK

**Deploy automático configurado!** 🚀
