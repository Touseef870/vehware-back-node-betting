import { getData } from "../db/index.js";

const dataGet = (data) => {
    return getData(data);
}

export default dataGet;