import { io } from "socket.io-client";
import env from '../../../env.json'

const URL = `http://localhost:8000`;
export const socket = io(URL, { autoConnect: false });