import { supabase } from "../config/database.js";

// Define the table name and primary key based on database.sql
const TABLE_NAME = "producto";
const PRIMARY_KEY = "id_producto";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq(PRIMARY_KEY, id)
      .single(); // Use single() as id_producto is the primary key

    if (error) {
      // Handle case where product is not found
      if (error.code === "PGRST116" || !data) {
        // PGRST116: Row not found
        return res.status(404).json({ message: "Product not found" });
      }
      throw error; // Re-throw other errors
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  console.log("Received request to create product. Body:", req.body);
  // Destructure expected fields from req.body based on database.sql
  const {
    nombre,
    descripcion,
    tipo,
    fabricante,
    fecha_aprobacion,
    estado,
    fecha_vencimiento,
    lote,
    codigo_digemaps,
  } = req.body;

  // Basic validation (add more as needed based on NOT NULL constraints)
  if (!nombre || !tipo || !fabricante) {
    console.error("Validation Error: Missing required fields", {
      nombre,
      tipo,
      fabricante,
    });
    return res.status(400).json({
      message:
        "Missing required fields: nombre, tipo, and fabricante are required.",
    });
  }

  // Prepare data for Supabase, handling nulls for optional fields
  const productDataToInsert = {
    nombre,
    descripcion: descripcion || null,
    tipo,
    fabricante,
    fecha_aprobacion: fecha_aprobacion || null,
    estado: estado || "Activo", // Default state if not provided
    fecha_vencimiento: fecha_vencimiento || null,
    lote: lote || null,
    codigo_digemaps: codigo_digemaps || null,
  };

  console.log("Data prepared for Supabase:", productDataToInsert);

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([productDataToInsert])
      .select(); // Select the inserted data

    if (error) {
      console.error(
        "Supabase Error creating product:",
        JSON.stringify(error, null, 2)
      );
      // Handle potential unique constraint violation (e.g., on 'codigo_digemaps')
      if (error.code === "23505") {
        // Unique violation code in PostgreSQL
        // Check if the violation is on codigo_digemaps_key or another unique constraint
        const isDigemapsUnique = error.message.includes(
          "producto_codigo_digemaps_key"
        );
        const message = isDigemapsUnique
          ? "Error creating product: Código Digemaps might already exist."
          : "Error creating product: A unique field constraint was violated.";

        return res.status(409).json({
          message: message,
          details: error.details,
          code: error.code,
        });
      }
      // Return a generic 500 error for other issues
      return res.status(500).json({
        message: "Error creating product",
        error: error.message,
        details: error.details,
        code: error.code,
      });
    }

    console.log("Product created successfully in Supabase:", data);
    // Supabase insert returns an array, take the first element
    res
      .status(201)
      .json({ message: "Product created successfully", product: data[0] });
  } catch (error) {
    // Catch any unexpected errors during the process
    console.error("Unexpected error in createProduct:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent updating the primary key
  delete updates[PRIMARY_KEY];

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  // Ensure optional date fields are null if empty strings are passed
  if (updates.fecha_aprobacion === "") updates.fecha_aprobacion = null;
  if (updates.fecha_vencimiento === "") updates.fecha_vencimiento = null;
  // Add similar checks for other optional fields if needed

  console.log(`Updating product ${id} with data:`, updates);

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq(PRIMARY_KEY, id)
      .select(); // Select the updated data

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      // Handle potential unique constraint violations if any updatable field must be unique
      if (error.code === "23505") {
        const isDigemapsUnique = error.message.includes(
          "producto_codigo_digemaps_key"
        );
        const message = isDigemapsUnique
          ? "Error updating product: Código Digemaps might already exist for another product."
          : "Error updating product: A unique field constraint was violated.";
        return res.status(409).json({
          message: message,
          details: error.details,
          code: error.code,
        });
      }
      return res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }

    // Check if the product was actually found and updated
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          message: `Product with ID ${id} not found or no changes made`,
        });
    }

    console.log(`Product ${id} updated successfully:`, data[0]);
    res
      .status(200)
      .json({ message: "Product updated successfully", product: data[0] });
  } catch (error) {
    console.error("Unexpected error in updateProduct:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete product with ID: ${id}`);

  try {
    const { error, count } = await supabase
      .from(TABLE_NAME)
      .delete({ count: "exact" }) // Get the count of deleted rows
      .eq(PRIMARY_KEY, id);

    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      // Handle potential foreign key constraint errors if needed (e.g., if product is referenced in 'muestra')
      // if (error.code === '23503') { ... }
      return res
        .status(500)
        .json({ message: "Error deleting product", error: error.message });
    }

    // Check if any row was actually deleted
    if (count === 0) {
      console.log(`Product with ID ${id} not found for deletion.`);
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    console.log(`Product with ID ${id} deleted successfully.`);
    // Send a 200 OK status code with a success message
    res
      .status(200) // Changed from 204 to 200 to include a message body
      .json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Unexpected error in deleteProduct:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};
