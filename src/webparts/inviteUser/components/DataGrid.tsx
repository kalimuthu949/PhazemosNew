import * as React from "react";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import classes from "./App.module.scss";

import DoneIcon from "@material-ui/icons/Done";
import { Link } from "@material-ui/core";

import CommonService from "../services/CommonService";
import {
  CollapseAllVisibility,
  Persona,
  PersonaSize,
} from "office-ui-fabric-react";

export interface IDataGrid {
  render: any;
  EditRecord: any;
}

// Styles for the Table
const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});
const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.primary.main,
    // color: theme.palette.common.white,
    background: "rgb(0,88,154) ",
    color: "#fff",
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

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

// Styles for the Table
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export const DataGrid: React.FunctionComponent<IDataGrid> = (
  props: IDataGrid
) => {
  var _commonService: CommonService = new CommonService();
  const _userDetails: string = "User Details";

  const [companyDetails, setCompanyDetails] = useState([]);

  function init() {
    _commonService = new CommonService();
    let customProperty = {
      listName: _userDetails,
      properties: "*,CompanyID/Title,CompanyID/CompanyID,Author/Title",
      expand: "CompanyID,Author",
    };
    _commonService.getList(customProperty, (res: any) => {
      setCompanyDetails([...res]);
    });
  }

  useEffect((): any => {
    init();
  }, [props.render]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Company Name</StyledTableCell>
            <StyledTableCell>Company Code</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Invite Accepted</StyledTableCell>
            <StyledTableCell>Created By</StyledTableCell>
            <StyledTableCell>Created Date</StyledTableCell>
            {/* <StyledTableCell>Action</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {companyDetails.map((company) => (
            <StyledTableRow key={company.CompanyID.CompanyID}>
              <StyledTableCell
                component="th"
                scope="row"
                style={{ fontWeight: 600 }}
              >
                <Link
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(e) => props.EditRecord(company)}
                >
                  {company.CompanyID.Title}
                </Link>
              </StyledTableCell>
              <StyledTableCell>{company.CompanyID.CompanyID}</StyledTableCell>
              <StyledTableCell>{company.UserEmailID}</StyledTableCell>

              <StyledTableCell>
                {company.IsInviteAccepted ? (
                  <DoneIcon
                    style={{
                      cursor: "pointer",
                      fontSize: 32,
                      color: theme.palette.success.main,
                    }}
                  />
                ) : (
                  <ClearIcon
                    style={{
                      cursor: "pointer",
                      fontSize: 32,
                      color: theme.palette.error.main,
                    }}
                  />
                )}
              </StyledTableCell>

              <StyledTableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* <Persona
                    styles={{
                      root: {
                        width: 32,
                        margin: "0 10px 0 0",
                        objectFit:'cover'
                      },
                    }}
                    imageUrl={
                      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      // value.Assignee
                    }
                    size={PersonaSize.size32}
                  /> */}
                  <p>{company.Author.Title}</p>
                </div>
              </StyledTableCell>
              <StyledTableCell>
                {_commonService.formattedDate(new Date(company.Created))}
              </StyledTableCell>

              {/* <StyledTableCell>
                <EditIcon
                  style={{ color: theme.palette.primary.main, fontSize: 32 }}
                  onClick={(e) => props.EditRecord(company)}
                />
              </StyledTableCell> */}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
