import { getData } from "../db/index.js";

const login = (data) => {
    return getData(data);
}

export default login;