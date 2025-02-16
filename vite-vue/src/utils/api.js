import request from "./request";

export const getData = (params) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/api/v1/journal/search?${queryString}`, { method: 'get' });
}