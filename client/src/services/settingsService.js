const STORAGE_KEY = "miara_settings";

const defaultSettings = {
  shopName: "Miara Designer House",
  ownerName: "Raman",
  phone: "",
  address: "",
  maxOrdersPerDay: 20,
  theme: "light",
  nextOrderNumber: "",
};

export const getSettings = () => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );
    return defaultSettings;
  }

  const parsed = JSON.parse(data);
  return { ...defaultSettings, ...parsed };
};

export const saveSettings = (settings) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );
};