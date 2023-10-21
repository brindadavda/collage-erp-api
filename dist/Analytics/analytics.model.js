"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsModel = exports.AnalyticsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AnalyticsSchema = new mongoose_1.Schema({
    year: {
        type: Number,
        require: true,
    },
    branches: {
        branche: {
            name: {
                type: String,
            },
            totalStudentsIntake: {
                type: Number,
            },
        },
    },
});
exports.analyticsModel = (0, mongoose_1.model)("Analytics", exports.AnalyticsSchema, "batches");
//# sourceMappingURL=analytics.model.js.map