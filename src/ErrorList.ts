export class SenhaIncorreta extends Error {
    constructor(){
        super()
        this.name = 'SenhaIncorreta'
        this.message = 'Senha Incorreta'
    }
}
export class ServicoIndisponivel extends Error {
    constructor(){
        super()
        this.name = 'ServicoIndisponivel'
        this.message = 'Serviço Indisponível'
    }
}
export class UsuarioComumNaoEncontrado extends Error {
    constructor(){
        super()
        this.name = 'UsuarioComumNaoEncontrado'
        this.message = 'Usuário Comum não encontrado'
    }
}
export class NenhumUsuarioComumEncontrado extends Error {
    constructor(){
        super()
        this.name = 'NenhumUsuarioComumEncontrado'
        this.message = 'Nenhum Usuário Comum encontrado'
    }
}
export class ResultadoNunhumEncontrado extends Error {
    constructor(){
        super()
        this.name = 'ResultadoNunhumEncontrado'
        this.message = 'Nenhum resultado encontrado'
    }
}
export class TokenNaoFornecido extends Error {
    constructor(){
        super()
        this.name = 'TokenNaoFornecido'
        this.message = 'Token não fornecido'
    }
}
export class TokenInvalido extends Error {
    constructor(){
        super()
        this.name = 'TokenInvalido'
        this.message = 'Token Inválido'
    }
}
export class TokenExpirado extends Error {
    constructor(){
        super()
        this.name = 'TokenExpirado'
        this.message = 'Token Expirado'
    }
}
export class ViolacaoUnique extends Error {
    constructor(){
        super()
        this.name = 'EmailJaCadastrado'
        this.message = 'Email já cadastrado'
    }
}