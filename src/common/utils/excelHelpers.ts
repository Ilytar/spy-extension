import * as XLSX from "xlsx";

export function createWorkbook(data: unknown[][]) {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet");

  return workbook;
}

export function downloadWorkbook(
  workbook: XLSX.WorkBook,
  title: string = "Excel"
) {
  XLSX.writeFile(workbook, `${title}.xlsx`);
}

export function generateFileName() {
  return (
    new Date().toLocaleDateString() +
    "_" +
    new Date().toLocaleTimeString()
  )
    .replaceAll(".", "_")
    .replaceAll(":", "_");
}
