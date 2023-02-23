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
import styles from "./BioQA.module.scss";
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

  masterType: string;

  Design: boolean;
  Qualification: boolean;
  Validation: boolean;
  Inclusion: boolean;
  StudyDesign: boolean;
  DataCapture: boolean;
  ClinicalRollout: boolean;
  ClinicalCompliance: boolean;
  ClinicalLogistics: boolean;

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

export const BioQA = (props: IProps): JSX.Element => {
  let _commonService: any = {};
  let _bioQualsMeasureMaster = "QB Measurable Characteristics Master";
  let _bioQualsCategoriesMaster = "QB Categories Master";
  let _bioQualsMapping = "BioMarkers";

  const tableHeadings: IHeading[] = [
    {
      text: "Design",
      key: "Design",
    },
    {
      text: "Qualification",
      key: "Qualification",
    },
    {
      text: "Validation",
      key: "Validation",
    },
    {
      text: "Inclusion",
      key: "Inclusion",
    },
    {
      text: "Study Design",
      key: "StudyDesign",
    },
    {
      text: "Data Capture",
      key: "DataCapture",
    },
    {
      text: "Clinical Rollout",
      key: "ClinicalRollout",
    },
    {
      text: "Clinical Compliance",
      key: "ClinicalCompliance",
    },
    {
      text: "Clinical Logistics",
      key: "ClinicalLogistics",
    },
  ];

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });
  const [qualsMeasureMaster, setQualsMeasureMaster] = useState<IRowData[]>([]);
  const [qualsCategoriesMaster, setQualsCategoriesMaster] = useState<
    IRowData[]
  >([]);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const loadBioQualsMeasureMaster = (): void => {
    let customProperty = {
      listName: _bioQualsMeasureMaster,
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

          masterType: "Characteristics",

          Design: false,
          Qualification: false,
          Validation: false,
          Inclusion: false,
          StudyDesign: false,
          DataCapture: false,
          ClinicalRollout: false,
          ClinicalCompliance: false,
          ClinicalLogistics: false,

          isvalid: false,
        });
      }

      loadBioQualsMeasures(bioQualsMeasureMaster);
    });
  };

  const loadBioQualsMeasures = (bioQualsMeasureMaster: IRowData[]): void => {
    let customProperty = {
      listName: _bioQualsMapping,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let targetIndex = bioQualsMeasureMaster.findIndex(
            (_data) => _data.masterID == res[i].BioQualsCharacteristicsIDId
          );

          if (targetIndex != -1) {
            bioQualsMeasureMaster[targetIndex].mappingID = res[i].ID;

            for (let j = 0; j < tableHeadings.length; j++) {
              bioQualsMeasureMaster[targetIndex][tableHeadings[j].key] =
                res[i][tableHeadings[j].key];
            }
          }
        }
        setQualsMeasureMaster([...bioQualsMeasureMaster]);
        loadBioQualsCategoriesMaster();
      } else {
        setQualsMeasureMaster([...bioQualsMeasureMaster]);
        loadBioQualsCategoriesMaster();
      }
    });
  };

  const loadBioQualsCategoriesMaster = (): void => {
    let customProperty = {
      listName: _bioQualsCategoriesMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customProperty, (res: any[]) => {
      let bioQualsCategoriesMaster: IRowData[] = [];
      for (let index = 0; index < res.length; index++) {
        bioQualsCategoriesMaster.push({
          heading: res[index].Title,
          masterID: res[index].ID,
          mappingID: null,

          masterType: "Categories",

          Design: false,
          Qualification: false,
          Validation: false,
          Inclusion: false,
          StudyDesign: false,
          DataCapture: false,
          ClinicalRollout: false,
          ClinicalCompliance: false,
          ClinicalLogistics: false,

          isvalid: false,
        });
      }

      loadBioQualsCategories(bioQualsCategoriesMaster);
    });
  };

  const loadBioQualsCategories = (
    bioQualsCategoriesMaster: IRowData[]
  ): void => {
    let customProperty = {
      listName: _bioQualsMapping,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let targetIndex = bioQualsCategoriesMaster.findIndex(
            (_data) => _data.masterID == res[i].BioQualsCategoriesIDId
          );

          if (targetIndex != -1) {
            bioQualsCategoriesMaster[targetIndex].mappingID = res[i].ID;

            for (let j = 0; j < tableHeadings.length; j++) {
              bioQualsCategoriesMaster[targetIndex][tableHeadings[j].key] =
                res[i][tableHeadings[j].key];
            }
          }
        }
        setQualsCategoriesMaster([...bioQualsCategoriesMaster]);
      } else {
        setQualsCategoriesMaster([...bioQualsCategoriesMaster]);
      }
    });
  };

  const onChangeHandler = (
    value: boolean,
    key: string,
    index: number,
    type: string
  ): void => {
    let _tempData: IRowData[] =
      type == "Characteristics"
        ? [...qualsMeasureMaster]
        : [...qualsCategoriesMaster];
    _tempData[index][key] = value;

    _tempData[index].isvalid =
      _tempData[index].mappingID != null ||
      _tempData[index].Design ||
      _tempData[index].Qualification ||
      _tempData[index].Validation ||
      _tempData[index].Inclusion ||
      _tempData[index].StudyDesign ||
      _tempData[index].DataCapture ||
      _tempData[index].ClinicalRollout ||
      _tempData[index].ClinicalCompliance ||
      _tempData[index].ClinicalLogistics
        ? true
        : false;

    type == "Characteristics"
      ? setQualsMeasureMaster([..._tempData])
      : setQualsCategoriesMaster([..._tempData]);
  };

  const submitData = (): void => {
    _commonService = new CommonService();
    let processCount: number = 0;

    let resData: IRowData[] = [...qualsMeasureMaster, ...qualsCategoriesMaster];

    if (
      resData &&
      resData.length > 0 &&
      resData.filter((_d) => _d.isvalid).length > 0
    ) {
      for (let i = 0; i < resData.length; i++) {
        if (resData[i].isvalid) {
          if (resData[i].mappingID != null) {
            let respones = {
              Design: resData[i].Design,
              Qualification: resData[i].Qualification,
              Validation: resData[i].Validation,
              Inclusion: resData[i].Inclusion,
              StudyDesign: resData[i].StudyDesign,
              DataCapture: resData[i].DataCapture,
              ClinicalRollout: resData[i].ClinicalRollout,
              ClinicalCompliance: resData[i].ClinicalCompliance,
              ClinicalLogistics: resData[i].ClinicalLogistics,
            };
            _commonService.updateList(
              {
                listName: _bioQualsMapping,
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
              BioQualsCharacteristicsIDId:
                resData[i].masterType == "Characteristics"
                  ? resData[i].masterID
                  : null,
              BioQualsCategoriesIDId:
                resData[i].masterType == "Categories"
                  ? resData[i].masterID
                  : null,
              Design: resData[i].Design,
              Qualification: resData[i].Qualification,
              Validation: resData[i].Validation,
              Inclusion: resData[i].Inclusion,
              StudyDesign: resData[i].StudyDesign,
              DataCapture: resData[i].DataCapture,
              ClinicalRollout: resData[i].ClinicalRollout,
              ClinicalCompliance: resData[i].ClinicalCompliance,
              ClinicalLogistics: resData[i].ClinicalLogistics,
            };
            _commonService.insertIntoList(
              {
                listName: _bioQualsMapping,
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
    loadBioQualsMeasureMaster();
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
            <TableRow>
              <StyledTableCell colSpan={11} className={styles.SectionHeader}>
                Experience
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Bio Marker</StyledTableCell>
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
            <TableRow>
              <StyledTableCell colSpan={11} className={styles.SectionHeader}>
                Measurable Characteristics
              </StyledTableCell>
            </TableRow>
            {qualsMeasureMaster.map((row: IRowData, index: number) => {
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
                            onChangeHandler(
                              !row[heading.key],
                              `${heading.key}`,
                              index,
                              "Characteristics"
                            );
                          }}
                        />
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            <TableRow>
              <StyledTableCell colSpan={11} className={styles.SectionHeader}>
                Categories
              </StyledTableCell>
            </TableRow>
            {qualsCategoriesMaster.map((row: IRowData, index: number) => {
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
                            onChangeHandler(
                              !row[heading.key],
                              `${heading.key}`,
                              index,
                              "Categories"
                            );
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
