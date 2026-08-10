const { parse } = require("csv-parse/sync");

// Expects a CSV with a header row containing a `student_id` column.
// Extra columns are ignored. Returns a de-duplicated (within-file) array of IDs.
function parseStudentIdsFromCsv(buffer) {
  const records = parse(buffer, { columns: true, skip_empty_lines: true, trim: true });

  const ids = records
    .map((row) => row.student_id || row.Student_ID || row.StudentID)
    .filter(Boolean);

  if (ids.length === 0) {
    throw new Error("No student_id column found (or file is empty). Expected a header named 'student_id'.");
  }

  return [...new Set(ids)];
}

module.exports = { parseStudentIdsFromCsv };
