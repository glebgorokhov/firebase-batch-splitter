"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class helps to split a batch into multiple batches
 */
class BatchSplitter {
    db;
    actions = [];
    batchSize = 500;
    /**
     * @param {firestore.Firestore} db Firestore Database reference
     * @param {number} batchSize The amount of operations performed in one batch
     */
    constructor(db, batchSize) {
        if (batchSize) {
            this.batchSize = batchSize;
        }
        this.db = db;
    }
    /**
     * Adds a set action to an array of actions
     * @param {DocumentReference} ref Reference of the document
     * @param {any} data Data to set
     */
    set(ref, data) {
        this.actions.push({
            action: "set",
            ref: ref,
            data,
        });
    }
    /**
     * Adds an update action to an array of actions
     * @param {DocumentReference} ref Reference of the document
     * @param {any} data Data to set
     */
    update(ref, data) {
        this.actions.push({
            action: "update",
            ref: ref,
            data,
        });
    }
    /**
     * Adds a delete action to an array of actions
     * @param {DocumentReference} ref Reference of the document
     */
    delete(ref) {
        this.actions.push({
            action: "delete",
            ref: ref,
        });
    }
    /**
     * Splits actions into batches and commits them, one after another
     */
    async commit() {
        const chunks = (a, size) => Array.from(new Array(Math.ceil(a.length / size)), (_, i) => a.slice(i * size, i * size + size));
        const groups = chunks(this.actions, this.batchSize);
        for (const group of groups) {
            const batch = this.db.batch();
            for (const operation of group) {
                switch (operation.action) {
                    case "set":
                        batch.set(operation.ref, operation.data);
                        break;
                    case "update":
                        batch.update(operation.ref, operation.data);
                        break;
                    case "delete":
                    default:
                        batch.delete(operation.ref);
                        break;
                }
            }
            await batch.commit();
        }
    }
}
exports.default = BatchSplitter;
//# sourceMappingURL=index.js.map