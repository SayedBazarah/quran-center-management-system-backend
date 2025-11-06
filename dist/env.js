import { config } from "dotenv";
config();
export const env = {
    port: +(process.env.PORT || 3000),
    environment: process.env.NODE_ENV || "development",
    url: process.env.BASE_URL || "http://localhost:3000",
    media: process.env.MEDIA_URL || "http://localhost:3000/media",
    front: process.env.FRONT_UEL || "http://localhost:3000",
    mongoDb: {
        uri: process.env.DATABASE_URL,
    },
    stripe: {
        secret: process.env.STRIPE_SECRET_KEY,
    },
    bcrypt: {
        salt: +(process.env.BCRYPT_SALT || 1),
        paper: process.env.BCRYPT_PAPER,
    },
    crypto: {
        algorithm: process.env.CRYPTO_ALGORITHM || "aes-256-cbc",
        secretKey: process.env.CRYPTO_SECRET_KEY || "your-32-character-secret-key",
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    redis: {
        url: process.env.REDIS_URI,
    },
    session: {
        secret: process.env.SESSION_SECRET,
        allowUseStorage: process.env.ALLOW_USE_SESSION_STORAGE === "true",
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: +(process.env.MAIL_PORT || 1),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    support: process.env.SUPPORT_EMAIL || "support@example.com",
    resetPassword: process.env.RESET_PASSWORD ||
        "http://localhost:3000/api/auth/reset-password",
    frontend: {
        dashboard: process.env.FRONT_DASHBOARD || "http://localhost:8083/dashboard",
        setupWizard: process.env.FRONT_SETUP_WIZARD || "http://localhost:8083/setup-wizard",
    },
    adminId: process.env.ADMIN_ID || "68ff0ffa9cee4a56fc5fa464",
    adminPass: process.env.ADMIN_PASS || "pass",
    admin: {
        id: process.env.ADMIN_ID || "68ff0ffa9cee4a56fc5fa464",
        name: process.env.ADMIN_NAME || "مدير النظام",
        username: process.env.ADMIN_USERNAME || "superadmin",
        email: process.env.ADMIN_EMAIL || "superadmin@example.com",
        phone: process.env.ADMIN_PHONE || "0000000000",
        nationalId: process.env.ADMIN_NATIONAL_ID || "11111111111111",
        avatar: process.env.ADMIN_AVATAR || "",
        password: process.env.ADMIN_PASSWORD || "ChangeMe!123",
        gender: process.env.ADMIN_GENDER || "male",
        roleId: process.env.ADMIN_ROLE_ID || "68ff0ffa9cee4a56fc5fa464",
        branchId: process.env.ADMIN_BRANCH_ID || "68ff0ffa9cee4a56fc5fa464",
    },
};
export const checkEnvVariables = () => {
    if (!env.mongoDb.uri)
        throw new Error("env:MONGO_URI must be defined");
    if (!env.stripe.secret)
        throw new Error("env:STRIPE_SECRET_KEY must be defined");
    if (!env.bcrypt.salt)
        throw new Error("env:BCRYPT_SALT must be defined");
    if (!Number.isInteger(env.bcrypt.salt))
        throw new Error("env:BCRYPT_SALT must be integer");
    if (!env.jwt.secret)
        throw new Error("env:JWT_SECRET must be defined");
    if (!env.mail.port)
        throw new Error("env:MAIL_PORT must be defined");
    if (!Number.isInteger(env.mail.port))
        throw new Error("env:MAIL_PORT must be integer");
    if (!env.mail.user)
        throw new Error("env:MAIL_USER must be defined");
    if (!env.mail.pass)
        throw new Error("env:MAIL_PASS must be defined");
};
//# sourceMappingURL=env.js.map