import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  table: { width: "100%" },
});

export default function LogDetailsTable(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const rows = props.data;

  return (
    <TableContainer
    >
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 30 }}>Spell</TableCell>
            <TableCell align="right" style={{ width: 20, paddingRight: 8 }}>
              Casts
            </TableCell>
            <TableCell align="right" style={{ width: 20, paddingRight: 8 }}>
              Healing
            </TableCell>
            <TableCell align="right" style={{ width: 30, paddingRight: 8 }}>
              HPS
            </TableCell>
            <TableCell align="right" style={{ width: 30, paddingRight: 8 }}>
              Overhealing
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.getOwnPropertyNames(rows).map((row) => (
            <TableRow key={row}>
              <TableCell
                component="th"
                scope="row"
                style={{
                  whiteSpace: "nowrap",
                  display: "table-cell",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    verticalAlign: "middle",
                    marginRight: -4,
                  }}
                >
                  <a data-wowhead={"spell=" + row}>
                    <img height={16} width={16} style={{ marginRight: 4 }} />
                  </a>
                  {t("SpellNames." + row)}
                </div>
              </TableCell>
              <TableCell align="right" style={{ paddingRight: 8 }}>
                {rows[row].casts}
              </TableCell>
              <TableCell align="right" style={{ paddingRight: 8 }}>
                {rows[row].healing}
              </TableCell>
              <TableCell align="right" style={{ paddingRight: 8 }}>
                {rows[row].hps}
              </TableCell>
              <TableCell align="right" style={{ paddingRight: 8 }}>
                {rows[row].overhealing}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}