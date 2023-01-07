import { io } from "socket.io-client";
import env from '../../../env.json'

const URL = `http://localhost:${env.PORT}`;
export const socket = io(URL, { autoConnect: false });