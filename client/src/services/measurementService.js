const STORAGE_KEY = "miara_measurements";

export const getMeasurements = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getMeasurement = (phoneNumber) => {
  return (
    getMeasurements().find(
      (m) => m.phoneNumber === phoneNumber
    ) || null
  );
};

export const saveMeasurement = (measurement) => {
  const measurements = getMeasurements();

  const index = measurements.findIndex(
    (m) => m.phoneNumber === measurement.phoneNumber
  );

  if (index >= 0) {
    measurements[index] = measurement;
  } else {
    measurements.push(measurement);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(measurements)
  );
};

export const deleteMeasurement = (phoneNumber) => {
  const updated = getMeasurements().filter(
    (m) => m.phoneNumber !== phoneNumber
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};