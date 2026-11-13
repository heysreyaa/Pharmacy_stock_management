
const API_BASE_URL = "http://localhost:3000/medicines";

// Get all medicines
export const getMedicines = async () => {
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch medicines");
    }

    return await response.json();
  } catch (error) {
    console.error("Get medicines error:", error);
    throw error;
  }
};

// Get medicine by ID
export const getMedicineById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Medicine not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Get medicine error:", error);
    throw error;
  }
};

// Add new medicine
export const addMedicine = async (medicineData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicineData),
    });

    if (!response.ok) {
      throw new Error("Failed to add medicine");
    }

    return await response.json();
  } catch (error) {
    console.error("Add medicine error:", error);
    throw error;
  }
};

// Update existing medicine
export const updateMedicine = async (id, medicineData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicineData),
    });

    if (!response.ok) {
      throw new Error("Failed to update medicine");
    }

    return await response.json();
  } catch (error) {
    console.error("Update medicine error:", error);
    throw error;
  }
};

// Delete medicine
export const deleteMedicine = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete medicine");
    }

    return true;
  } catch (error) {
    console.error("Delete medicine error:", error);
    throw error;
  }
};

// Search medicines
export const searchMedicines = async (searchTerm) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?q=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error("Medicine search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Search medicine error:", error);
    throw error;
  }
};
