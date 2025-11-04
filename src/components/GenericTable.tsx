

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";

interface Action {
  name: string;
  label: string;
  color?: "primary" | "secondary" | "error";
}

interface GenericTableProps {
  data: Record<string, any>[];
  columns: string[];
  actions: Action[];
  onAction: (name: string, item: Record<string, any>) => void;
  styleType?: "material" | "bootstrap" | "tailwind";
}

const GenericTable: React.FC<GenericTableProps> = ({
  data,
  columns,
  actions,
  onAction,
  styleType = "material",
}) => {
  if (!Array.isArray(data)) return null;

  if (styleType === "bootstrap") {
    return (
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              {columns.map((col) => (
                <th key={col}>{col.toUpperCase()}</th>
              ))}
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{item[col]}</td>
                ))}
                <td>
                  {actions.map((action) => (
                    <button
                      key={action.name}
                      className={`btn btn-${action.color || "primary"} btn-sm me-2`}
                      onClick={() => onAction(action.name, item)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (styleType === "tailwind") {
    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {col.toUpperCase()}
                </th>
              ))}
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-sm text-gray-800">
                    {item[col]}
                  </td>
                ))}
                <td className="px-4 py-2">
                  {actions.map((action) => (
                    <button
                      key={action.name}
                      className={`px-2 py-1 text-sm rounded bg-${action.color || "blue"}-500 text-white mr-2`}
                      onClick={() => onAction(action.name, item)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default: Material UI
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: "bold" }}>
                {col.toUpperCase()}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: "bold" }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col}>{item[col]}</TableCell>
              ))}
              <TableCell>
                {actions.map((action) => (
                  <Button
                    key={action.name}
                    variant="outlined"
                    color={action.color || "primary"}
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => onAction(action.name, item)}
                  >
                    {action.label}
                  </Button>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
