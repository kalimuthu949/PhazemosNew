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
import { Button } from "@material-ui/core";
import { CustomAlert } from "../CustomAlert";

export interface IBioQuals {
  CompanyName: string;
  CompanyCode: string;
  CompanyID: string;
}

interface IRowData {
  heading: string;
  masterID: number;
  mappingID: number;

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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const BioQA = (props: IBioQuals) => {
  var _commonService: any = {};
  var _bioQualsMeasureMaster = "QB Measurable Characteristics Master";
  var _bioQualsMapping = "BioMarkers";

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
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const loadBioQualsMeasureMaster = (): void => {
    let customProperty = {
      listName: _bioQualsMeasureMaster,
      properties: "ID,Title,IsActive",
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
      } else {
        setQualsMeasureMaster([...bioQualsMeasureMaster]);
      }
    });
  };

  const handler = (value: boolean, key: string, index: number): void => {
    let _qualsMeasureMaster: IRowData[] = [...qualsMeasureMaster];
    _qualsMeasureMaster[index][key] = value;

    _qualsMeasureMaster[index].isvalid =
      _qualsMeasureMaster[index].mappingID != null ||
      _qualsMeasureMaster[index].Design ||
      _qualsMeasureMaster[index].Qualification ||
      _qualsMeasureMaster[index].Validation ||
      _qualsMeasureMaster[index].Inclusion ||
      _qualsMeasureMaster[index].StudyDesign ||
      _qualsMeasureMaster[index].DataCapture ||
      _qualsMeasureMaster[index].ClinicalRollout ||
      _qualsMeasureMaster[index].ClinicalCompliance ||
      _qualsMeasureMaster[index].ClinicalLogistics
        ? true
        : false;

    setQualsMeasureMaster([..._qualsMeasureMaster]);
  };

  const submitData = (): void => {
    _commonService = new CommonService();
    let processCount: number = 0;

    for (let i = 0; i < qualsMeasureMaster.length; i++) {
      if (qualsMeasureMaster[i].isvalid) {
        if (qualsMeasureMaster[i].mappingID != null) {
          let respones = {
            Design: qualsMeasureMaster[i].Design,
            Qualification: qualsMeasureMaster[i].Qualification,
            Validation: qualsMeasureMaster[i].Validation,
            Inclusion: qualsMeasureMaster[i].Inclusion,
            StudyDesign: qualsMeasureMaster[i].StudyDesign,
            DataCapture: qualsMeasureMaster[i].DataCapture,
            ClinicalRollout: qualsMeasureMaster[i].ClinicalRollout,
            ClinicalCompliance: qualsMeasureMaster[i].ClinicalCompliance,
            ClinicalLogistics: qualsMeasureMaster[i].ClinicalLogistics,
          };
          _commonService.updateList(
            {
              listName: _bioQualsMapping,
              ID: qualsMeasureMaster[i].mappingID,
            },
            respones,
            (res: any) => {
              processCount++;
              if (
                processCount ==
                qualsMeasureMaster.filter((_d) => _d.isvalid).length
              ) {
                setAlert({
                  open: true,
                  severity: "success",
                  message: "Submitted successfully",
                });
                init();
              }
            }
          );
        } else {
          let respones = {
            CompanyIDId: props.CompanyID,
            BioQualsCharacteristicsIDId: qualsMeasureMaster[i].masterID,
            Design: qualsMeasureMaster[i].Design,
            Qualification: qualsMeasureMaster[i].Qualification,
            Validation: qualsMeasureMaster[i].Validation,
            Inclusion: qualsMeasureMaster[i].Inclusion,
            StudyDesign: qualsMeasureMaster[i].StudyDesign,
            DataCapture: qualsMeasureMaster[i].DataCapture,
            ClinicalRollout: qualsMeasureMaster[i].ClinicalRollout,
            ClinicalCompliance: qualsMeasureMaster[i].ClinicalCompliance,
            ClinicalLogistics: qualsMeasureMaster[i].ClinicalLogistics,
          };
          _commonService.insertIntoList(
            {
              listName: _bioQualsMapping,
            },
            respones,
            (res: any) => {
              processCount++;
              if (
                processCount ==
                qualsMeasureMaster.filter((_d) => _d.isvalid).length
              ) {
                setAlert({
                  open: true,
                  severity: "success",
                  message: "Submitted successfully",
                });
                init();
              }
            }
          );
        }
      }
    }
  };

  function init() {
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
    <>
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
                  <StyledTableCell>{row.heading}</StyledTableCell>
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
            <TableRow>
              <StyledTableCell colSpan={11} className={styles.SectionHeader}>
                Categories
              </StyledTableCell>
            </TableRow>
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
    </>
  );
};
