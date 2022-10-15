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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const formatResponse_1 = require("../helpers/formatResponse");
const router = express_1.default.Router();
const authRoutes = (db) => {
    router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, url, password } = req.body;
        const user = (yield db.query(`SELECT * FROM users WHERE username=$1 OR email=$2`, [
            username,
            email,
        ])).rows[0];
        if (user) {
            return user.email === email
                ? res
                    .status(403)
                    .json((0, formatResponse_1.formatResponse)("", false, "Email already exists"))
                : res
                    .status(403)
                    .json((0, formatResponse_1.formatResponse)("", false, "Username already exists"));
        }
        yield bcrypt_1.default.genSalt(10, (err, salt) => {
            bcrypt_1.default.hash(password, salt, (err, passwordhash) => {
                db.query("INSERT INTO users (username, email, url, passwordhash) VALUES($1, $2, $3, $4)", [username, email, url, passwordhash]);
                if (!err)
                    res.status(200).json((0, formatResponse_1.formatResponse)({ username, email, url }));
                else {
                    res
                        .status(500)
                        .json((0, formatResponse_1.formatResponse)("", false, "Error creating account."));
                }
            });
        });
    }));
    router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const users = (yield db.query(`SELECT * FROM users WHERE email=$1`, [email])).rows;
        if (users.length === 0) {
            res.status(403).json((0, formatResponse_1.formatResponse)("", false, "Email does not exist."));
            return;
        }
        const user = users[0];
        const { username, url } = user;
        yield bcrypt_1.default.compare(password, user.passwordhash, (err, result) => {
            err
                ? res
                    .status(500)
                    .json((0, formatResponse_1.formatResponse)("", false, "Error decrypting password."))
                : result === false
                    ? res
                        .status(401)
                        .json((0, formatResponse_1.formatResponse)("", false, "Incorrect email/password combination."))
                    : res.status(200).json((0, formatResponse_1.formatResponse)({ email, username, url }));
        });
    }));
    return router;
};
exports.default = authRoutes;
//# sourceMappingURL=auth.js.map