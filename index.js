const axios = require('axios');

// URL da API do Waapi
const waapiBaseUrl = 'https://waapi.app/api/v1';

// Substitua pelo seu token de acesso da API do Waapi
const waapiToken = 'p5LujFfS4oj4FHsYRoXzxGmHS05zEE2e1d5ynmDIbc5220ad';

// Substitua pelo seu ID da instância
const waapiInstanceID = '16051';

// Exemplo de função para obter informações básicas da API
async function getBasicInfo() {
    try {
        const response = await axios.get(`${waapiBaseUrl}/instances/${waapiInstanceID}/client/me`, {
            headers: {
                'Authorization': `Bearer ${waapiToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Erro ao obter informações:', error.message);
    }
}

async function getClientStatus() {
    try {
        const response = await axios.get(`${waapiBaseUrl}/instances/${waapiInstanceID}/client/status`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${waapiToken}`
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Erro ao obter o status do client:', error.message);
    }
}

async function sendMessage() {

    const data = {
        chatId: '556199532697@c.us', // Substitua pelo chat ID
        message: 'Olá! Esta é uma mensagem de teste. Tiagão Bizarro', // Substitua pela mensagem que deseja enviar
    };

    try {
        const response = await axios.post(`${waapiBaseUrl}/instances/${waapiInstanceID}/client/action/send-message`, data, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': `Bearer ${waapiToken}`
            }
        });
        console.log('Mensagem enviada:', response.data);
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error.message);
    }
}



// Chame a função para testar a API
sendMessage();
