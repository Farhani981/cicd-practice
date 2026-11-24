import HttpService from '../http/HttpServices';

const ENDPOINT = '/todos'; // Backend ka controller path

const ItemService = {
    // Saare items / todos fetch karna
    getAll(params = {}) {
        return HttpService.get(ENDPOINT, params);
    },

    // Single item ID ke zariye fetch karna
    getById(id) {
        return HttpService.get(`${ENDPOINT}/${id}`);
    },

    // Naya item create karna
    create(payload) {
        return HttpService.post(ENDPOINT, payload);
    },

    // Full update (PUT)
    update(id, payload) {
        return HttpService.put(`${ENDPOINT}/${id}`, payload);
    },

    // Partial update (PATCH) - e.g. status toggle karna
    patch(id, payload) {
        return HttpService.patch(`${ENDPOINT}/${id}`, payload);
    },

    // Delete item
    remove(id) {
        return HttpService.delete(`${ENDPOINT}/${id}`);
    },
};

export default ItemService;