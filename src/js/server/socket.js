import { io } from "socket.io-client";
import env from '../../../env.json'

const URL = `https://diglav.ru`;
export const socket = io(URL, { autoConnect: false });