import { Document, Schema, Model } from "mongoose";
import IGameModel from "../entities/interfaces/IGameModel";
import Game from '../game/game.mongodb.model';

type mongooseIdType = string | Schema.Types.ObjectId;
export interface IGameSchema extends IGameModel<mongooseIdType, mongooseIdType>, Document {
    _id: mongooseIdType;
}

export class GameRepository implements IRepository<IGameSchema> {
    model: Model<IGameSchema, {}>;
    constructor() {
        this.model = Game;
    }

    async deleteOne(query = {}): Promise<{}> {
        return await this.model.deleteOne(query);
    }

    async create(entity = {}) {
        const newUser = await new this.model(entity);
        return newUser;
    }

    async findById(id: string) {
        return await this.model.findById(id);
    }

    async find(query = {}) {
        return await this.model.find(query);
    }

    async findOne(query = {}) {
        return await this.model.findOne(query);
    }

    async all() {
        return await this.model.find();
    }

    async save(entity: IGameSchema) {
        return await entity.save();
    }

    idType(): mongooseIdType {
        return '';
    }
}