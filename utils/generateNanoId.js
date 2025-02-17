
const generateNanoId = () => {
    const NanoId = Math.floor(Math.random() * 1000) + Date.now();
    return NanoId;
};

export default generateNanoId;