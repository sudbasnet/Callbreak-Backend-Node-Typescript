import { Document, Schema, Model } from "mongoose";
import { IUserModel } from "../entities/interfaces/IUserModel";
import User from '../user/user.model';

type mongooseIdType = string | Schema.Types.ObjectId;
export interface IUserSchema extends IUserModel<mongooseIdType>, Document {
    _id: mongooseIdType;
}

export class UserRepository implements IRepository<IUserSchema> {
    model: Model<IUserSchema, {}>;
    constructor() {
        this.model = User;
    }

    async deleteOne(query = {}): Promise<{}> {
        return await this.model.deleteOne(query);
    }

    async create(entity: {}) {
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

    async save(entity: IUserSchema) {
        return await entity.save();
    }
}