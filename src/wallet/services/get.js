import { getData } from "../db/index.js";

const dataGet = (id) => {
    return getData(id);
}

export default dataGet;