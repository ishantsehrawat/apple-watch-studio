export const fetchAppleProductData = async (queryParams) => {
  const BASE_URL = "https://www.apple.com/shop/studio-data";

  try {
    const url = new URL(BASE_URL);
    // Merge defaultParams with queryParams (for flexibility)
    const params = { ...queryParams };
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Apple product data:", error);
    throw error;
  }
};
