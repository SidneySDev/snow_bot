let isPluginActive = true; // Plugin começa ativo por padrão

// Atualiza o estado inicial do botão
document.getElementById('toggleButton').checked = isPluginActive;

document.getElementById('toggleButton').addEventListener('change', function () {
  isPluginActive = this.checked;

  // Envia mensagem para o content.js
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePlugin', active: isPluginActive });
  });
});