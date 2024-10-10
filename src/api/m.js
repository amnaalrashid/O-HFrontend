import instance from ".";

export const generateMealPlan = async (mealPlanData) => {
  try {
    const { data } = await instance.post("/meal/generate", mealPlanData);
    return data;
  } catch (error) {
    console.error(
      "Error generating meal plan:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getMealPlan = async () => {
  try {
    const { data } = await instance.get("/meal");
    return data;
  } catch (error) {
    console.error(
      "Error fetching meal plan:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateMealPlan = async ({ id, meals }) => {
  try {
    const { data } = await instance.put(`/meal/${id}`, { meals });
    return data;
  } catch (error) {
    console.error(
      "Error updating meal plan:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteMealPlan = async (id) => {
  try {
    const { data } = await instance.delete(`/meal/${id}`);
    return data;
  } catch (error) {
    console.error(
      "Error deleting meal plan:",
      error.response?.data || error.message
    );
    throw error;
  }
};
