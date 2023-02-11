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
import styles from "./PMEXperience.module.scss";

function PMEXperience() {
  let rowtables = [
    {
      heading: "Memory",
      row1: true,
      row2: false,
      row3: true,
      row4: false,
      row5: true,
      row6: false,
      row7: true,
      row8: false,
      row9: true,
      row10: true,
      row11: false,
      row12: true,
      row13: false,
      row14: true,
      row15: false,
      row16: true,
      row17: false,
      row18: true,
    },
    {
      heading: "Movement",
      row1: true,
      row2: false,
      row3: true,
      row4: false,
      row5: true,
      row6: false,
      row7: true,
      row8: false,
      row9: true,
      row10: true,
      row11: false,
      row12: true,
      row13: false,
      row14: true,
      row15: false,
      row16: true,
      row17: false,
      row18: true,
    },
    {
      heading: "Cognition",
      row1: true,
      row2: false,
      row3: true,
      row4: false,
      row5: true,
      row6: false,
      row7: true,
      row8: false,
      row9: true,
      row10: true,
      row11: false,
      row12: true,
      row13: false,
      row14: true,
      row15: false,
      row16: true,
      row17: false,
      row18: true,
    },
  ];

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

  // const TableRow = withStyles((theme) => ({
  // root: {
  // "&:nth-of-type(odd)": {
  // backgroundColor: theme.palette.action.hover
  // }
  // }
  // }))(TableRow);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell colSpan={3} className={styles.HeaderBottomBorder}>
              Platform
            </StyledTableCell>
            <StyledTableCell colSpan={3} className={styles.HeaderBottomBorder}>
              Protocol / Planning
            </StyledTableCell>
            <StyledTableCell colSpan={2} className={styles.HeaderBottomBorder}>
              Resourcing
            </StyledTableCell>
            <StyledTableCell colSpan={3} className={styles.HeaderBottomBorder}>
              Patient Relations
            </StyledTableCell>
            <StyledTableCell colSpan={4} className={styles.HeaderBottomBorder}>
              Data Collection
            </StyledTableCell>
            <StyledTableCell colSpan={3} className={styles.HeaderBottomBorder}>
              Safety and Quality
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell
              className={styles.HeaderColBorder}
            ></StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Drug-types
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Device-types
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Advanced Therapies
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Analyzing Plan
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Test ID
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Testing Frequency
            </StyledTableCell>

            <StyledTableCell className={styles.HeaderColBorder}>
              Staff
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Equipment
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Criteria
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Selecting
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Enrolling
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Planning
            </StyledTableCell>
            <StyledTableCell
              className={styles.HeaderColBorder}
              style={{ minWidth: "47px !important", padding: 7 }}
            >
              Measurement
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Evaluation
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Reporting
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Bias Mgmt
            </StyledTableCell>
            <StyledTableCell className={styles.HeaderColBorder}>
              Safety Standards
            </StyledTableCell>
            <StyledTableCell>DMC Support</StyledTableCell>
          </TableRow>
          {/* */}
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell colSpan={19} className={styles.SectionHeader}>
              CNS
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan={19} className={styles.subHeader}>
              Disease Types
            </StyledTableCell>
          </TableRow>
          {rowtables.map((row: any, i: number) => {
            return (
              <TableRow>
                <StyledTableCell>{row.heading}</StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row1} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row2} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row3} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row4} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row5} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row6} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row7} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row8} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row9} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row10} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row11} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row12} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row13} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row14} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row15} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row16} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row17} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row18} />{" "}
                </StyledTableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <StyledTableCell colSpan={19} className={styles.SectionHeader}>
              Ophthalmology
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan={19} className={styles.subHeader}>
              Disease Types
            </StyledTableCell>
          </TableRow>
          {rowtables.map((row: any, i: number) => {
            return (
              <TableRow>
                <StyledTableCell>{row.heading}</StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row1} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row2} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row3} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row4} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row5} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row6} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row7} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row8} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row9} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row10} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row11} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row12} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row13} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row14} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row15} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row16} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row17} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row18} />{" "}
                </StyledTableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <StyledTableCell colSpan={19} className={styles.SectionHeader}>
              Rare Disease
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan={19} className={styles.subHeader}>
              Disease Types
            </StyledTableCell>
          </TableRow>
          {rowtables.map((row: any, i: number) => {
            return (
              <TableRow>
                <StyledTableCell>{row.heading}</StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row1} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row2} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row3} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row4} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row5} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row6} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row7} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row8} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row9} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row10} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row11} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row12} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row13} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row14} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row15} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row16} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row17} />{" "}
                </StyledTableCell>
                <StyledTableCell>
                  <Checkbox color="primary" checked={row.row18} />{" "}
                </StyledTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default PMEXperience;
