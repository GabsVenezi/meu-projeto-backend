// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";
// importa a classe Player do arquivo Player.ts
import { Player } from "./models/Player.js";

// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

// middleware para permitir que o serrvbidor entenda requisicoes com corpo em JSON
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

//Instanciação de um jogador utilizando a classe player
// Criamos(Instanciamos) um novo jogador chamado "Hero" com 100 de saúde e nível 1
// A partir dessa classe Player que foi importada do arquivo Player.ts

let player1: Player = new Player("Hero", 100, 1);

//rota GET para obter informações do jogador 
//Quando o usuario acessar a rota "/player", o servidor respondera com os dados do jogador
//A função de Callback recebe dois parametros: req (requisição) e res (resposta)

app.get("/player", (req: Request, res: Response) => {
res.json({
    message: "Informações do jogador", 
    player: player1,
    });
});

//Rota POST para quando o jogador atacar
// Quandi i usuario acessar a rota "/player/attack", o servudir chamara o metodo attack() do jogador
//é utilizada para enviar dados e requisições que alteram o estado do servidor

app.post("/player/attack", (req: Request, res: Response) => {
const attackmessage = player1.attack();
res.json({ 
    message: attackmessage, 
    });
});

// Rota para receber o dano
// Quando o usuario acessar a rota "/player/take-damage", o servidor chamara o metodo takeDamage() do jogador, passando o valor
// do dano recebido como parametro

app.post("/player/take-damage", (req: Request, res: Response) => {
    const { damage } = req.body;
    const damageMessage = player1.takeDamage(damage); //Chama o método takedamage() e
//retorna para uma resposta JSON com a mensagem de DANO
//Para o cliente que faz a requisição
    res.json({ 
        action: damageMessage, 
        currentHealth: player1.health, 
        currentLevel: player1.level
    });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
console.log(`Servidor rodando em http://localhost:${PORT}`);
console.log(`Rotas disponíveis:`);
console.log(`- GET http://localhost:${PORT}/player - Obter informações do jogador`);
console.log(`- POST http://localhost:${PORT}/player/attack - Jogador realiza um Ataque`);
console.log(`- POST http://localhost:${PORT}/player/take-damage - Jogador recebe dano`);
});

