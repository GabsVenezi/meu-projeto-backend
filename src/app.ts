// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";
import fs from "fs"

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

// Define o nome do diretorio onde os arquivos serão armazenados
const DATA_FILE = "./data/player.json";

//Função para garantir que o diretorio de dadis exista antes de salar os arquivos.
//Se o diretorio nao existir, ele sera criado
function ensureDataFolderExists() {
    const dataFolder = "./data";
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder)
    }
}

// chamar a função para garantir que o diretório de dados exista
// antes de qualquer operação de leitura ou escrita de arquivos
ensureDataFolderExists();

// funçao para salvar os dados do jogador em um arquivo JSON
function savePlayerState(player: Player) {
//converte o objeto player em uma string JSON
    const data = JSON.stringify(player, null, 2);
// Salva a string JSON no arquivo definido em DATA_FILE
    fs.writeFileSync(DATA_FILE, data, "utf-8");
}

// funcao para carregar os dados do player em arquivo JSON
function loadPlayerState(): Player {
//verifica se o arquivo de dados existe 
    if (fs.existsSync(DATA_FILE)) {
// Lê o conteúdo do arquivo e converte de volta para um objeto Player
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const playerData = JSON.parse(data);
// ATENÇÃO ! : JSON.parse() retorna o objeto "puro" (sem os metodos da classe player) para que o objeto
// tenha os metodos da classe player r passar os dados carregados para o construtor
        return new Player(playerData.name, playerData.health, playerData.level);
    }
//crie um novo player se não existir com nome "Jogador1", 100 de vida e nível 1
    const newPlayer: Player = new Player("Hero", 100, 1);
    savePlayerState(newPlayer);
    return newPlayer;
}

// Inicializa o playuer carregando se estado do arquivo JSON
let player : Player = loadPlayerState()

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
//chama o método takedamage() e
//retorna para uma resposta JSON com a mensagem de DANO
    const damageMessage = player1.takeDamage(damage);
//salvar o estado atual do player no arquivo JSON
    savePlayerState(player1);
//Para o cliente que faz a requisição
    res.json({ 
        action: damageMessage, 
        currentHealth: player1.health, 
        currentLevel: player1.level
    });
});

// Take Health 
// Rota POST: Jogador recupera vida (takeHealth)
app.post("/player/heal", (req: Request, res: Response) => {
    const { amount } = req.body;
    const healMessage = player1.takeHealth(amount);
    savePlayerState(player1);

    res.json({
    action: healMessage,
    currentHealth: player1.health,
    currentLevel: player1.level,
    });
});

// Level Up
app.post("/player/up-level", (req: Request, res: Response) => {
    const { amount } = req.body;
    const levelMessage = player1.upLevel(amount);
    savePlayerState(player1);
    res.json({
        action: levelMessage,
        currentHealth: player1.health,
        currentLevel: player1.level,
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
console.log(`- POST http://localhost:${PORT}/player/heal - Jogador se cura`);
console.log(`- POST http://localhost:${PORT}/player/up-level - Jogador sobe de nível`);
});

