/**
 * Punto de entrada serverless de Vercel.
 * Requiere `npm run build` (genera `dist/`) y `includeFiles: dist/**` en vercel.json.
 */
const { getVercelHandler } = require('../dist/vercel-factory');

module.exports = async (req, res) => {
  const handle = await getVercelHandler();
  return handle(req, res);
};
