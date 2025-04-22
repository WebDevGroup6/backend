import { supabase } from "../config/database.js";

// Define the table name and primary key based on database.sql
const TABLE_NAME = "proveedor";
const PRIMARY_KEY = "id_proveedor";

// Get all suppliers
export const getAllProveedores = async (req, res) => {
  try {
    // Potentially add filtering/pagination based on query params later
    const { data, error } = await supabase.from(TABLE_NAME).select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res
      .status(500)
      .json({ message: "Error fetching suppliers", error: error.message });
  }
};

// Get a single supplier by ID
export const getProveedorById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq(PRIMARY_KEY, id)
      .single(); // Use single() as id_proveedor is the primary key

    if (error) {
      // Handle case where supplier is not found
      if (error.code === "PGRST116" || !data) {
        // PGRST116: Row not found
        return res.status(404).json({ message: "Supplier not found" });
      }
      throw error; // Re-throw other errors
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching supplier ${id}:`, error);
    res
      .status(500)
      .json({ message: "Error fetching supplier", error: error.message });
  }
};

// Create a new supplier
export const createProveedor = async (req, res) => {
  console.log("Received request to create supplier. Body:", req.body);
  // Destructure expected fields from req.body based on database.sql
  const { rnc, nombre, direccion, id_municipio, contacto, estado } = req.body;

  // Basic validation (add more as needed based on NOT NULL constraints and RNC format)
  if (!rnc || !nombre || !direccion || !contacto) {
    console.error("Validation Error: Missing required fields", {
      rnc,
      nombre,
      direccion,
      contacto,
    });
    return res.status(400).json({
      message:
        "Missing required fields: rnc, nombre, direccion, and contacto are required.",
    });
  }

  // Validate RNC format (basic example, adjust regex if needed)
  const rncRegex = /^[0-9]{9}$/; // Assuming RNC is 9 digits
  if (!rncRegex.test(rnc)) {
    return res
      .status(400)
      .json({ message: "Invalid RNC format. Must be 9 digits." });
  }

  // Prepare data for Supabase, handling nulls for optional fields
  const proveedorDataToInsert = {
    rnc,
    nombre,
    direccion,
    id_municipio: id_municipio || null, // Optional foreign key
    contacto,
    estado: estado || "Activo", // Default state if not provided
  };

  console.log("Data prepared for Supabase:", proveedorDataToInsert);

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([proveedorDataToInsert])
      .select(); // Select the inserted data

    if (error) {
      console.error(
        "Supabase Error creating supplier:",
        JSON.stringify(error, null, 2)
      );
      // Handle potential unique constraint violation (e.g., on 'rnc')
      if (error.code === "23505") {
        // Unique violation code in PostgreSQL
        const message = error.message.includes("proveedor_rnc_key")
          ? "Error creating supplier: RNC already exists."
          : "Error creating supplier: A unique field constraint was violated.";
        return res.status(409).json({
          // 409 Conflict
          message: message,
          details: error.details,
          code: error.code,
        });
      }
      // Return a generic 500 error for other issues
      return res.status(500).json({
        message: "Error creating supplier",
        error: error.message,
        details: error.details,
        code: error.code,
      });
    }

    console.log("Supplier created successfully in Supabase:", data);
    // Supabase insert returns an array, take the first element
    res
      .status(201)
      .json({ message: "Supplier created successfully", proveedor: data[0] });
  } catch (error) {
    // Catch any unexpected errors during the process
    console.error("Unexpected error in createProveedor:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// Update an existing supplier
export const updateProveedor = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent updating the primary key
  delete updates[PRIMARY_KEY];
  // Optionally prevent updating RNC if it shouldn't be changed
  // delete updates.rnc;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  // Validate RNC format if it's being updated
  if (updates.rnc) {
    const rncRegex = /^[0-9]{9}$/;
    if (!rncRegex.test(updates.rnc)) {
      return res
        .status(400)
        .json({ message: "Invalid RNC format. Must be 9 digits." });
    }
  }

  // Ensure id_municipio is null if empty string or undefined, otherwise keep its value
  if (updates.id_municipio === "" || updates.id_municipio === undefined) {
    updates.id_municipio = null;
  }

  console.log(`Updating supplier ${id} with data:`, updates);

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq(PRIMARY_KEY, id)
      .select(); // Select the updated data

    if (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      // Handle potential unique constraint violation (e.g., on 'rnc')
      if (error.code === "23505") {
        // Unique violation code in PostgreSQL
        const message = error.message.includes("proveedor_rnc_key")
          ? "Error updating supplier: RNC already exists."
          : "Error updating supplier: A unique field constraint was violated.";
        return res.status(409).json({
          // 409 Conflict
          message: message,
          details: error.details,
          code: error.code,
        });
      }
      return res
        .status(500)
        .json({ message: "Error updating supplier", error: error.message });
    }

    // Check if the supplier was actually found and updated
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: `Supplier with ID ${id} not found or no changes applicable`,
      });
    }

    console.log(`Supplier ${id} updated successfully:`, data[0]);
    res
      .status(200)
      .json({ message: "Supplier updated successfully", proveedor: data[0] });
  } catch (error) {
    console.error("Unexpected error in updateProveedor:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// Delete a supplier
export const deleteProveedor = async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete supplier with ID: ${id}`);

  try {
    const { error, count } = await supabase
      .from(TABLE_NAME)
      .delete({ count: "exact" }) // Get the count of deleted rows
      .eq(PRIMARY_KEY, id);

    if (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      // Handle potential foreign key constraint errors (e.g., if supplier is referenced in 'factura' or 'muestra')
      if (error.code === "23503") {
        // Foreign key violation
        return res
          .status(409) // 409 Conflict
          .json({
            message:
              "Cannot delete supplier: It is referenced by other records (e.g., invoices, samples).",
            error: error.message,
          });
      }
      return res
        .status(500)
        .json({ message: "Error deleting supplier", error: error.message });
    }

    // Check if any row was actually deleted
    if (count === 0) {
      console.log(`Supplier with ID ${id} not found for deletion.`);
      return res
        .status(404)
        .json({ message: `Supplier with ID ${id} not found` });
    }

    console.log(`Supplier with ID ${id} deleted successfully.`);
    // Use 200 OK or 204 No Content for successful deletion
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Unexpected error in deleteProveedor:", error);
    res
      .status(500)
      .json({ message: "Unexpected server error", error: error.message });
  }
};

// --- Report Generation ---
// For now, the getAllProveedores function can be used to fetch data for reports.
// If more complex reporting logic is needed (e.g., specific formats, aggregations),
// a dedicated function like the one below could be created.

/*
export const getProveedoresReport = async (req, res) => {
  try {
    // Example: Fetch only active suppliers for a report
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("rnc, nombre, contacto, estado") // Select specific columns for the report
      .eq("estado", "Activo"); // Filter for active suppliers

    if (error) throw error;

    // You could format the data here if needed (e.g., CSV, specific JSON structure)
    res.json({ report_title: "Active Suppliers Report", data: data });

  } catch (error) {
    console.error("Error generating suppliers report:", error);
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};
*/
