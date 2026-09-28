// About's top project rows post as parallel lists under these names, and the action reads them back
// with `getAll`, which returns them in document order — the order the rows are shown in.
//
// A plain module on purpose: the field is a client component and the reader is a server action, and a
// constant exported from a "use client" file reaches the server as a reference rather than a value.
export const TOP_PROJECT_FIELD_NAMES = {
  name: "topProjectName",
  description: "topProjectDescription",
  url: "topProjectUrl",
} as const;

/** The rows as submitted. A row left completely blank is dropped rather than failing as "required". */
export function readTopProjects(formData: FormData) {
  const names = formData.getAll(TOP_PROJECT_FIELD_NAMES.name).map(String);
  const descriptions = formData.getAll(TOP_PROJECT_FIELD_NAMES.description).map(String);
  const urls = formData.getAll(TOP_PROJECT_FIELD_NAMES.url).map(String);

  return names
    .map((name, index) => ({
      name,
      description: descriptions[index] ?? "",
      url: urls[index] ?? "",
    }))
    .filter((row) => [row.name, row.description, row.url].some((value) => value.trim() !== ""));
}
