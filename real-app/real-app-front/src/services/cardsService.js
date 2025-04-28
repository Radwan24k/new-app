import httpService from "./httpService";

export function createCard(card) {
  // Requires business user token
  return httpService.post("/cards", card);
}

export function getAllCards() {
  // Renamed from getAll for clarity
  return httpService.get("/cards");
}

export function getCardById(id) {
  // Renamed from getCard for clarity
  return httpService.get(`/cards/${id}`);
}

export function deleteCardById(id) {
  // Renamed from deleteCard, requires owner/admin token
  return httpService.delete(`/cards/${id}`);
}

export function updateCardById(id, card) {
  // Renamed from updateCard, requires owner/admin token
  return httpService.put(`/cards/${id}`, card);
}

export function getMyCards() {
  // Requires user token
  return httpService.get("/cards/my-cards");
}

export function likeUnlikeCard(id) {
  // Renamed from likeCard, requires user token
  // Toggles like status for the logged-in user
  return httpService.patch(`/cards/${id}`);
}

export function patchBizNumber(id, bizNumber) {
  // Requires admin token
  return httpService.patch(`/cards/${id}`, { bizNumber });
}
