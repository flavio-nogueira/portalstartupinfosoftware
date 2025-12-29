import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  showSuccessMessage = signal(false);
  showErrorMessage = signal(false);
  whatsappUrl = signal('');

  constructor(public translationService: TranslationService) {
    effect(() => {
      this.translationService.getCurrentLanguage();
      this.forceUpdate();
    });
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    // Verificar se o formulário é válido
    if (!form.checkValidity()) {
      form.reportValidity(); // Mostra as mensagens de validação nativas do browser
      this.showErrorMessage.set(true);

      // Esconder mensagem de erro após 5 segundos
      setTimeout(() => {
        this.showErrorMessage.set(false);
      }, 5000);

      return;
    }

    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // Validação adicional para campos vazios
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      this.showErrorMessage.set(true);

      setTimeout(() => {
        this.showErrorMessage.set(false);
      }, 5000);

      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showErrorMessage.set(true);

      setTimeout(() => {
        this.showErrorMessage.set(false);
      }, 5000);

      return;
    }

    try {
      // Criar HTML formatado para o email com tema do site (cores azul e escuro)
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

          <!-- CABEÇALHO AZUL ESCURO -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f1f2e 0%, #1a3a52 100%); background-color: #0f1f2e; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">📧 Nova Mensagem do Site</h1>
              <p style="color: #94a3b8; margin: 15px 0 0 0; font-size: 16px;">Startup Infosoftware - Portal de Contato</p>
            </td>
          </tr>

          <!-- CONTEÚDO -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- NOME -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #e2e8f0;">
                <tr>
                  <td>
                    <p style="color: #3B82F6; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">👤 NOME COMPLETO</p>
                    <p style="color: #0f1f2e; font-size: 18px; font-weight: 600; margin: 0; line-height: 1.6;">${name}</p>
                  </td>
                </tr>
              </table>

              <!-- EMAIL -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #e2e8f0;">
                <tr>
                  <td>
                    <p style="color: #3B82F6; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">📧 EMAIL</p>
                    <p style="margin: 0;">
                      <a href="mailto:${email}" style="color: #3B82F6; font-size: 18px; font-weight: 600; text-decoration: none; line-height: 1.6;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- TELEFONE -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #e2e8f0;">
                <tr>
                  <td>
                    <p style="color: #3B82F6; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">📱 TELEFONE</p>
                    <p style="margin: 0;">
                      <a href="tel:+55${phone.replace(/\D/g, '')}" style="color: #3B82F6; font-size: 18px; font-weight: 600; text-decoration: none; line-height: 1.6;">${phone}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- MENSAGEM -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="color: #3B82F6; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">💬 MENSAGEM</p>
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 5px solid #3B82F6;">
                      <p style="color: #0f1f2e; font-size: 16px; margin: 0; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- RODAPÉ -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 3px solid #3B82F6;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                Esta mensagem foi enviada através do formulário de contato do site<br>
                <strong style="color: #3B82F6; font-size: 16px;">Startup Infosoftware</strong>
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">
                Para responder, clique no email ou telefone acima ☝️
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      // Enviar email diretamente com HTML via FormSubmit
      await fetch('https://formsubmit.co/atendimento@startupinfosoftware.com.br', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          _subject: '📧 Nova Mensagem - ' + name,
          _template: 'box',
          _captcha: false,
          _html: htmlContent
        })
      });

      // Mostrar mensagem de sucesso
      this.showSuccessMessage.set(true);

      // Limpar formulário
      form.reset();

      // Criar mensagem formatada para WhatsApp
      let whatsappMessage = `*Nova mensagem do site*%0A%0A`;
      whatsappMessage += `*Nome:* ${encodeURIComponent(name)}%0A`;
      whatsappMessage += `*Email:* ${encodeURIComponent(email)}%0A`;
      whatsappMessage += `*Telefone:* ${encodeURIComponent(phone)}%0A`;
      whatsappMessage += `%0A*Mensagem:*%0A${encodeURIComponent(message)}`;

      // Guardar URL do WhatsApp para o botão
      this.whatsappUrl.set(`https://wa.me/5511965076034?text=${whatsappMessage}`);

    } catch (error) {
      console.error('Erro ao enviar:', error);

      // Mesmo com erro no email, mostra sucesso e permite WhatsApp
      this.showSuccessMessage.set(true);
      form.reset();

      // Criar mensagem formatada para WhatsApp como fallback
      let whatsappMessage = `*Nova mensagem do site*%0A%0A`;
      whatsappMessage += `*Nome:* ${encodeURIComponent(name)}%0A`;
      whatsappMessage += `*Email:* ${encodeURIComponent(email)}%0A`;
      whatsappMessage += `*Telefone:* ${encodeURIComponent(phone)}%0A`;
      whatsappMessage += `%0A*Mensagem:*%0A${encodeURIComponent(message)}`;

      // Guardar URL do WhatsApp para o botão
      this.whatsappUrl.set(`https://wa.me/5511965076034?text=${whatsappMessage}`);
    }
  }

  private forceUpdate() {
    // Força atualização do componente
  }
}
