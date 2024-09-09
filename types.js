"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerDef = exports.SortDirection = exports.splitParams = exports.leftPadParams = void 0;
var zod_1 = require("zod");
var types_1 = require("./src/types");
exports.leftPadParams = zod_1.z.object({
    value: zod_1.z.string(),
    length: zod_1.z.number()
});
exports.splitParams = zod_1.z.object({
    value: zod_1.z.string(),
    delimiter: zod_1.z.string().optional().nullable()
});
exports.SortDirection = zod_1.z.enum(['ASC', 'DESC']);
exports.routerDef = {
    echo: {
        method: types_1.HttpMethod.POST,
        path: '/echo',
        inputType: zod_1.z.string(),
        outputType: zod_1.z.string()
    },
    join: {
        method: types_1.HttpMethod.POST,
        path: '/reverse',
        inputType: zod_1.z.array(zod_1.z.string()),
        outputType: zod_1.z.string()
    },
    split: {
        method: types_1.HttpMethod.POST,
        path: '/reverse',
        inputType: exports.splitParams,
        outputType: zod_1.z.array(zod_1.z.string())
    },
    leftPad: {
        method: types_1.HttpMethod.POST,
        path: '/pad',
        inputType: exports.leftPadParams,
        outputType: zod_1.z.string()
    },
    sort: {
        method: types_1.HttpMethod.POST,
        path: '/sort',
        inputType: zod_1.z.object({
            value: zod_1.z.array(zod_1.z.number()),
            direction: exports.SortDirection
        }),
        outputType: zod_1.z.string()
    }
};
