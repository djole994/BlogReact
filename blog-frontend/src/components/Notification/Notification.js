export const getNotificationsForUser = async (userId) => {
    const response = await fetch(`http://localhost:5050/api/notifications/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (!response.ok) {
      const text = await response.text(); 
      console.error("Server response:", text); 
      throw new Error("Greška pri dohvaćanju notifikacija");
    }
    return await response.json();
  };
  