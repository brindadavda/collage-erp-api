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
exports.analyticsRouter = void 0;
const express_1 = require("express");
const analytics_model_1 = require("./analytics.model");
exports.analyticsRouter = (0, express_1.Router)();
exports.analyticsRouter.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const batches_data = yield analytics_model_1.analyticsModel.find({});
    res.send(batches_data);
}));
//# sourceMappingURL=analytics.router.js.map