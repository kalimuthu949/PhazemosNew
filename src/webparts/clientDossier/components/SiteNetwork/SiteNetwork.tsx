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
import styles from "./SiteNetwork.module.scss";
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

  USA: boolean;
  UKAndNorthIreland: boolean;
  WestEurope: boolean;
  CEE: boolean;
  NorthAfrica: boolean;
  SubSaharanAfrica: boolean;
  MiddleEast: boolean;
  APAC: boolean;
  LatAM: boolean;

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

export const SiteNetwork = (props: IProps): JSX.Element => {
  let _commonService: any = {};
  let _siteNetworkMaster = "Site Network Master";
  let _siteNetworkMapping = "Site Network Mapping";

  const tableHeadings: IHeading[] = [
    {
      text: "USA",
      key: "USA",
    },
    {
      text: "UK + N. Ireland",
      key: "UKAndNorthIreland",
    },
    {
      text: "W. Europe",
      key: "WestEurope",
    },
    {
      text: "CEE",
      key: "CEE",
    },
    {
      text: "N. Africa",
      key: "NorthAfrica",
    },
    {
      text: "Sub Saharan Africa",
      key: "SubSaharanAfrica",
    },
    {
      text: "Middle East",
      key: "MiddleEast",
    },
    {
      text: "APAC",
      key: "APAC",
    },
    {
      text: "LatAM",
      key: "LatAM",
    },
  ];

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });
  const [siteNetworkMaster, setSiteNetworkMaster] = useState<IRowData[]>([]);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const loadSiteNetworkMaster = (): void => {
    let customProperty = {
      listName: _siteNetworkMaster,
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

          USA: false,
          UKAndNorthIreland: false,
          WestEurope: false,
          CEE: false,
          NorthAfrica: false,
          SubSaharanAfrica: false,
          MiddleEast: false,
          APAC: false,
          LatAM: false,

          isvalid: false,
        });
      }

      loadSiteNetworkMapping(bioQualsMeasureMaster);
    });
  };

  const loadSiteNetworkMapping = (masterData: IRowData[]): void => {
    let customProperty = {
      listName: _siteNetworkMapping,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let targetIndex = masterData.findIndex(
            (_data) => _data.masterID == res[i].SiteNetworkId
          );

          if (targetIndex != -1) {
            masterData[targetIndex].mappingID = res[i].ID;

            for (let j = 0; j < tableHeadings.length; j++) {
              masterData[targetIndex][tableHeadings[j].key] =
                res[i][tableHeadings[j].key];
            }
          }
        }
        setSiteNetworkMaster([...masterData]);
      } else {
        setSiteNetworkMaster([...masterData]);
      }
    });
  };

  const handler = (value: boolean, key: string, index: number): void => {
    let _tempData: IRowData[] = [...siteNetworkMaster];

    _tempData[index][key] = value;

    _tempData[index].isvalid =
      _tempData[index].mappingID != null ||
      _tempData[index].USA ||
      _tempData[index].UKAndNorthIreland ||
      _tempData[index].CEE ||
      _tempData[index].NorthAfrica ||
      _tempData[index].SubSaharanAfrica ||
      _tempData[index].MiddleEast ||
      _tempData[index].APAC ||
      _tempData[index].LatAM
        ? true
        : false;

    setSiteNetworkMaster([..._tempData]);
  };

  const submitData = (): void => {
    _commonService = new CommonService();
    let processCount: number = 0;

    let resData: IRowData[] = [...siteNetworkMaster];
    if (
      resData &&
      resData.length > 0 &&
      resData.filter((_d) => _d.isvalid).length > 0
    ) {
      for (let i = 0; i < resData.length; i++) {
        if (resData[i].isvalid) {
          if (resData[i].mappingID != null) {
            let respones = {
              USA: resData[i].USA,
              UKAndNorthIreland: resData[i].UKAndNorthIreland,
              WestEurope: resData[i].WestEurope,
              CEE: resData[i].CEE,
              NorthAfrica: resData[i].NorthAfrica,
              SubSaharanAfrica: resData[i].SubSaharanAfrica,
              MiddleEast: resData[i].MiddleEast,
              APAC: resData[i].APAC,
              LatAM: resData[i].LatAM,
            };
            _commonService.updateList(
              {
                listName: _siteNetworkMapping,
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
              SiteNetworkId: resData[i].masterID,
              USA: resData[i].USA,
              UKAndNorthIreland: resData[i].UKAndNorthIreland,
              WestEurope: resData[i].WestEurope,
              CEE: resData[i].CEE,
              NorthAfrica: resData[i].NorthAfrica,
              SubSaharanAfrica: resData[i].SubSaharanAfrica,
              MiddleEast: resData[i].MiddleEast,
              APAC: resData[i].APAC,
              LatAM: resData[i].LatAM,
            };
            _commonService.insertIntoList(
              {
                listName: _siteNetworkMapping,
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
    loadSiteNetworkMaster();
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
            {siteNetworkMaster.map((row: IRowData, index: number) => {
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
