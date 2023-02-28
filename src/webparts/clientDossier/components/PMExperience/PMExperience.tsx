import * as React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Checkbox } from "@material-ui/core";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "@material-ui/core/Modal";
import { CustomAlert } from "../CustomAlert";
import CommonService from "../../services/CommonService";
import { Button } from "@material-ui/core";
import styles from "./PMEXperience.module.scss";
import TextField from "@material-ui/core/TextField";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

export interface IProps {
  CompanyName: string;
  CompanyCode: string;
  CompanyID: string;
  changefunction?: any;
}

interface IRowData {
  heading: string;
  masterID: number;
  mappingID: number;

  sectionType: string;
  masterType: string;

  AnalyzingPlan: boolean;
  TestID: boolean;
  TestingFrequency: boolean;
  Staff: boolean;
  Equipment: boolean;
  Criteria: boolean;
  Selecting: boolean;
  Enrolling: boolean;
  Planning: boolean;
  Measurement: boolean;
  Evaluation: boolean;
  Reporting: boolean;
  BiasMgmt: boolean;
  SafetyStandards: boolean;
  DMCSupport: boolean;

  isvalid: boolean;
}
interface IHeading {
  text: string;
  key: string;
}

interface IMasterData {
  cnsPlatform: IRowData[];
  cnsDiseaseType: IRowData[];

  ophthalmologyPlatform: IRowData[];
  ophthalmologyDiseaseType: IRowData[];

  rareDiseasePlatform: IRowData[];
  rareDiseaseType: IRowData[];

  oncologyPlatform: IRowData[];
  oncologyDiseaseType: IRowData[];
}

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

const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});

// checkbox Style
const CheckboxStyle = withStyles({
  root: {
    color: "rgba(0, 0, 0, 0.54) ",
    "&$checked": {
      color: "rgb(253, 204, 67)",
      position: "relative",
      zIndex: 2,
      "&:after": {
        content: '""',
        left: 13,
        top: 13,
        height: 15,
        width: 15,
        position: "absolute",
        backgroundColor: "rgb(0,88,154) !important",
        zIndex: -1,
      },
    },
  },
  checked: {},
})(Checkbox);

let isUpdated: boolean = false;

// export const PMExperience = (props: IProps): JSX.Element => {
const PMExperience = forwardRef((props: IProps, ref) => {
  let _commonService: any = {};

  let _platformMaster: string = "PM Experience Platforms Master";
  let _cnsDiseaseTypeMaster: string = "PM Experience CNS Disease Types Master";
  let _ophthalmologyDiseaseTypeMaster: string =
    "PM Experience Ophthalmology Disease Types Master";
  let _rareDiseaseTypeMaster: string =
    "PM Experience Rare Disease Types Master";
  let _oncologyDiseaseTypeMaster: string =
    "PM Experience Oncology Disease Types Master";

  let _cnsMapping: string = "PM Experience CNS Mapping";
  let _ophthalmologyMapping: string = "PM Experience Ophthalmology Mapping";
  let _rareDiseaseMapping: string = "PM Experience Rare Diseases Mapping";
  let _oncologyMapping: string = "PM Experience Oncology Mapping";

  const tableHeadings: IHeading[] = [
    {
      text: "Analyzing Plan",
      key: "AnalyzingPlan",
    },
    {
      text: "Test ID",
      key: "TestID",
    },
    {
      text: "Testing Frequency",
      key: "TestingFrequency",
    },
    {
      text: "Staff",
      key: "Staff",
    },
    {
      text: "Equipment",
      key: "Equipment",
    },
    {
      text: "Criteria",
      key: "Criteria",
    },
    {
      text: "Selecting",
      key: "Selecting",
    },
    {
      text: "Enrolling",
      key: "Enrolling",
    },
    {
      text: "Planning",
      key: "Planning",
    },
    {
      text: "Measurement",
      key: "Measurement",
    },
    {
      text: "Evaluation",
      key: "Evaluation",
    },
    {
      text: "Reporting",
      key: "Reporting",
    },
    {
      text: "Bias Mgmt",
      key: "BiasMgmt",
    },
    {
      text: "Safety Standards",
      key: "SafetyStandards",
    },
    {
      text: "DMC Support",
      key: "DMCSupport",
    },
  ];

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });
  const [data, setData] = useState<IMasterData>({
    cnsPlatform: [],
    cnsDiseaseType: [],

    ophthalmologyPlatform: [],
    ophthalmologyDiseaseType: [],

    rareDiseasePlatform: [],
    rareDiseaseType: [],

    oncologyPlatform: [],
    oncologyDiseaseType: [],
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const [open, setOpen] = useState(true);
  const [isPageChanged, setIsPageChanged] = useState(false);
  function pageAlert() {
    setIsPageChanged(true);
    setOpen(true);
  }

  useImperativeHandle(ref, () => {
    return { pageAlert: pageAlert };
  });

  function successAfterPageSave() {
    props.changefunction(false);
    setOpen(false);
    setIsPageChanged(false);
  }

  const loadPlatformMaster = (): void => {
    const customMasterProperty = {
      listName: _platformMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customMasterProperty, (res: any[]) => {
      let _platformMasters: IRowData[] = [];
      _platformMasters = [...res];

      loadCNSDiseaseTypeMaster(_platformMasters, data);
    });
  };
  const loadCNSDiseaseTypeMaster = (
    platformMasters: any[],
    _data: IMasterData
  ): void => {
    const customMasterProperty = {
      listName: _cnsDiseaseTypeMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customMasterProperty, (res: any[]) => {
      let _platformMaster: IRowData[] = [];
      let _diseaseTypeMaster: IRowData[] = [];

      for (let index = 0; index < res.length; index++) {
        _diseaseTypeMaster.push({
          heading: res[index].Title,
          masterID: res[index].ID,
          mappingID: null,

          sectionType: "CNS",
          masterType: "DiseaseType",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      for (let index = 0; index < platformMasters.length; index++) {
        _platformMaster.push({
          heading: platformMasters[index].Title,
          masterID: platformMasters[index].ID,
          mappingID: null,

          sectionType: "CNS",
          masterType: "Platform",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      let _res = loadMapping(_cnsMapping, _platformMaster, _diseaseTypeMaster);

      _data.cnsPlatform = [..._res.platformMaster];
      _data.cnsDiseaseType = [..._res.diseaseTypeMaster];

      loadOphthalmologyDiseaseTypeMaster(platformMasters, _data);
    });
  };
  const loadOphthalmologyDiseaseTypeMaster = (
    platformMasters: any[],
    _data: IMasterData
  ): void => {
    const customMasterProperty = {
      listName: _ophthalmologyDiseaseTypeMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customMasterProperty, (res: any[]) => {
      let _platformMaster: IRowData[] = [];
      let _diseaseTypeMaster: IRowData[] = [];

      for (let index = 0; index < res.length; index++) {
        _diseaseTypeMaster.push({
          heading: res[index].Title,
          masterID: res[index].ID,
          mappingID: null,

          sectionType: "Ophthalmology",
          masterType: "DiseaseType",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      for (let index = 0; index < platformMasters.length; index++) {
        _platformMaster.push({
          heading: platformMasters[index].Title,
          masterID: platformMasters[index].ID,
          mappingID: null,

          sectionType: "Ophthalmology",
          masterType: "Platform",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      let _res = loadMapping(
        _ophthalmologyMapping,
        _platformMaster,
        _diseaseTypeMaster
      );

      _data.ophthalmologyPlatform = [..._res.platformMaster];
      _data.ophthalmologyDiseaseType = [..._res.diseaseTypeMaster];

      loadRareDiseaseTypeMaster(platformMasters, _data);
    });
  };
  const loadRareDiseaseTypeMaster = (
    platformMasters: any[],
    _data: IMasterData
  ): void => {
    const customMasterProperty = {
      listName: _rareDiseaseTypeMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customMasterProperty, (res: any[]) => {
      let _platformMaster: IRowData[] = [];
      let _diseaseTypeMaster: IRowData[] = [];

      for (let index = 0; index < res.length; index++) {
        _diseaseTypeMaster.push({
          heading: res[index].Title,
          masterID: res[index].ID,
          mappingID: null,

          sectionType: "Rare Disease",
          masterType: "DiseaseType",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      for (let index = 0; index < platformMasters.length; index++) {
        _platformMaster.push({
          heading: platformMasters[index].Title,
          masterID: platformMasters[index].ID,
          mappingID: null,

          sectionType: "Rare Disease",
          masterType: "Platform",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      let _res = loadMapping(
        _rareDiseaseMapping,
        _platformMaster,
        _diseaseTypeMaster
      );

      _data.rareDiseasePlatform = [..._res.platformMaster];
      _data.rareDiseaseType = [..._res.diseaseTypeMaster];

      loadOncologyDiseaseTypeMaster(platformMasters, _data);
    });
  };
  const loadOncologyDiseaseTypeMaster = (
    platformMasters: any[],
    _data: IMasterData
  ): void => {
    const customMasterProperty = {
      listName: _oncologyDiseaseTypeMaster,
      properties: "ID,Title,IsActive",
      filter: "IsActive eq '1'",
      orderby: "ID",
      orderbyAsc: true,
    };

    _commonService.getList(customMasterProperty, (res: any[]) => {
      let _platformMaster: IRowData[] = [];
      let _diseaseTypeMaster: IRowData[] = [];

      for (let index = 0; index < res.length; index++) {
        _diseaseTypeMaster.push({
          heading: res[index].Title,
          masterID: res[index].ID,
          mappingID: null,

          sectionType: "Oncology",
          masterType: "DiseaseType",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      for (let index = 0; index < platformMasters.length; index++) {
        _platformMaster.push({
          heading: platformMasters[index].Title,
          masterID: platformMasters[index].ID,
          mappingID: null,

          sectionType: "Oncology",
          masterType: "Platform",

          AnalyzingPlan: false,
          TestID: false,
          TestingFrequency: false,
          Staff: false,
          Equipment: false,
          Criteria: false,
          Selecting: false,
          Enrolling: false,
          Planning: false,
          Measurement: false,
          Evaluation: false,
          Reporting: false,
          BiasMgmt: false,
          SafetyStandards: false,
          DMCSupport: false,

          isvalid: false,
        });
      }

      let _res = loadMapping(
        _oncologyMapping,
        _platformMaster,
        _diseaseTypeMaster
      );

      _data.oncologyPlatform = [..._res.platformMaster];
      _data.oncologyDiseaseType = [..._res.diseaseTypeMaster];

      // console.log(_data);

      setData({ ..._data });
      setTimeout(() => {
        setLoader(false);
      }, 500);
    });
  };
  const loadMapping = (
    listName: string,
    platformMaster: IRowData[],
    diseaseTypeMaster: IRowData[]
  ): { platformMaster: IRowData[]; diseaseTypeMaster: IRowData[] } => {
    const customMappingProperty = {
      listName: listName,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };

    _commonService.getList(customMappingProperty, (res: any[]) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let targetPlatformIndex = platformMaster.findIndex(
            (_data) => _data.masterID == res[i].PlatformId
          );

          if (targetPlatformIndex != -1) {
            platformMaster[targetPlatformIndex].mappingID = res[i].ID;

            for (let j = 0; j < tableHeadings.length; j++) {
              platformMaster[targetPlatformIndex][tableHeadings[j].key] =
                res[i][tableHeadings[j].key];
            }
          }

          let targetDiseaseTypeIndex = diseaseTypeMaster.findIndex(
            (_data) => _data.masterID == res[i].DiseaseTypeId
          );

          if (targetDiseaseTypeIndex != -1) {
            diseaseTypeMaster[targetDiseaseTypeIndex].mappingID = res[i].ID;

            for (let j = 0; j < tableHeadings.length; j++) {
              diseaseTypeMaster[targetDiseaseTypeIndex][tableHeadings[j].key] =
                res[i][tableHeadings[j].key];
            }
          }
        }
      }
    });
    return {
      platformMaster: platformMaster,
      diseaseTypeMaster: diseaseTypeMaster,
    };
  };

  const onChangeHandler = (
    arrName: string,
    index: number,
    key: string,
    value: boolean
  ): void => {
    let _data = { ...data };

    data[arrName][index][key] = value;

    data[arrName][index].isvalid =
      data[arrName][index].mappingID != null ||
      data[arrName][index].AnalyzingPlan ||
      data[arrName][index].TestID ||
      data[arrName][index].TestingFrequency ||
      data[arrName][index].Staff ||
      data[arrName][index].Equipment ||
      data[arrName][index].Criteria ||
      data[arrName][index].Selecting ||
      data[arrName][index].Enrolling ||
      data[arrName][index].Planning ||
      data[arrName][index].Measurement ||
      data[arrName][index].Evaluation ||
      data[arrName][index].Reporting ||
      data[arrName][index].BiasMgmt ||
      data[arrName][index].SafetyStandards ||
      data[arrName][index].DMCSupport
        ? true
        : false;
    props.changefunction(true);
    setData({ ..._data });
  };

  const submitFunction = (
    sectionName: string,
    _data: IRowData[],
    listName: string,
    count: number
  ): void => {
    let _count: number = 0;
    _commonService = new CommonService();
    if (
      _data &&
      _data.length > 0 &&
      _data.filter((a) => a.isvalid).length > 0
    ) {
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].isvalid) {
          if (_data[i].mappingID != null) {
            let respones = {
              AnalyzingPlan: _data[i].AnalyzingPlan,
              TestID: _data[i].TestID,
              TestingFrequency: _data[i].TestingFrequency,
              Staff: _data[i].Staff,
              Equipment: _data[i].Equipment,
              Criteria: _data[i].Criteria,
              Selecting: _data[i].Selecting,
              Enrolling: _data[i].Enrolling,
              Planning: _data[i].Planning,
              Measurement: _data[i].Measurement,
              Evaluation: _data[i].Evaluation,
              Reporting: _data[i].Reporting,
              BiasMgmt: _data[i].BiasMgmt,
              SafetyStandards: _data[i].SafetyStandards,
              DMCSupport: _data[i].DMCSupport,
            };
            _commonService.updateList(
              {
                listName: listName,
                ID: _data[i].mappingID,
              },
              respones,
              (res: any) => {
                isUpdated = true;
                _count++;
                if (_count == _data.filter((_d) => _d.isvalid).length) {
                  conditionChecker(sectionName, count, _count);
                }
              }
            );
          } else {
            let respones = {
              CompanyIDId: props.CompanyID,
              PlatformId:
                _data[i].masterType == "Platform" ? _data[i].masterID : null,
              DiseaseTypeId:
                _data[i].masterType == "DiseaseType" ? _data[i].masterID : null,
              AnalyzingPlan: _data[i].AnalyzingPlan,
              TestID: _data[i].TestID,
              TestingFrequency: _data[i].TestingFrequency,
              Staff: _data[i].Staff,
              Equipment: _data[i].Equipment,
              Criteria: _data[i].Criteria,
              Selecting: _data[i].Selecting,
              Enrolling: _data[i].Enrolling,
              Planning: _data[i].Planning,
              Measurement: _data[i].Measurement,
              Evaluation: _data[i].Evaluation,
              Reporting: _data[i].Reporting,
              BiasMgmt: _data[i].BiasMgmt,
              SafetyStandards: _data[i].SafetyStandards,
              DMCSupport: _data[i].DMCSupport,
            };
            _commonService.insertIntoList(
              {
                listName: listName,
              },
              respones,
              (res: any) => {
                _count++;
                if (_count == _data.filter((_d) => _d.isvalid).length) {
                  conditionChecker(sectionName, count, _count);
                }
              }
            );
          }
        }
      }
    } else {
      conditionChecker(sectionName, count, _count);
    }
  };

  const conditionChecker = (
    sectionName: string,
    count: number,
    _count: number
  ): void => {
    if (sectionName == "CNS") {
      submitFunction(
        "Ophthalmology",
        [...data.ophthalmologyPlatform, ...data.ophthalmologyDiseaseType],
        _ophthalmologyMapping,
        count + _count
      );
    } else if (sectionName == "Ophthalmology") {
      submitFunction(
        "RareDisease",
        [...data.rareDiseasePlatform, ...data.rareDiseaseType],
        _rareDiseaseMapping,
        count + _count
      );
    } else if (sectionName == "RareDisease") {
      submitFunction(
        "Oncology",
        [...data.oncologyPlatform, ...data.oncologyDiseaseType],
        _oncologyMapping,
        count + _count
      );
    } else {
      let allData: IRowData[] = [
        ...data.cnsPlatform,
        ...data.cnsDiseaseType,
        ...data.ophthalmologyPlatform,
        ...data.ophthalmologyDiseaseType,
        ...data.rareDiseasePlatform,
        ...data.rareDiseaseType,
        ...data.oncologyPlatform,
        ...data.oncologyDiseaseType,
      ];
      setAlert({
        open: true,
        severity: "success",
        message:
          allData.filter((_d) => _d.isvalid).length == 0
            ? "Submitted successfully"
            : isUpdated
            ? "Updated successfully"
            : "Created successfully",
      });
      setLoader(true);
      init();
      successAfterPageSave();
    }
  };

  const init = (): void => {
    isUpdated = false;
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    loadPlatformMaster();
  };

  useEffect(() => {
    _commonService = new CommonService();
    setLoader(true);
    init();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        {isPageChanged ? (
          <Modal open={open}>
            <div className={styles.modalContainer}>
              <div className={styles.modalSize}>
                <div className={styles.header}>
                  <h3
                    style={{
                      margin: "0px 5px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Alert
                  </h3>
                </div>
                <div className={styles.section}>
                  <span>
                    Please click submit before moving to another tab or your
                    work will be lost
                  </span>
                </div>
                <div className={styles.popupBtn}>
                  <Button
                    style={{
                      backgroundColor: "rgb(0,88,154)",
                      color: "rgb(253, 204, 67)",
                    }}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    No
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "rgb(253, 204, 67)",
                      color: "rgb(0,88,154) ",
                    }}
                    onClick={() => {
                      successAfterPageSave();
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        ) : (
          ""
        )}
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
        {loader ? (
          <div
            style={{
              height: 200,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell
                      colSpan={3}
                      className={styles.HeaderBottomBorder}
                    >
                      Protocol / Planning
                    </StyledTableCell>
                    <StyledTableCell
                      colSpan={2}
                      className={styles.HeaderBottomBorder}
                    >
                      Resourcing
                    </StyledTableCell>
                    <StyledTableCell
                      colSpan={3}
                      className={styles.HeaderBottomBorder}
                    >
                      Patient Relations
                    </StyledTableCell>
                    <StyledTableCell
                      colSpan={4}
                      className={styles.HeaderBottomBorder}
                    >
                      Data Collection
                    </StyledTableCell>
                    <StyledTableCell
                      colSpan={3}
                      className={styles.HeaderBottomBorder}
                    >
                      Safety and Quality
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell
                      className={styles.HeaderColBorder}
                    ></StyledTableCell>
                    {tableHeadings.map((heading: IHeading) => {
                      return (
                        <StyledTableCell className={styles.HeaderColBorder}>
                          {heading.text}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell
                      colSpan={19}
                      className={styles.SectionHeader}
                    >
                      CNS
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Platform
                    </StyledTableCell>
                  </TableRow>
                  {data.cnsPlatform.map((row: IRowData, index: number) => {
                    return (
                      <TableRow>
                        <StyledTableCell style={{ textAlign: "left" }}>
                          {row.heading}
                        </StyledTableCell>
                        {tableHeadings.map((heading: IHeading) => {
                          return (
                            <StyledTableCell>
                              <CheckboxStyle
                                checked={row[heading.key]}
                                onChange={(ev) => {
                                  onChangeHandler(
                                    "cnsPlatform",
                                    index,
                                    heading.key,
                                    !row[heading.key]
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
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Disease Types
                    </StyledTableCell>
                  </TableRow>
                  {data.cnsDiseaseType.map((row: IRowData, index: number) => {
                    return (
                      <TableRow>
                        <StyledTableCell style={{ textAlign: "left" }}>
                          {row.heading}
                        </StyledTableCell>
                        {tableHeadings.map((heading: IHeading) => {
                          return (
                            <StyledTableCell>
                              <CheckboxStyle
                                checked={row[heading.key]}
                                onChange={(ev) => {
                                  onChangeHandler(
                                    "cnsDiseaseType",
                                    index,
                                    heading.key,
                                    !row[heading.key]
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
                    <StyledTableCell
                      colSpan={19}
                      className={styles.SectionHeader}
                    >
                      Ophthalmology
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Platform
                    </StyledTableCell>
                  </TableRow>
                  {data.ophthalmologyPlatform.map(
                    (row: IRowData, index: number) => {
                      return (
                        <TableRow>
                          <StyledTableCell style={{ textAlign: "left" }}>
                            {row.heading}
                          </StyledTableCell>
                          {tableHeadings.map((heading: IHeading) => {
                            return (
                              <StyledTableCell>
                                <CheckboxStyle
                                  checked={row[heading.key]}
                                  onChange={(ev) => {
                                    onChangeHandler(
                                      "ophthalmologyPlatform",
                                      index,
                                      heading.key,
                                      !row[heading.key]
                                    );
                                  }}
                                />
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      );
                    }
                  )}
                  <TableRow>
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Disease Types
                    </StyledTableCell>
                  </TableRow>
                  {data.ophthalmologyDiseaseType.map(
                    (row: IRowData, index: number) => {
                      return (
                        <TableRow>
                          <StyledTableCell style={{ textAlign: "left" }}>
                            {row.heading}
                          </StyledTableCell>
                          {tableHeadings.map((heading: IHeading) => {
                            return (
                              <StyledTableCell>
                                <CheckboxStyle
                                  checked={row[heading.key]}
                                  onChange={(ev) => {
                                    onChangeHandler(
                                      "ophthalmologyDiseaseType",
                                      index,
                                      heading.key,
                                      !row[heading.key]
                                    );
                                  }}
                                />
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      );
                    }
                  )}
                  <TableRow>
                    <StyledTableCell
                      colSpan={19}
                      className={styles.SectionHeader}
                    >
                      Rare Disease
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Platform
                    </StyledTableCell>
                  </TableRow>
                  {data.rareDiseasePlatform.map(
                    (row: IRowData, index: number) => {
                      return (
                        <TableRow>
                          <StyledTableCell style={{ textAlign: "left" }}>
                            {row.heading}
                          </StyledTableCell>
                          {tableHeadings.map((heading: IHeading) => {
                            return (
                              <StyledTableCell>
                                <CheckboxStyle
                                  checked={row[heading.key]}
                                  onChange={(ev) => {
                                    onChangeHandler(
                                      "rareDiseasePlatform",
                                      index,
                                      heading.key,
                                      !row[heading.key]
                                    );
                                  }}
                                />
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      );
                    }
                  )}
                  <TableRow>
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Disease Types
                    </StyledTableCell>
                  </TableRow>
                  {data.rareDiseaseType.map((row: IRowData, index: number) => {
                    return (
                      <TableRow>
                        <StyledTableCell style={{ textAlign: "left" }}>
                          {row.heading}
                        </StyledTableCell>
                        {tableHeadings.map((heading: IHeading) => {
                          return (
                            <StyledTableCell>
                              <CheckboxStyle
                                checked={row[heading.key]}
                                onChange={(ev) => {
                                  onChangeHandler(
                                    "rareDiseaseType",
                                    index,
                                    heading.key,
                                    !row[heading.key]
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
                    <StyledTableCell
                      colSpan={19}
                      className={styles.SectionHeader}
                    >
                      Oncology
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Platform
                    </StyledTableCell>
                  </TableRow>
                  {data.oncologyPlatform.map((row: IRowData, index: number) => {
                    return (
                      <TableRow>
                        <StyledTableCell style={{ textAlign: "left" }}>
                          {row.heading}
                        </StyledTableCell>
                        {tableHeadings.map((heading: IHeading) => {
                          return (
                            <StyledTableCell>
                              <CheckboxStyle
                                checked={row[heading.key]}
                                onChange={(ev) => {
                                  onChangeHandler(
                                    "oncologyPlatform",
                                    index,
                                    heading.key,
                                    !row[heading.key]
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
                    <StyledTableCell colSpan={19} className={styles.subHeader}>
                      Disease Types
                    </StyledTableCell>
                  </TableRow>
                  {data.oncologyDiseaseType.map(
                    (row: IRowData, index: number) => {
                      return (
                        <TableRow>
                          <StyledTableCell style={{ textAlign: "left" }}>
                            {row.heading}
                          </StyledTableCell>
                          {tableHeadings.map((heading: IHeading) => {
                            return (
                              <StyledTableCell>
                                <CheckboxStyle
                                  checked={row[heading.key]}
                                  onChange={(ev) => {
                                    onChangeHandler(
                                      "oncologyDiseaseType",
                                      index,
                                      heading.key,
                                      !row[heading.key]
                                    );
                                  }}
                                />
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      );
                    }
                  )}
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
                  style={{
                    backgroundColor: "rgb(253, 204, 67)",
                    color: "rgb(0,88,154) ",
                  }}
                  size="large"
                  // onClick={(e) => submitData()}
                  onClick={(e) =>
                    submitFunction(
                      "CNS",
                      [...data.cnsPlatform, ...data.cnsDiseaseType],
                      _cnsMapping,
                      0
                    )
                  }
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
        )}
      </ThemeProvider>
    </>
  );
});
export default PMExperience;
