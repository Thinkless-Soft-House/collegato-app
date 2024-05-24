interface EnvironmentConfigurationModel {
    isProduction: boolean;
    apiProductionEndpoint: string;
    apiDevelopmentEndpoint: string;
    apiKey: string;
};

export const ENVIROMENT_CONFIG: EnvironmentConfigurationModel = {
    isProduction: false,
    apiProductionEndpoint: "https://collegato-scheduler-app-server.thinkless.app.br",
    apiDevelopmentEndpoint: "https://collegato-scheduler-app-server.thinkless.app.br",
    apiKey: "fjmdkshwr4uy8ht90v453ou113616850tu"
}
