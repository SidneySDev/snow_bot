let isPluginActive = true; // Plugin começa ativo por padrão

// Função para preencher campos de referência
function fillReferenceField(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.value = value; // Define o valor do campo
    const event = new Event('input', { bubbles: true });
    field.dispatchEvent(event); // Dispara o evento de input
    console.log(`Campo ${fieldId} preenchido com: ${value}`);
  } else {
    console.error(`Campo ${fieldId} não encontrado.`);
  }
}

// Função para limpar todos os campos
function clearFields() {
  fillReferenceField('sys_display.incident.caller_id', ''); // Solicitante
  fillReferenceField('sys_display.incident.location', ''); // Local
  fillReferenceField('sys_display.incident.u_item', ''); // Item
  fillReferenceField('sys_display.incident.u_symptom', ''); // Sintoma
  fillReferenceField('sys_display.incident.business_service', ''); // Serviço
  fillReferenceField('sys_display.incident.assignment_group', ''); // Grupo de Atribuição
  console.log('Campos limpos.');
}

// Função para copiar o valor de incident.description para incident.work_notes
function copyDescriptionToWorkNotes() {
  const descriptionField = document.getElementById('incident.description');
  const workNotesField = document.getElementById('incident.work_notes');

  if (descriptionField && workNotesField) {
    workNotesField.value = descriptionField.value; // Copia o valor
    const event = new Event('input', { bubbles: true });
    workNotesField.dispatchEvent(event); // Dispara o evento de input
    console.log('Valor de incident.description copiado para incident.work_notes.');
  } else {
    console.error('Campos incident.description ou incident.work_notes não encontrados.');
  }
}

// Função para monitorar o campo incident.description
function monitorTextarea() {
  const textarea = document.getElementById('incident.description');

  if (textarea) {
    textarea.addEventListener('input', function () {
      const texto = textarea.value.trim();

      if (texto === '') {
        // Limpa os campos se o campo description estiver vazio
        clearFields();
      } else if (isPluginActive) {
        // Mapeamento de siglas para localidades
        const localidades = {
          EQTPI: 'EQTL Piauí',
          EQTMA: 'EQTL Maranhão',
          EQTAL: 'EQTL Alagoas',
          EQTGO: 'EQTL Goiás',
          EQTAP: 'EQTL Amapá',
          EQTRS: 'EQTL CEEE',
          EQTPA: 'EQTL Pará',
          EQTTR: 'COS Equatorial Transmissão' // Nova sigla adicionada
        };

        // Verifica a primeira sigla no início do texto
        const siglaEncontrada = Object.keys(localidades).find(sigla => texto.startsWith(sigla));

        if (siglaEncontrada) {
          // Preenche os campos automaticamente
          fillReferenceField('sys_display.incident.caller_id', 'JOSE BENEDITO SOUZA LOBO'); // Solicitante
          fillReferenceField('sys_display.incident.location', localidades[siglaEncontrada]); // Local
          fillReferenceField('sys_display.incident.u_item', 'Telecom e Redes - Problemas Gerais'); // Item
          fillReferenceField('sys_display.incident.u_symptom', 'Indisponível'); // Sintoma
          fillReferenceField('sys_display.incident.business_service', 'Equipamentos de TI'); // Serviço
          fillReferenceField('sys_display.incident.assignment_group', 'Monitoramento CGS'); // Grupo de Atribuição
          console.log('Campos preenchidos automaticamente.');
        }

        // Copia o valor de incident.description para incident.work_notes
        copyDescriptionToWorkNotes();
      }
    });
  }
}

// Receber mensagens do popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'togglePlugin') {
    isPluginActive = request.active;
    console.log(`Plugin ${isPluginActive ? 'ativado' : 'desativado'}.`);
  }
});

// Monitorar a página continuamente
function startMonitoring() {
  monitorTextarea();
  console.log('Monitoramento iniciado.');
}

// Iniciar o monitoramento ao carregar a página
startMonitoring();