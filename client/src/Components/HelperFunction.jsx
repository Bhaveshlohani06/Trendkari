const shouldShowWhatsappPopup = () => {
  const today = new Date().toISOString().split("T")[0];
  const lastShown = localStorage.removeItem("whatsapp_popup_last_shown");
  return lastShown !== today;
};

export { shouldShowWhatsappPopup };
  