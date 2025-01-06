"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerFilter = req.query.owner;
            try {
                if (ownerFilter) {
                    const item = yield this.model.find({ owner: ownerFilter });
                    res.send(item);
                }
                else {
                    const items = yield this.model.find();
                    res.send(items);
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const item = yield this.model.findById(id);
                if (item != null) {
                    res.send(item);
                }
                else {
                    res.status(404).send("Not found");
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                const item = yield this.model.create(body);
                res.status(201).send(item);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const rs = yield this.model.findByIdAndDelete(id);
                res.status(200).send("Item Deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map