import * as React from "react";
import TextField from "@material-ui/core/TextField";
import classes from "./ExpertisePlatform.module.scss";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  createTheme,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

import CommonService from "../services/CommonService";

import { CustomAlert } from "./CustomAlert";
import { CustomDialog } from "./CustomDialog";

export interface IExpertisePlatform {
  CompanyName: string;
  CompanyCode: string;
  CompanyID: string;
  changefunction?: any;
}

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

// export const ExpertisePlatform: React.FunctionComponent<IExpertisePlatform> = (
//   props: IExpertisePlatform
// ) => {
const ExpertisePlatform = forwardRef((props: IExpertisePlatform, ref) => {
  var _commonService: any = {};

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const [readOnly, setReadOnly] = useState(false);

  const _expertisePlatform: string = "ExpertisePlatform";
  const _expertisePlatformMap: string = "Expertise Platform Mapping";
  const _expertisePlatformMaster: string = "Expertise Platform Master";

  const [expertisePlatform, setExpertisePlatform] = useState([]);

  const [companyExpertisePlatform, setCompanyExpertisePlatform] = useState({
    expertisePlatform: null,
    expertisePlatformMapping: [],
  });

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

  function loadActiveExpertisePlatformExperience(editData: any) {
    let customProperty = {
      listName: _expertisePlatformMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let expertisePlatforms = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = editData.expertisePlatformMapping.filter(
          (c) => c.ExpertisePlatformMasterIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            ExpertisePlatformIDId: 0,
            ExpertisePlatformMasterIDId: res[index].Id,
            serviceName: res[index].Title,
            IsChecked: false,
            ID: 0,
          };
          if (editMap.length) {
            data.ExpertisePlatformIDId = editMap[0].ExpertisePlatformIDId;
            data.ID = editMap[0].ID;
            data.IsChecked = true;
          }
          expertisePlatforms.push(data);
        }
      }
      expertisePlatforms = sortData(expertisePlatforms);
      setExpertisePlatform([...expertisePlatforms]);
    });
  }
  function sortData(Data) {
    Data.sort((a, b) =>
      a.serviceName > b.serviceName ? 1 : b.serviceName > a.serviceName ? -1 : 0
    );
    return Data;
  }
  function loadCompanyExpertisePlatform() {
    let customProperty = {
      listName: _expertisePlatform,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        loadCompanyExperiencePlatformMapping(res[0]);
      } else {
        loadActiveExpertisePlatformExperience({
          expertisePlatform: null,
          expertisePlatformMapping: [],
        });
      }
    });
  }

  function loadCompanyExperiencePlatformMapping(res: any) {
    let customProperty = {
      listName: _expertisePlatformMap,
      filter: "ExpertisePlatformIDId eq '" + res.ID + "' and IsDeleted eq 0",
      expand: "ExpertisePlatformMasterID",
      properties: "*,ExpertisePlatformMasterID/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      let editData: any = {};
      editData.expertisePlatform = res;
      editData.expertisePlatformMapping = [...mapres];
      setCompanyExpertisePlatform(editData);
      loadActiveExpertisePlatformExperience(editData);
    });
  }

  function init() {
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    setExpertisePlatform([]);
    setCompanyExpertisePlatform({
      expertisePlatform: null,
      expertisePlatformMapping: [],
    });
    loadCompanyExpertisePlatform();
  }

  function expertisePlatformChangeHandler(index: number, event: any) {
    let expertisePlatforms = expertisePlatform;
    expertisePlatforms[index][event.target.name] = event.target.checked;
    setExpertisePlatform([...expertisePlatforms]);
    props.changefunction(true);
  }

  function submitData() {
    _commonService = new CommonService();

    if (!companyExpertisePlatform.expertisePlatform) {
      insertExpertisePlatform();
    } else {
      updateExpertisePlatform();
    }
  }

  function insertExpertisePlatform() {
    let expertisePlatformPostData: any[] = [];
    _commonService.insertIntoList(
      {
        listName: _expertisePlatform,
      },
      { CompanyIDId: props.CompanyID },
      (res: any) => {
        let locExpertisePlatform = expertisePlatform.slice();
        locExpertisePlatform.forEach((expertisePlatform: any) => {
          if (expertisePlatform.IsChecked) {
            expertisePlatformPostData.push({
              ExpertisePlatformIDId: res.data.Id,
              ExpertisePlatformMasterIDId:
                expertisePlatform.ExpertisePlatformMasterIDId,
            });
          }
        });

        if (expertisePlatformPostData.length > 0) {
          _commonService.bulkInsert(
            { listName: _expertisePlatformMap },
            expertisePlatformPostData,
            (bulkres: any) => {
              init();
              successAfterPageSave();
            }
          );
        }
      }
    );
    setAlert({
      open: true,
      severity: "success",
      message: "Inserted successfully",
    });
    setTimeout(() => {
      init();
      successAfterPageSave();
    }, 3000);
  }

  function updateExpertisePlatform() {
    updateExpertisePlatformMap();
    // setAlert({
    //   open: true,
    //   severity: "success",
    //   message: "Updated successfully",
    // });
  }

  function updateExpertisePlatformMap() {
    let locCompanyExpertisePlatform = companyExpertisePlatform;
    let locExpertisePlatform = expertisePlatform.slice();
    let addExpertise = locExpertisePlatform.filter(
      (c) => c.ExpertisePlatformIDId == 0 && c.IsChecked == true
    );
    let removedExpertise = locExpertisePlatform.filter(
      (c) => c.ExpertisePlatformIDId != 0 && c.IsChecked == false
    );
    if (addExpertise.length) {
      addExpertise.forEach((v) => {
        v.ExpertisePlatformIDId =
          locCompanyExpertisePlatform.expertisePlatform.ID;
        delete v.serviceName;
        delete v.ID;
        delete v.IsChecked;
      });
      _commonService.bulkInsert(
        { listName: _expertisePlatformMap },
        addExpertise,
        (bulkres: any) => {
          init();
          successAfterPageSave();
          setAlert({
            open: true,
            severity: "success",
            message: "Updated successfully",
          });
        }
      );
    }
    if (removedExpertise.length) {
      removedExpertise.forEach((v) => {
        v.IsDeleted = true;
        delete v.serviceName;
        delete v.IsChecked;
      });
      _commonService.bulkUpdate(
        { listName: _expertisePlatformMap },
        removedExpertise,
        (bulkres: any) => {
          init();
          successAfterPageSave();
          setAlert({
            open: true,
            severity: "success",
            message: "Updated successfully",
          });
        }
      );
    }
  }

  useEffect((): any => {
    _commonService = new CommonService();
    init();
  }, []);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <ThemeProvider theme={theme}>
      {isPageChanged ? (
        <Modal open={open}>
          <div className={classes.modalContainer}>
            <div className={classes.modalSize}>
              <div className={classes.header}>
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
              <div className={classes.section}>
                <span>
                  Please click submit before moving to another tab or your work
                  will be lost
                </span>
              </div>
              <div className={classes.popupBtn}>
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
      <div className={`${classes.companyDetails} disableInput`}>
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
          className={classes.idTextField}
          aria-readonly={true}
          value={props.CompanyCode}
          disabled
        />
      </div>

      <div className={classes.AreaExperience}>
        <p>Platform Area Experience (check "x" all that apply)</p>

        <div className={classes.CheckboxSection}>
          {expertisePlatform.map((service: any, index: number) => {
            return (
              <div className={classes.Checkbox}>
                <FormControlLabel
                  control={
                    <CheckboxStyle
                      checked={service.IsChecked}
                      onChange={(e) => expertisePlatformChangeHandler(index, e)}
                      name="IsChecked"
                      color="primary"
                      disabled={readOnly}
                    />
                  }
                  label={service.serviceName}
                />
              </div>
            );
          })}
        </div>
      </div>

      {!readOnly && (
        <div className={classes.bottomBtnSection} style={{ marginTop: 20 }}>
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "rgb(253, 204, 67)",
              color: "rgb(0,88,154) ",
            }}
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
});
export default ExpertisePlatform;
