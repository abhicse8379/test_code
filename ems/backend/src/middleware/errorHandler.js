// Catches Postgres unique-violation errors and anything else uncaught in a route.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Postgres unique_violation
  if (err.code === "23505") {
    return res.status(409).json({ error: "This record already exists (duplicate)." });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}

module.exports = errorHandler;
