Place your certificate template PDF here, e.g.:

  certificate-template.pdf

Design it in any tool (Canva, PowerPoint export-to-PDF, Photoshop, etc.) as a
single-page PDF with blank space where the student's name, event title, and
date should go.

Then find the x/y coordinates (in PDF points, origin at bottom-left of the
page) where each field should be drawn, and update the corresponding row in
the certificate_templates table (name_x/name_y, event_x/event_y, date_x/date_y,
font_size). The seed script (src/db/seedAdmin.js) creates a starting row with
placeholder coordinates — you will need to adjust them by trial and error:
generate one certificate, open the PDF, see where the text landed, adjust,
repeat.

This is intentionally a fixed-coordinate fill (pdf-lib), not a template
designer UI — see SRS section 7, "Open Items for Next Iteration" for why
that's out of scope for v1.
