import { supabase } from "../config/database.js"; // Assuming Supabase client is exported

export const getAllEmployees = async (req, res) => {
  try {
    const { data, error } = await supabase.from("empleado").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("empleado")
      .select("*")
      .eq("id_empleado", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Employee not found" });
      }
      throw error;
    }
    if (!data) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  console.log("Received request to create employee. Body:", req.body); // Log incoming data

  const {
    cedula,
    nombre,
    cargo,
    contacto,
    estado,
    fecha_contratacion,
    salario,
  } = req.body;

  if (!cedula || !nombre || !cargo || !contacto) {
    console.error("Validation Error: Missing required fields", {
      cedula,
      nombre,
      cargo,
      contacto,
    }); // Log validation failure
    return res.status(400).json({
      message: "Missing required fields: cedula, nombre, cargo, contacto",
    });
  }

  // Prepare data for Supabase, ensuring types are correct (e.g., salario is number or null)
  const employeeDataToInsert = {
    cedula,
    nombre,
    cargo,
    contacto,
    estado: estado || "Activo", // Default state if not provided
    fecha_contratacion: fecha_contratacion || null, // Use null if empty
    salario:
      salario !== undefined && salario !== null && salario !== ""
        ? Number(salario)
        : null, // Convert to number or null
  };

  console.log("Data prepared for Supabase:", employeeDataToInsert); // Log data being sent to Supabase

  const { data, error } = await supabase
    .from("empleado")
    .insert([employeeDataToInsert]) // Use the prepared data
    .select();

  if (error) {
    console.error(
      "Supabase Error creating employee:",
      JSON.stringify(error, null, 2)
    ); // Log the full error object
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Error creating employee: Cedula might already exist.",
        details: error.details,
        code: error.code,
      });
    }
    // Return a generic 500 error but include more details from the Supabase error
    return res.status(500).json({
      message: "Error creating employee",
      error: error.message,
      details: error.details, // Include details if available
      code: error.code, // Include Supabase error code
    });
  }

  console.log("Employee created successfully in Supabase:", data); // Log success
  res
    .status(201)
    .json({ message: "Employee created successfully", employee: data[0] });
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  delete updates.id_empleado;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  const { data, error } = await supabase
    .from("empleado")
    .update(updates)
    .eq("id_empleado", id)
    .select();

  if (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "Error updating employee: Cedula might already exist for another employee.",
        details: error.details,
      });
    }
    return res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }

  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ message: `Employee with ID ${id} not found or no changes made` });
  }

  res
    .status(200)
    .json({ message: "Employee updated successfully", employee: data[0] });
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  const { error, count } = await supabase
    .from("empleado")
    .delete({ count: "exact" })
    .eq("id_empleado", id);

  if (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    return res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }

  if (count === 0) {
    return res
      .status(404)
      .json({ message: `Employee with ID ${id} not found` });
  }

  res
    .status(200)
    .json({ message: `Employee with ID ${id} deleted successfully` });
};
