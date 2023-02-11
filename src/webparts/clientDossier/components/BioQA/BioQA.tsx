import * as React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Checkbox } from "@material-ui/core";
import styles from "../PMEXperience.module.scss";
import { useState, useEffect, useRef } from "react";
import CommonService from "../../services/CommonService";
import { CustomAlert } from "../CustomAlert";

export interface IBioQuals {
  CompanyName: string;
  CompanyCode: string;
  CompanyID: string;
}

interface IItems {
  Design: boolean;
  Qualification: boolean;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.primary.main,
    // color: theme.palette.common.white,
    background: "#d3e5f4",
    color: "#00589A",
    fontSize: 16,
    fontWeight: 600,
    minWidth: "82px !important",
    maxWidth: "100px !important",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
  },
  body: {
    fontSize: 15,
    color: "#303133",
    padding: "5px 15px",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BioQA(props: IBioQuals) {
  var _commonService: any = {};
  var _bioQualsMeasureMaster = "QB Measurable Characteristics Master";
  var _bioQualsMapping = "BioMarkers";

  let rowItems: IItems[] = [
    {
      Design: false,
      Qualification: false,
    },
  ];

  let rowtables = [
    {
      heading: "Memory",
      items: rowItems,
      ID: "",
    },
  ];

  const [qaCharacteristicsItems, setqaCharacteristicsItems] = useState([]);

  function loadBioQualsMeasureMaster() {
    let customProperty = {
      listName: _bioQualsMeasureMaster,
      properties: "ID,Title,IsActive",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customProperty, (res: any[]) => {
      let bioQualsMeasuresables = [];
      console.log(res);
      for (let index = 0; index < res.length; index++) {}
    });
  }

  function loadBioQualsMeasures() {
    let customProperty = {
      listName: _bioQualsMapping,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        console.log(res);
      } else {
        loadBioQualsMeasureMaster();
      }
    });
  }

  function init() {
    loadBioQualsMeasures();
  }

  useEffect(() => {
    _commonService = new CommonService();
    init();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={11} className={styles.SectionHeader}>
              Experience
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Bio Marker</StyledTableCell>
            <StyledTableCell colSpan={1} className={styles.HeaderBottomBorder}>
              Design
            </StyledTableCell>
            <StyledTableCell colSpan={1} className={styles.HeaderBottomBorder}>
              Qualification
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowtables.map((row: any, i: number) => {
            return (
              <TableRow>
                <StyledTableCell>{row.heading}</StyledTableCell>
                {row.items.map((column: IItems, i: number) => {
                  return (
                    <>
                      <StyledTableCell>
                        <Checkbox color="primary" checked={column.Design} />{" "}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Checkbox
                          color="primary"
                          checked={column.Qualification}
                        />{" "}
                      </StyledTableCell>
                    </>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
