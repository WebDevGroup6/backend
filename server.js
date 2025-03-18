export const apps = express();
require("dotenv").config();

const PORT = process.env.PORT;

apps.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
