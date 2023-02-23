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
import styles from "./InHouseTools.module.scss";
import { useState, useEffect, useRef } from "react";
import CommonService from "../../services/CommonService";
import { Button } from "@material-ui/core";
import { CustomAlert } from "../CustomAlert";
import TextField from "@material-ui/core/TextField";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

export interface IProps {
  CompanyName: string;
  CompanyCode: string;
  CompanyID: string;
}

interface IRowData {
  heading: string;
  masterID: number;
  mappingID: number;

  ProcessInnovation: boolean;
  HighTouchDeliveryModel: boolean;
  TechnologySolution: boolean;
  EndtoEndPlatform: boolean;

  isvalid: boolean;
}
interface IHeading {
  text: string;
  key: string;
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});

let isUpdated: boolean = false;

export const InHouseTools = (props: IProps): JSX.Element => {
  let _commonService: any = {};
  let _inHouseToolsMaster = "In House Tools Master";
  let _inHouseToolsMapping = "In House Tools Mapping";

  const tableHeadings: IHeading[] = [
    {
      text: "Process Innovation",
      key: "ProcessInnovation",
    },
    {
      text: "High-touch Delivery Model",
      key: "HighTouchDeliveryModel",
    },
    {
      text: "Technology Solution",
      key: "TechnologySolution",
    },
    {
      text: "End-to-End Platform",
      key: "EndtoEndPlatform",
    },
  ];

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });
  const [inHouseToolsMaster, setInHouseToolsMaster] = useState<IRowData[]>([]);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const loadInHouseToolsMaster = (): void => {
    let customProperty = {
      listName: _inHouseToolsMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customProperty, (res: any[]) => {
      let bioQualsMeasureMaster: IRowData[] = [];
      for (let index = 0; index < res.length; index++) {
        bioQualsMeasureMaster.push({
          heading: res[index].Title,
          masterID: res[index].ID,
          mappingID: null,

          ProcessInnovation: false,
          HighTouchDeliveryModel: false,
          TechnologySolution: false,
          EndtoEndPlatform: false,

          isvalid: false,
        });
      }

      loadInHouseToolsMapping(bioQualsMeasureMaster);
    });
  };

  const loadInHouseToolsMapping = (masterData: IRowData[]): void => {
    let customProperty = {
      listName: _inHouseToolsMapping,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let targetIndex = masterData.findIndex(
            (_data) => _data.masterID == res[i].InHouseToolsMasterId
          );

          if (targetIndex != -1) {
            masterData[targetIndex].mappingID = res[i].ID;

            for (let j = 0; j < tableHeadings.length; j++) {
              masterData[targetIndex][tableHeadings[j].key] =
                res[i][tableHeadings[j].key];
            }
          }
        }
        setInHouseToolsMaster([...masterData]);
      } else {
        setInHouseToolsMaster([...masterData]);
      }
    });
  };

  const handler = (value: boolean, key: string, index: number): void => {
    let _tempData: IRowData[] = [...inHouseToolsMaster];

    _tempData[index][key] = value;

    _tempData[index].isvalid =
      _tempData[index].mappingID != null ||
      _tempData[index].ProcessInnovation ||
      _tempData[index].HighTouchDeliveryModel ||
      _tempData[index].TechnologySolution ||
      _tempData[index].EndtoEndPlatform
        ? true
        : false;

    setInHouseToolsMaster([..._tempData]);
  };

  const submitData = (): void => {
    _commonService = new CommonService();
    let processCount: number = 0;

    let resData: IRowData[] = [...inHouseToolsMaster];

    if (
      resData &&
      resData.length &&
      resData.filter((_d) => _d.isvalid).length > 0
    ) {
      for (let i = 0; i < resData.length; i++) {
        if (resData[i].isvalid) {
          if (resData[i].mappingID != null) {
            let respones = {
              ProcessInnovation: resData[i].ProcessInnovation,
              HighTouchDeliveryModel: resData[i].HighTouchDeliveryModel,
              TechnologySolution: resData[i].TechnologySolution,
              EndtoEndPlatform: resData[i].EndtoEndPlatform,
            };
            _commonService.updateList(
              {
                listName: _inHouseToolsMapping,
                ID: resData[i].mappingID,
              },
              respones,
              (res: any) => {
                isUpdated = true;
                processCount++;
                if (processCount == resData.filter((_d) => _d.isvalid).length) {
                  setAlert({
                    open: true,
                    severity: "success",
                    message: isUpdated
                      ? "Updated successfully"
                      : "Created successfully",
                  });
                  init();
                }
              }
            );
          } else {
            let respones = {
              CompanyIDId: props.CompanyID,
              InHouseToolsMasterId: resData[i].masterID,
              ProcessInnovation: resData[i].ProcessInnovation,
              HighTouchDeliveryModel: resData[i].HighTouchDeliveryModel,
              TechnologySolution: resData[i].TechnologySolution,
              EndtoEndPlatform: resData[i].EndtoEndPlatform,
            };
            _commonService.insertIntoList(
              {
                listName: _inHouseToolsMapping,
              },
              respones,
              (res: any) => {
                processCount++;
                if (processCount == resData.filter((_d) => _d.isvalid).length) {
                  setAlert({
                    open: true,
                    severity: "success",
                    message: isUpdated
                      ? "Updated successfully"
                      : "Created successfully",
                  });
                  init();
                }
              }
            );
          }
        }
      }
    } else {
      setAlert({
        open: true,
        severity: "success",
        message: "Submitted successfully",
      });
      init();
    }
  };

  function init() {
    isUpdated = false;
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }
    loadInHouseToolsMaster();
  }

  useEffect(() => {
    _commonService = new CommonService();
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={`${styles.companyDetails} disableInput`}>
        <TextField
          style={{ width: "38%", marginRight: 32 }}
          id="outlined-basic"
          label="Company Name"
          size="small"
          variant="outlined"
          aria-readonly={true}
          name="CompanyName"
          value={props.CompanyName}
          disabled
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="ID"
          variant="outlined"
          className={styles.idTextField}
          aria-readonly={true}
          value={props.CompanyCode}
          disabled
        />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            {/* <TableRow>
              <StyledTableCell colSpan={11} className={styles.SectionHeader}>
                In-house Study Enablement Tools
              </StyledTableCell>
            </TableRow> */}
            <TableRow>
              <StyledTableCell></StyledTableCell>
              {tableHeadings.map((heading: IHeading) => {
                return (
                  <StyledTableCell
                    colSpan={1}
                    className={styles.HeaderBottomBorder}
                  >
                    {heading.text}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {inHouseToolsMaster.map((row: IRowData, index: number) => {
              return (
                <TableRow>
                  <StyledTableCell style={{ textAlign: "left" }}>
                    {row.heading}
                  </StyledTableCell>
                  {tableHeadings.map((heading: IHeading) => {
                    return (
                      <StyledTableCell>
                        <Checkbox
                          color="primary"
                          checked={row[heading.key]}
                          onChange={(ev) => {
                            handler(!row[heading.key], `${heading.key}`, index);
                          }}
                        />
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!readOnly && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "20px 0",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={(e) => submitData()}
          >
            Submit
          </Button>
        </div>
      )}
      <CustomAlert
        open={cusalert.open}
        message={cusalert.message}
        severity={cusalert.severity}
        handleClose={(e) => {
          setAlert({
            open: false,
            severity: "",
            message: "",
          });
        }}
      ></CustomAlert>
    </ThemeProvider>
  );
};
