import dotenv from 'dotenv'
import { Sequelize, DataTypes, Model } from "sequelize"

dotenv.config()
const { HOST, USER, PASSWORD, DATABASE, PORT_DATABASE_CONNECTION, SSL } = process.env

const sequelize = new Sequelize({
    database: DATABASE,
    username: USER,
    password: PASSWORD,
    host: HOST,
    port: +PORT_DATABASE_CONNECTION!,
    ssl: SSL === 'REQUIRED' ? true : false,
    dialect: 'mysql'
})

export default class UC extends Model {}

UC.init(
    {
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nome_completo: {
            type: DataTypes.STRING(160),
            allowNull: false
        },
        ocupacao: {
            type: DataTypes.STRING(70),
            allowNull: true
        },
        pais_origem: {
            type: DataTypes.STRING(70),
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'UC',
        tableName: 'usuarios_comuns',
        timestamps: false
    }
)