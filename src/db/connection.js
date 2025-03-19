import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
<<<<<<< HEAD
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones a Supabase o servicios cloud
  },
=======
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necesario para conexiones a Supabase o servicios cloud
    }
>>>>>>> 09f353eb0751f506c869b041237a132c694c46af
});

export default pool;
