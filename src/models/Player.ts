// A palavra "class" define que estamos criando um molde
// A palavra "export" permite que esse arquivo seja usado por outros arquivos (como o app.ts)

export class Player {
    public name: string; // O nome do jogador (Texto)
    public health: number; // A saúde do jogador (Número)
    public level: number; // O nível do jogador (Número)

// Construtores (é um método especial que é executado automaticamente quando a classe é instanciada uma única vez)

constructor(name: string, health: 100, level: 1){

//A palavra "This" faz referencia a propria classe, ou seja,"Pegue o atributo 'name' da classe Player e atribua o valor do
// parametro 'name' a ele"

    this.name = name;
    this.health = health;
    this.level = level;
    }

// Métodos (Comportamentos da classe)
// Métodos são as funções que a classe pode executar, ou seja, são os comportamentos da classe.
// O método "attack" é um metodo que retorna uma string

public attack() {
    const damage = this.level * 10; // calcula o dano baseado no nível do jogador
    return `${this.name} atacou e causou ${damage} de dano!`;
    }

// O método de "takeDamage" é um método que recebe um numero como parametro e nao retorna nada (void)

public takeDamage(amount: number): string{
    this.health -= amount; //reduz a saúde do jogador pelo valor do parametro
    if (this.health < 0) {
        this.health = 0; // Garante que a saúde não fique abaixo de 0
        return `${this.name} foi derrotado!`;
    }
    
    return `${this.name} levou ${amount} de dano e agora tem ${this.health} de saúde.`;
}

public takeHealth(amount: number): string {
    this.health += amount;
    if (this.health > 100) {
        this.health = 100;
    }
    return `${this.name} recuperou ${amount} de vida! Saúde atual: ${this.health}.`;
    }

public upLevel(amount: number): string {
    this.level += amount;
    return `${this.name} subiu para o nível ${this.level}`;
}
}