import { VerificationOfMeasuringInstrument } from "@common/storage/types/verificationOfMeasuringInstrument";
import { createMRTColumnHelper } from "material-react-table";

const columnHelper = createMRTColumnHelper<VerificationOfMeasuringInstrument>();

export const VerificationResultsTableColumns = [
  columnHelper.accessor("author", {
    header: "Автор",
  }),
  columnHelper.accessor("documentTitle", {
    header: "Документ",
  }),
  columnHelper.accessor("mitypeNumber", {
    header: "Номер типа Си",
  }),
  columnHelper.accessor("mitypeTitle", {
    header: "Тип СИ",
  }),
  columnHelper.accessor("verificationDate", {
    header: "Дата поверки",
  }),
];
