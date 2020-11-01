import React, { forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import SaveAlt from "@material-ui/icons/SaveAlt";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import moment from "moment";
import { localizationFR } from "../../../locale/fr/TableLocale";
import { localizationEN } from "../../../locale/en/TableLocale";
import { localizationRU } from "../../../locale/ru/TableLocale";
import { localizationCH } from "../../../locale/ch/TableLocale";
import { useTranslation } from "react-i18next";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      // regular: {
      //   padding: "0px 8px 0px 8px",
      // },
      root: {
        padding: "4px 4px 4px 4px",
      },
    },
    MuiIconButton: {
      root: {
        padding: "4px",
      },
    },
    MuiToolbar: {
      regular: {
        minHeight: 0,
        "@media (min-width: 600px)": {
          minHeight: "0px",
        },
      },
      root: {
        padding: "4px 4px 4px 4px",
        color: "#c8b054",
      },
    },
  },
  palette: {
    type: "dark",
    primary: { main: "#d3bc47" },
    secondary: { main: "#e0e0e0" },
  },
});

const tableIcons = {
  Export: forwardRef((props, ref) => (
    <SaveAlt {...props} style={{ color: "#ffee77" }} ref={ref} />
  )),
  SortArrow: forwardRef((props, ref) => (
    <ArrowDownward {...props} style={{ color: "#ffee77" }} ref={ref} />
  )),
};

let curLang = (lang) => {
  if (lang === "en") {
    return localizationEN;
  } else if (lang === "ru") {
    return localizationRU;
  } else if (lang === "ch") {
    return localizationCH;
  } else if (lang === "fr") {
    return localizationFR;
  }
};

export default function ERTTable(props) {
  const { t } = useTranslation();
  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: "Sort by Time",
            field: "ert",
            cellStyle: {
              whiteSpace: "nowrap",
              paddingLeft: 8,
            },
          },
          {
            title: "Time",
            field: "time",
            hidden: true,
            customSort: (a, b) =>
              moment(a, "mm:ss").milliseconds() -
              moment(b, "mm:ss").milliseconds(),
          },
        ]}
        title="ERT Note"
        header={true}
        data={props.data}
        style={{
          borderRadius: 4,
          whiteSpace: "nowrap",
          padding: 10,
        }}
        localization={curLang(props.curLang)}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div style={{ marginBottom: 8 }}>
              <MTableToolbar {...props} />
              <Divider />
            </div>
          ),
        }}
        options={{
          padding: "dense",
          toolbar: true,
          header: true,
          search: false,
          headerStyle: {
            border: "1px solid #c8b054",
            padding: "0px 8px 0px 8px",
            backgroundColor: "#c8b054",
            color: "#000",
          },
          rowStyle: (rowData, index) => {
            if (index % 2) {
              return {
                backgroundColor: "#535353",
                border: "1px solid #515151",
              };
            } else {
              return {
                border: "1px solid #515151",
              };
            }
          },
          searchFieldStyle: {
            borderBottom: "1px solid #515151",
            color: "#ffffff",
          },
          actionCellStyle: {
            borderBottom: "1px solid #515151",
          },
          actionsCellStyle: {
            borderBottom: "1px solid #6d6d6d",
            padding: 0,
          },
          actionsColumnIndex: 6,
          paging: false,
        }}
      />
    </ThemeProvider>
  );
}