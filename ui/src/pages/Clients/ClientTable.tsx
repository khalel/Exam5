import {
  Paper
  , TableContainer
  , Table
  , TableHead
  , TableBody
  , TableRow
  , TableCell
} from "@mui/material";
import ClientRow from "./ClientRow";

export default function BasicTable({ clients }: { clients: IClient[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Phone</b></TableCell>
            <TableCell><b>Email</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <ClientRow key={client.id} client={client} />
          ))}
          {!clients ||
            (!clients.length && (
              <TableRow sx={{ padding: 3 }}>
                <TableCell component="th" scope="row">
                  No clients
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
