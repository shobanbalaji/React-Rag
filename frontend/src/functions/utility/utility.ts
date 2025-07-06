const getParamsValue = ({ key }: { key: string }) => {
    const params = new URLSearchParams(window.location.search);
    return String(params.get(key));
};


export {
    getParamsValue
}