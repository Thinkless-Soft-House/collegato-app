import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const chatListRecadosEndPoint = "recados/chatList";
export const messagesRecadosEndPoint = "recados/messages";
export const usuariosRecadosEndPoint = "recados/usuarios";
export const chatListOuvidoriasEndPoint = "ouvidoria/chatList";
export const messagesOuvidoriasEndPoint = "ouvidoria/messages";
export const usuariosOuvidoriasEndPoint = "ouvidoria/usuarios";
export const collegatoChatId = 11015959;

const firebaseConfig = {
    apiKey: "AIzaSyBZAGdo-Dm_xSka7sj7xIEajIsw4YDosOM",
    serviceAccountId: 'userchat@collegato-chat-app.iam.gserviceaccount.com',
    authDomain: "collegato-chat-project.firebaseapp.com",
    projectId: "collegato-chat-project",
    storageBucket: "collegato-chat-project.appspot.com",
    messagingSenderId: "251165251555",
    appId: "1:251165251555:web:eb6525fad1e44cc26b72d6",
    measurementId: "G-5EHQSN5VBT",
    databaseURL: "https://collegato-chat-project-default-rtdb.firebaseio.com",
  };

  const app = initializeApp(firebaseConfig);
  export const chatDatabase = getDatabase(app);
