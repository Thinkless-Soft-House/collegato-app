interface EnvironmentConfigurationModel {
  isProduction: boolean;
  apiProductionEndpoint: string;
  apiDevelopmentEndpoint: string;
  apiKey: string;
}

export const ENVIROMENT_CONFIG: EnvironmentConfigurationModel = {
  isProduction: false,
  apiProductionEndpoint:
    "https://collegato-scheduler-app-server.thinkless.app.br",
  apiDevelopmentEndpoint:
    "https://d166-2804-d45-bf1d-9100-d3b-c056-434b-5076.ngrok-free.app",
  apiKey: "fjmdkshwr4uy8ht90v453ou113616850tu",
};
