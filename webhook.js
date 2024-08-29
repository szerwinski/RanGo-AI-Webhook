const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // ou qualquer porta que você preferir

// URL da API do Waapi
const waapiBaseUrl = 'https://waapi.app/api/v1';
// URL da API do Waapi
const aiBaseUrl = 'https://b02a697b19d9.ngrok.app/api/v1/run/a5934e58-2889-4cdb-8bd0-c9ea9e52347b';

// Substitua pelo seu token de acesso da API do Waapi
const waapiToken = process.env.WAAPITOKEN;

// Substitua pelo seu ID da instância
const waapiInstanceID = process.env.WAAPIINSTANCEID;

// Middleware para parsear o corpo das requisições como JSON
app.use(bodyParser.json());

async function sendResponseToClient(to, message) {

    console.log("Devolvendo pro cliente")

    const data = {
        chatId: to, // Substitua pelo chat ID
        message: message, // Substitua pela mensagem que deseja enviar
    };

    console.log(data);

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

async function sendRequestToAI(sessionId, message) {

    console.log("Mandando req para a IA");

    const data = {
        input_value: message,
        session_id: sessionId
    };

    try {
        const response = await axios.post(`${aiBaseUrl}?stream=false`, data, {
            headers: {
                'accept': '*/*',
                'content-type': 'application/json'
            }
        });
        console.log('Mensagem enviada para a IA com sucesso!');
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar a mensagem para a IA:', error.message);
    }
}

// Rota do webhook
app.post('/webhook', async (req, res) => {

    // AQUI É RECEBIDA A MENSAGEM QUE O CLIENTE ENVIOU PARA O ESTABELECIMENTO

    const { event, instanceId, data } = req.body;

    if (event === 'message') {
        const { message } = data;
        const { body, from, to, type } = message;

        console.log('Nova mensagem recebida:');
        console.log(`De: ${from}`);
        console.log(`Para: ${to}`);
        console.log(`Tipo: ${type}`);
        console.log(`Mensagem: ${body}`);

        res.status(200).send('Mensagem recebida com sucesso!');

        var aiResponse = await sendRequestToAI(from, message.body);

        console.log(`Nova resposta da IA para a conversa de id: ${aiResponse.session_id}`);
        console.log(aiResponse.outputs[0].outputs[0].results.message.data.text);

        await sendResponseToClient(aiResponse.session_id, aiResponse.outputs[0].outputs[0].results.message.data.text);

    } else {
        res.status(400).send('Evento desconhecido');
    }
});

app.listen(port, () => {
    console.log(`Servidor do webhook rodando na porta ${port}`);
});
