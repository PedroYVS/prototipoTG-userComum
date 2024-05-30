import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import UC from './UsuarioComum.DAOclass.js'
import { SenhaIncorreta, ServicoIndisponivel, UsuarioComumNaoEncontrado, NenhumUsuarioComumEncontrado, ResultadoNunhumEncontrado, ViolacaoUnique } from './ErrorList.js'

dotenv.config()
const { PORT_SERVICE, JWT_UC_ACCESS_KEY, JWT_UE_ACCESS_KEY, JWT_UA_ACCESS_KEY, JWT_EXPIRATION_TIME, SALT_ROUNDS } = process.env

const appServer = express()
appServer.use(express.json())
appServer.use(cors())

await UC.sync()

const verificaToken = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')
    if(!token){
        return res.status(401).send('Token não fornecido')
    }
    let chave: string | undefined
    switch(req.query.tipoUsuario){
        case 'UE':
            chave = JWT_UE_ACCESS_KEY
            break
        case 'UA':
            chave = JWT_UA_ACCESS_KEY
            break
        case 'UC':
            chave = JWT_UC_ACCESS_KEY
            break
    }
    jwt.verify(token[1], chave!, (err: any, result: any) => {
        if(err){
            return res.status(403).send('Token Inválido')
        }
        req.usuario = result.usuario
        next()
    })
}

appServer.post('/cadastrar', async (req, res) => {
    const { email, senha, nome_completo, ocupacao, pais_origem } = req.body
    try{
        let senhaHash: any, sucesso = false
        while(!sucesso){
            try{
                senhaHash = await bcrypt.hash(senha, +SALT_ROUNDS!)
                sucesso = true
            }
            catch(err){
                console.error("Erro no bcrypt.hash()", err)
            }
        }
        try{
            const novoUC = await UC.create({ email, senha: senhaHash, nome_completo, ocupacao, pais_origem})
            if(novoUC){
                res.status(201).send('Usuário Comum Cadastrado com Sucesso')
            }
            else{
                res.status(503).send(new ServicoIndisponivel())
            }
        }
        catch(err: any){
            console.error("Erro no UE.create()", err)
            switch(err.errors[0].type){
                case 'unique violation':
                    res.status(409).send(new ViolacaoUnique())
                    break
            }
        }
    }
    catch(err){
        console.error("Erro na operação 'Cadastrar' no serviço de Usuários Comuns", err)
        return res.send(err)
    }
})

appServer.get('/login', async (req, res) => {
    const { email, senha } = req.query
    try{
        const usuarioC = await UC.findByPk(email as string)
        if(usuarioC){
            const senhaDadaEstaCorreta = await bcrypt.compare(senha as string, usuarioC.getDataValue('senha'))
            if(senhaDadaEstaCorreta){
                const token = jwt.sign(
                    { usuario: usuarioC.getDataValue('email') },
                    JWT_UC_ACCESS_KEY!,
                    { expiresIn: JWT_EXPIRATION_TIME! }
                )
                const resposta = {
                    token,
                    tipoUsuario: 'UC'
                }
                res.status(200).json(resposta)
            }
            else{
                res.status(401).send(new SenhaIncorreta())
            }
        }
        else{
            res.status(404).send(new UsuarioComumNaoEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'Login' no serviço de Usuários Comuns", err)
        res.send(err)
    }
})

appServer.get('/acessa-info', verificaToken, async (req: any, res: any) => {
    const { usuario } = req
    try {
        const infoUE = await UC.findByPk(usuario as string)
        if (infoUE) {
            res.status(200).json(infoUE)
        } else {
            res.status(404).send(new UsuarioComumNaoEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'AcessaInfo' no serviço de Usuários Comuns", err)
        res.send(err)
    }
})

appServer.get('/ver-todos', verificaToken, async (_req, res) => {
    try{
        const todosUC = await UC.findAll()
        if(todosUC.length > 0){
            res.status(200).json(todosUC)
        }
        else{
            res.status(404).send(new NenhumUsuarioComumEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'VerTodos' no serviço de Usuários Comuns", err)
        res.send(err)
    }
})

appServer.get('/consultar/adm', verificaToken, async (req, res) => {
    const { pesquisa } = req.query
    try{
        const buscaEC = await UC.findAll({
            where: {
                [Op.or]: [
                    {email: {[Op.like]: '%'+ pesquisa +'%'}},
                    {nome_completo: {[Op.like]: '%'+ pesquisa +'%'}},
                    {ocupacao: {[Op.like]: '%'+ pesquisa +'%'}},
                    {pais_origem: {[Op.like]: '%'+ pesquisa +'%'}}
                ]
            }
        })
        if(buscaEC.length > 0){
            res.status(200).json(buscaEC)
        }
        else{
            res.status(404).send(new ResultadoNunhumEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'Consultar' no serviço de Usuários Comuns", err)
        res.send(err)
    }
})

appServer.get('/consultar/empr', verificaToken, async (req, res) => {
    const { pesquisa } = req.query
    try{
        const espUC = await UC.findOne({
            where: {
                [Op.or]: [
                    {email: {[Op.like]: '%'+ pesquisa +'%'}},
                    {nome_completo: {[Op.like]: '%'+ pesquisa +'%'}}
                ]
            }
        })
        if(espUC){
            res.status(200).json(espUC)
        }
        else{
            res.status(404).send(new UsuarioComumNaoEncontrado())
        }
    }
    catch(err){
        console.error("Erro na operação 'Consultar' no serviço de Usuários Comuns", err)
        res.send(err)
    }
})

appServer.listen(PORT_SERVICE, () => console.log(`Usuário Comum. Executando Porta ${PORT_SERVICE}`))