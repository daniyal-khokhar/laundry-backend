"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestServer = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
server.get('/favicon.ico', (req, res) => res.status(204).end());
server.get('/favicon.png', (req, res) => res.status(204).end());
server.get('/', (req, res) => res.status(200).send('Decent Laundry Backend is Live!'));
const createNestServer = async (expressInstance) => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
};
exports.createNestServer = createNestServer;
exports.default = async (req, res) => {
    await (0, exports.createNestServer)(server);
    server(req, res);
};
//# sourceMappingURL=index.js.map