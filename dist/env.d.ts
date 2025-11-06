export declare const env: {
    port: number;
    environment: string;
    url: string;
    media: string;
    front: string;
    mongoDb: {
        uri: string;
    };
    stripe: {
        secret: string;
    };
    bcrypt: {
        salt: number;
        paper: string | undefined;
    };
    crypto: {
        algorithm: string;
        secretKey: string;
    };
    jwt: {
        secret: string;
    };
    redis: {
        url: string;
    };
    session: {
        secret: string;
        allowUseStorage: boolean;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    mail: {
        host: string | undefined;
        port: number;
        user: string;
        pass: string;
    };
    support: string;
    resetPassword: string;
    frontend: {
        dashboard: string;
        setupWizard: string;
    };
    adminId: string;
    adminPass: string;
    admin: {
        id: string;
        name: string;
        username: string;
        email: string;
        phone: string;
        nationalId: string;
        avatar: string;
        password: string;
        gender: string;
        roleId: string;
        branchId: string;
    };
};
export declare const checkEnvVariables: () => void;
//# sourceMappingURL=env.d.ts.map