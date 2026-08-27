import api from "./api";

export const getTailors = async () => {
  const response = await api.get("/tailors");
  return response.data;
};

export const createTailor = async (tailorData) => {
  const response = await api.post("/tailors", tailorData);
  return response.data;
};

export const updateTailor = async (id, tailorData) => {
  const response = await api.put(
    `/tailors/${id}`,
    tailorData
  );

  return response.data;
};

export const addStitchingRate = async (
  tailorId,
  rateData
) => {
  const response = await api.post(
    `/tailors/${tailorId}/rates`,
    rateData
  );

  return response.data;
};

export const updateStitchingRate = async (
  tailorId,
  rateId,
  rateData
) => {
  const response = await api.put(
    `/tailors/${tailorId}/rates/${rateId}`,
    rateData
  );

  return response.data;
};

export const deleteStitchingRate = async (
  tailorId,
  rateId
) => {
  const response = await api.delete(
    `/tailors/${tailorId}/rates/${rateId}`
  );

  return response.data;
};

export const toggleTailorStatus = async (id) => {
  const response = await api.patch(
    `/tailors/${id}/status`
  );

  return response.data;
};

export const removeTailor = async (id) => {
  const response = await api.delete(
    `/tailors/${id}`
  );

  return response.data;
};