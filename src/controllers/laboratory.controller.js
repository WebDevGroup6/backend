import { supabase } from "../config/database.js";

// Define the table name and primary key based on database.sql
const TABLE_NAME = "laboratorio";
const PRIMARY_KEY = "id_laboratorio";

// Get all laboratories
export const getAllLaboratories = async (req, res) => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching laboratories:", error);
    res
      .status(500)
      .json({ message: "Error fetching laboratories", error: error.message });
  }
};

// Get a single laboratory by ID
export const getLaboratoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq(PRIMARY_KEY, id)
      .single(); // Use single() as id_laboratorio is the primary key

    if (error) {
      // Handle case where laboratory is not found
      if (error.code === "PGRST116" || !data) {
        // PGRST116: Row not found
        return res.status(404).json({ message: "Laboratory not found" });
      }
      throw error; // Re-throw other errors
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching laboratory ${id}:`, error);
    res
      .status(500)
      .json({ message: "Error fetching laboratory", error: error.message });
  }
};

// Create a new laboratory
export const createLaboratory = async (req, res) => {
  console.log("Received request to create laboratory. Body:", req.body);
  // Destructure expected fields from req.body based on database.sql
  const { nombre, direccion, contacto, estado, capacidad, horario_atencion } =
    req.body;

  // Basic validation (add more as needed based on NOT NULL constraints)
  if (!nombre || !direccion || !contacto) {
    console.error("Validation Error: Missing required fields", {
      nombre,
      direccion,
      contacto,
    });
    return res.status(400).json({
      message:
        "Missing required fields: nombre, direccion, and contacto are required.",
    });
  }

  // Prepare data for Supabase, handling nulls for optional fields
  const labDataToInsert = {
    nombre,
    direccion,
    contacto,
    estado: estado || "Activo", // Default state if not provided
    capacidad:
      capacidad !== undefined && capacidad !== null && capacidad !== ""
        ? Number(capacidad)
        : null, // Convert to number or null
    horario_atencion: horario_atencion || null,
  };

  console.log("Data prepared for Supabase:", labDataToInsert);

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([labDataToInsert])
      .select(); // Select the inserted data

    if (error) {
      console.error(
        "Supabase Error creating laboratory:",
        JSON.stringify(error, null, 2)
      );
      // Handle potential unique constraint violation (e.g., if 'nombre' must be unique, though not specified in schema)
      // if (error.code === "23505") { ... }
      return res.status(500).json({
        message: "Error creating laboratory",
        error: error.message,
        details: error.details,
        code: error.code,
      });
    }

    console.log("Laboratory created successfully in Supabase:", data);
    // Supabase insert returns an array, take the first element
    res
      .status(201)
      .json({
        message: "Laboratory created successfully",
        laboratory: data[0],
      });
  } catch (error) {
    // Catch any unexpected errors during the process
    console.error("Unexpected error in createLaboratory:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// Update an existing laboratory
export const updateLaboratory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent updating the primary key
  delete updates[PRIMARY_KEY];

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  // Ensure optional numeric fields are null or number
  if (
    updates.capacidad !== undefined &&
    updates.capacidad !== null &&
    updates.capacidad !== ""
  ) {
    updates.capacidad = Number(updates.capacidad);
  } else if (updates.capacidad === "") {
    updates.capacidad = null;
  }

  console.log(`Updating laboratory ${id} with data:`, updates);

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq(PRIMARY_KEY, id)
      .select(); // Select the updated data

    if (error) {
      console.error(`Error updating laboratory with ID ${id}:`, error);
      // Handle potential unique constraint violations if any updatable field must be unique
      // if (error.code === "23505") { ... }
      return res
        .status(500)
        .json({ message: "Error updating laboratory", error: error.message });
    }

    // Check if the laboratory was actually found and updated
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: `Laboratory with ID ${id} not found or no changes made`,
      });
    }

    console.log(`Laboratory ${id} updated successfully:`, data[0]);
    res
      .status(200)
      .json({
        message: "Laboratory updated successfully",
        laboratory: data[0],
      });
  } catch (error) {
    console.error("Unexpected error in updateLaboratory:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// Delete a laboratory
export const deleteLaboratory = async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete laboratory with ID: ${id}`);

  try {
    const { error, count } = await supabase
      .from(TABLE_NAME)
      .delete({ count: "exact" }) // Get the count of deleted rows
      .eq(PRIMARY_KEY, id);

    if (error) {
      console.error(`Error deleting laboratory with ID ${id}:`, error);
      // Handle potential foreign key constraint errors (e.g., if laboratory is referenced in 'resultados' or 'laboratorio_prueba')
      if (error.code === "23503") {
        return res
          .status(409)
          .json({
            message:
              "Cannot delete laboratory: It is referenced by other records (e.g., results, tests).",
            error: error.message,
          });
      }
      return res
        .status(500)
        .json({ message: "Error deleting laboratory", error: error.message });
    }

    // Check if any row was actually deleted
    if (count === 0) {
      console.log(`Laboratory with ID ${id} not found for deletion.`);
      return res
        .status(404)
        .json({ message: `Laboratory with ID ${id} not found` });
    }

    console.log(`Laboratory with ID ${id} deleted successfully.`);
    res.status(200).json({ message: "Laboratory deleted successfully" });
  } catch (error) {
    console.error("Unexpected error in deleteLaboratory:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};
