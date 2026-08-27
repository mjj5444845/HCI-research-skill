# Paper page records

Store one UTF-8 JSON file per accepted paper in this directory. The filename and `slug` should use the same stable, URL-safe identifier. The site build turns every record into `papers/<slug>/index.html`.

Do not create placeholder papers. Metadata-only records must set `access_status` accordingly and must not claim inaccessible methods or findings.

Required fields are defined in `schemas/paper-page.schema.json`. Use empty arrays or explicit uncertainty rather than invented details.
