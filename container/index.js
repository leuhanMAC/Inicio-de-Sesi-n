import mongoose from 'mongoose';
import config from '../config.js';

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

export default class Container {
    constructor(collectionName, scheme) {
        this.collection = mongoose.model(collectionName, scheme)
    }

    async createIfNotExist() {
        try {
            await fs.promises.access(this.fileName)
        } catch (err) {
            await fs.promises.writeFile(this.fileName, '[]', 'utf8');
        }
    }

    async getAll() {
        try {
            const getCollection = await this.collection.find();

            return getCollection.map(doc => ({
                id: doc._id,
                ...doc._doc
            }));

        } catch (error) {
            throw new Error(`Error al listar: ${error}`);
        }
    }

    async save(elem) {
        try {
            const save = await this.collection.create(elem);
            return {
                ...elem,
                id: save._id
            }
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`);
        }
    }

    async updateById(elem) {
        try {
            const updatedItem = await this.collection.findOneAndReplace({ '_id': elem._id }, elem);
            return updatedItem;
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`);
        }
    }

    async getById(id) {
        try {
            const getDocument = await this.collection.findOne({ '_id': id });
            if (!getDocument.length) throw new Error('No ha sido encontrado.');

            return {
                ...getDocument,
                id: getDocument._id
            }
        } catch (error) {
            throw new Error(`Error al listar por id: ${error}`)
        }
    }

    async deleteById(id) {
        try {
            const deletedItem = await this.collection.findOneAndDelete({ '_id': id });
            return deletedItem;
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async deleteAll() {
        try {
            const firestore = admin.firestore();
            await firestore.recursiveDelete(firestore.collection(this.name));
            return {
                msg: 'All items have been deleted'
            }
        } catch (error) {
            throw new Error(`Error al borrar todos los items: ${error}`);
        }
    }
}

