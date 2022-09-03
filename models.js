import mongoose from 'mongoose';
import config from './config.js';


mongoose.connect(config.db.url, { useNewUrlParser: false, useUnifiedTopology: false })

const User = mongoose.model("users", new mongoose.Schema({
    id: Number,
    lastBonus: Number,
    balance: Number,
    waitFor: String,
}));

const Chat = mongoose.model("chats", new mongoose.Schema({
    id: Number,
    title: String,
    link: String,
    cntMsgs: Object,
    warningsUserList: Object,
    rules: Object,
    antispam: Object,
    antiforward: Object,
    greetings: Object,
    antiflud: Object,
    stopwords: Object,
    antiarab: Object,
    nightmode: Object,
    captcha: Object,
    other: Object,
    warnings: Object,
    entertainment: Object,
    automessages: Object,
    autodeletemessages: Object,
    admins: [Number]
}));


export { User, Chat };