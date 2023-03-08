import * as React from "react";
import TextField from "@material-ui/core/TextField";
import classes from "./TherapeuticExpertise.module.scss";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Modal from "@material-ui/core/Modal";
import {
  createTheme,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

import CommonService from "../services/CommonService";

import { CustomAlert } from "./CustomAlert";

export interface ITherapeuticExpertise {
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

const ComboCheckboxStyle = withStyles({
  root: {
    color: "rgba(0, 0, 0, 0.54) ",
    "&$checked": {
      color: "rgb(253, 204, 67)",
      position: "relative",
      zIndex: 1,
      "&:after": {
        content: '""',
        left: 12,
        top: 13,
        height: 13,
        width: 13,
        position: "absolute",
        backgroundColor: "rgb(0,88,154) !important",
        zIndex: -1,
      },
    },
  },
  checked: {},
})(Checkbox);

// export const TherapeuticExpertise: React.FunctionComponent<
//   ITherapeuticExpertise
//   > = (props: ITherapeuticExpertise) => {
const TherapeuticExpertise = forwardRef((props: ITherapeuticExpertise, ref) => {
  var _commonService: any = {};

  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const [readOnly, setReadOnly] = useState(false);

  const _therapeuticExpertise: string = "Therapeutic Expertise";
  const _therapeuticAreaMap: string = "Therapeutic Area Experience Mapping";
  const _therapeuticAreaMaster: string = "Therapeutic Area Experience Master";
  const _diseaseAreaMap: string = "Disease Area Experience Mapping";
  const _diseaseAreaMaster: string = "Disease Area Experience Master";

  const [therapeuticArea, setTherapeuticArea] = useState([]);
  const [diseaseArea, setDiseaseArea] = useState([]);
  const [selDiseaseArea, setSelDiseaseArea] = useState([]);
  const [editDiseaseArea, setEditDiseaseArea] = useState([]);

  const [companyTherapeuticArea, setCompanyTherapeuticArea] = useState({
    therapeuticExpertise: null,
    therapeuticAreaMapping: [],
    diseaseAreaMapping: [],
  });

  const [showOther, setShowOther] = useState(false);
  const [others, setOthers] = useState([]);

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

  function loadActiveTherapeuticAreaExperience(editData: any) {
    let customProperty = {
      listName: _therapeuticAreaMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let therapeuticAreas = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = editData.therapeuticAreaMapping.filter(
          (c) => c.TherapeuticAreaExpMasterIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            TherapeuticExpertiseIDId: 0,
            TherapeuticAreaExpMasterIDId: res[index].Id,
            serviceName: res[index].Title,
            IsChecked: false,
            ID: 0,
          };
          if (editMap.length) {
            data.TherapeuticExpertiseIDId = editMap[0].TherapeuticExpertiseIDId;
            data.ID = editMap[0].ID;
            data.IsChecked = true;
          }
          therapeuticAreas.push(data);
        }
      }
      therapeuticAreas = sortData(therapeuticAreas);
      setTherapeuticArea([...therapeuticAreas]);
      loadActiveDiseaseAreaExperience(editData);
    });
  }

  function sortData(Data) {
    Data.sort((a, b) =>
      a.serviceName > b.serviceName ? 1 : b.serviceName > a.serviceName ? -1 : 0
    );
    return Data;
  }

  function loadActiveDiseaseAreaExperience(editData: any) {
    let customProperty = {
      listName: _diseaseAreaMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let diseaseAreas = [];
      let selectedDiseases = [];

      for (let index = 0; index < res.length; index++) {
        let editMap = editData.diseaseAreaMapping.filter(
          (c) => c.DiseaseAreaExperienceIDId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            TherapeuticExpertiseIDId: 0,
            DiseaseAreaExperienceIDId: res[index].Id,
            serviceName: res[index].Title,
            IsChecked: false,
            ID: 0,
          };
          if (editMap.length) {
            data.TherapeuticExpertiseIDId = editMap[0].TherapeuticExpertiseIDId;
            data.ID = editMap[0].ID;
            data.IsChecked = true;
            selectedDiseases.push(data);
          }
          diseaseAreas.push(data);
        }
      }
      diseaseAreas = sortData(diseaseAreas);
      setDiseaseArea([...diseaseAreas]);
      setSelDiseaseArea([...selectedDiseases]);
      setEditDiseaseArea([...selectedDiseases]);
    });
  }

  function loadCompanyTherapeuticExpertise() {
    let customProperty = {
      listName: _therapeuticExpertise,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        loadCompanyTherapeuticAreaExperienceMapping(res[0]);
      } else {
        loadActiveTherapeuticAreaExperience({
          therapeuticExpertise: null,
          therapeuticAreaMapping: [],
          diseaseAreaMapping: [],
        });
      }
    });
  }

  function loadCompanyTherapeuticAreaExperienceMapping(res: any) {
    let customProperty = {
      listName: _therapeuticAreaMap,
      filter: "TherapeuticExpertiseIDId eq '" + res.ID + "' and IsDeleted eq 0",
      // filter: "RegulatoryExpertiseIDId eq '" + res.ID + "'",
      expand: "TherapeuticAreaExpMasterID",
      properties: "*,TherapeuticAreaExpMasterID/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      let editData: any = {};
      editData.therapeuticExpertise = res;
      editData.therapeuticAreaMapping = [...mapres];
      loadCompanyDiseaseAreaExperienceMapping(editData);
    });
  }

  function loadCompanyDiseaseAreaExperienceMapping(editData: any) {
    let customProperty = {
      listName: _diseaseAreaMap,
      filter:
        "TherapeuticExpertiseIDId eq '" +
        editData.therapeuticExpertise.ID +
        "' and IsDeleted eq 0",
      expand: "DiseaseAreaExperienceID",
      properties: "*,DiseaseAreaExperienceID/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      editData.therapeuticExpertise = editData.therapeuticExpertise;
      editData.diseaseAreaMapping = [...mapres];
      editData.therapeuticAreaMapping = editData.therapeuticAreaMapping.slice();
      setCompanyTherapeuticArea(editData);
      loadActiveTherapeuticAreaExperience(editData);
    });
  }

  function init() {
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    setShowOther(false);
    setOthers([]);

    setTherapeuticArea([]);
    setDiseaseArea([]);
    setSelDiseaseArea([]);
    setCompanyTherapeuticArea({
      therapeuticExpertise: null,
      therapeuticAreaMapping: [],
      diseaseAreaMapping: [],
    });
    loadCompanyTherapeuticExpertise();
  }

  function therapeuticAreaChangeHandler(index: number, event: any) {
    let therapeuticAreas = therapeuticArea;
    therapeuticAreas[index][event.target.name] = event.target.checked;
    setTherapeuticArea([...therapeuticAreas]);
    props.changefunction(true);
  }

  // function diseaseAreaChangeHandler(index: number, event: any) {
  //   let diseaseAreas = diseaseArea;
  //   diseaseAreas[index][event.target.name] = event.target.checked;
  //   setDiseaseArea([...diseaseArea]);
  // }

  function submitData() {
    _commonService = new CommonService();

    if (!companyTherapeuticArea.therapeuticExpertise) {
      insertTherapeuticExpertise();
    } else {
      updateTherapeuticExpertise();
    }
  }

  function insertTherapeuticExpertise() {
    let therapeuticAreaPostData: any[] = [];
    _commonService.insertIntoList(
      {
        listName: _therapeuticExpertise,
      },
      { CompanyIDId: props.CompanyID },
      (res: any) => {
        //TherapeuticArea
        let locTherapeuticArea = therapeuticArea.slice();
        locTherapeuticArea.forEach((therapeuticArea: any) => {
          if (therapeuticArea.IsChecked) {
            therapeuticAreaPostData.push({
              TherapeuticExpertiseIDId: res.data.Id,
              TherapeuticAreaExpMasterIDId:
                therapeuticArea.TherapeuticAreaExpMasterIDId,
            });
          }
        });

        //DiseaseArea
        let diseaseAreaPostData: any[] = [];
        let locDiseaseArea = selDiseaseArea.slice();
        locDiseaseArea.forEach((diseaseArea: any) => {
          if (diseaseArea.IsChecked) {
            diseaseAreaPostData.push({
              TherapeuticExpertiseIDId: res.data.Id,
              DiseaseAreaExperienceIDId: diseaseArea.DiseaseAreaExperienceIDId,
            });
          }
        });

        //TherapeuticArea
        if (therapeuticAreaPostData.length > 0) {
          _commonService.bulkInsert(
            { listName: _therapeuticAreaMap },
            therapeuticAreaPostData,
            (bulkres: any) => {
              init();
              successAfterPageSave();
            }
          );
        }

        //DiseaseArea
        if (diseaseAreaPostData.length > 0) {
          let newDisease = locDiseaseArea.filter(
            (c) => c.DiseaseAreaExperienceIDId == 0
          );

          if (newDisease.length > 0 || others.length) {
            for (let k = 0; k < others.length; k++) {
              if (others[k]) {
                newDisease.push({
                  DiseaseAreaExperienceIDId: 0,
                  ID: 0,
                  IsChecked: true,
                  TherapeuticExpertiseIDId: 0,
                  serviceName: others[k],
                });
              }
            }
            insertNewDieaseMaterData(0, res.data.Id, newDisease);
          }

          let exisitingDisease = diseaseAreaPostData.filter(
            (c) => c.DiseaseAreaExperienceIDId != 0
          );

          if (exisitingDisease.length > 0) {
            insertDiseaseMapping(exisitingDisease);
          }
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

  function insertDiseaseMapping(diseaseAreaPostData) {
    _commonService.bulkInsert(
      { listName: _diseaseAreaMap },
      diseaseAreaPostData,
      (bulkres: any) => {
        init();
      }
    );
  }

  function insertNewDieaseMaterData(
    index: number,
    therapeuticExpertiseIDId: any,
    newDisease: any[]
  ) {
    if (newDisease.length > 0 && newDisease[index].serviceName) {
      _commonService.insertIntoList(
        { listName: _diseaseAreaMaster },
        { Title: newDisease[index].serviceName, IsActive: true },
        (res) => {
          var postData = {
            TherapeuticExpertiseIDId: therapeuticExpertiseIDId,
            DiseaseAreaExperienceIDId: res.data.Id,
          };
          _commonService.insertIntoList(
            { listName: _diseaseAreaMap },
            postData,
            (res) => {}
          );

          index++;
          if (index != newDisease.length) {
            insertNewDieaseMaterData(
              index,
              therapeuticExpertiseIDId,
              newDisease
            );
          } else {
            init();
          }
        }
      );
    } else {
      if (index != newDisease.length) {
        insertNewDieaseMaterData(index, therapeuticExpertiseIDId, newDisease);
      } else {
        init();
      }
    }
  }

  function updateTherapeuticExpertise() {
    updateTherapeuticArea();
    updateDiseaseMap();
    setAlert({
      open: true,
      severity: "success",
      message: "Updated successfully",
    });
  }

  function updateTherapeuticArea() {
    let locCompanyTherapeuticArea = companyTherapeuticArea;
    let locTherapeuticArea = therapeuticArea.slice();
    let addTherapetic = locTherapeuticArea.filter(
      (c) => c.TherapeuticExpertiseIDId == 0 && c.IsChecked == true
    );
    let removedTherapetic = locTherapeuticArea.filter(
      (c) => c.TherapeuticExpertiseIDId != 0 && c.IsChecked == false
    );
    if (addTherapetic.length) {
      addTherapetic.forEach((v) => {
        v.TherapeuticExpertiseIDId =
          locCompanyTherapeuticArea.therapeuticExpertise.ID;
        delete v.serviceName;
        delete v.ID;
        delete v.IsChecked;
      });
      _commonService.bulkInsert(
        { listName: _therapeuticAreaMap },
        addTherapetic,
        (bulkres: any) => {
          init();
          successAfterPageSave();
        }
      );
    }
    if (removedTherapetic.length) {
      removedTherapetic.forEach((v) => {
        v.IsDeleted = true;
        delete v.serviceName;
        delete v.IsChecked;
      });
      _commonService.bulkUpdate(
        { listName: _therapeuticAreaMap },
        removedTherapetic,
        (bulkres: any) => {
          init();
          successAfterPageSave();
        }
      );
    }
  }

  function updateDiseaseMap() {
    let locCompanyTherapeuticArea = companyTherapeuticArea;
    let locDiseaseArea = selDiseaseArea.slice();
    let addDiseaseArea = locDiseaseArea.filter(
      (c) =>
        c.TherapeuticExpertiseIDId == 0 &&
        c.DiseaseAreaExperienceIDId != 0 &&
        c.IsChecked == true
    );

    let newDiseases = locDiseaseArea.filter(
      (c) => c.DiseaseAreaExperienceIDId == 0 && c.IsChecked == true
    );

    if (newDiseases.length > 0 || others.length) {
      for (let k = 0; k < others.length; k++) {
        if (others[k]) {
          newDiseases.push({
            DiseaseAreaExperienceIDId: 0,
            ID: 0,
            IsChecked: true,
            TherapeuticExpertiseIDId: 0,
            serviceName: others[k],
          });
        }
      }

      insertNewDieaseMaterData(
        0,
        locCompanyTherapeuticArea.therapeuticExpertise.ID,
        newDiseases
      );
    }

    var removedDiseaseArea = editDiseaseArea.filter(
      (edit) => !locDiseaseArea.some((loc) => edit.ID === loc.ID && loc.ID != 0)
    );

    if (addDiseaseArea.length) {
      addDiseaseArea.forEach(function (v) {
        v.TherapeuticExpertiseIDId =
          locCompanyTherapeuticArea.therapeuticExpertise.ID;
        delete v.serviceName;
        delete v.ID;
        delete v.IsChecked;
      });
      _commonService.bulkInsert(
        { listName: _diseaseAreaMap },
        addDiseaseArea,
        (bulkres: any) => {
          init();
          successAfterPageSave();
        }
      );
    }
    if (removedDiseaseArea.length) {
      removedDiseaseArea.forEach(function (v) {
        v.IsDeleted = true;
        delete v.serviceName;
        delete v.IsChecked;
      });
      _commonService.bulkUpdate(
        { listName: _diseaseAreaMap },
        removedDiseaseArea,
        (bulkres: any) => {
          init();
          successAfterPageSave();
        }
      );
    }
  }

  function toggleOther(event) {
    setShowOther(event.target.checked);
    if (!event.target.checked) {
      setOthers([]);
    } else {
      let allothers = others;
      allothers = [""];
      setOthers([...allothers]);
      props.changefunction(true);
    }
  }

  function otherFieldHandler(event: any, index: number): any {
    let allothers = others;
    allothers[index] = event.target.value;
    setOthers([...allothers]);
  }

  function addOthers() {
    let allothers = others;
    allothers.push("");
    setOthers([...allothers]);
  }

  function removeOthers(index: number) {
    let allothers = others;
    allothers.splice(index, 1);
    setOthers([...allothers]);
  }

  useEffect((): any => {
    _commonService = new CommonService();
    init();
  }, []);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <ThemeProvider theme={theme}>
      {/* <h3 className={classes.headerTitle}>Expertise - Therapeutic </h3> */}
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
                    color: "#fff",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Stay Here
                </Button>
                <Button
                  style={{
                    backgroundColor: "rgb(253, 204, 67)",
                    color: "rgb(0,88,154) ",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    successAfterPageSave();
                  }}
                >
                  Move to New Tab
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
        <p>Therapeutic Area Experience (check "x" all that apply)</p>

        <div className={classes.CheckboxSection}>
          {therapeuticArea.map((service: any, index: number) => {
            return (
              <div className={classes.Checkbox}>
                <FormControlLabel
                  control={
                    <CheckboxStyle
                      checked={service.IsChecked}
                      onChange={(e) => therapeuticAreaChangeHandler(index, e)}
                      name="IsChecked"
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
      <div className={classes.AreaDisease}>
        <p>Indication Experience</p>
        <Autocomplete
          multiple
          style={{ width: "60%" }}
          freeSolo
          id="checkboxes-tags-demo"
          size="small"
          options={diseaseArea}
          disableCloseOnSelect
          getOptionLabel={(option) => option.serviceName}
          value={selDiseaseArea}
          onChange={(event: any, newValue: any[]) => {
            props.changefunction(true);
            var datas = [];
            newValue.map((d) => {
              if (!d.DiseaseAreaExperienceIDId) {
                var newDisease = {
                  DiseaseAreaExperienceIDId: 0,
                  ID: 0,
                  IsChecked: true,
                  TherapeuticExpertiseIDId: 0,
                  serviceName: d,
                };
                datas.push(newDisease);
              } else {
                d.IsChecked = true;
                datas.push(d);
              }
            });
            setSelDiseaseArea([...datas]);
          }}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <ComboCheckboxStyle
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.serviceName}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Disease Area Experience"
            />
          )}
          disabled={readOnly}
        />
      </div>

      {/* Other CheckBox */}
      <div style={{ marginTop: 20 }}>
        <FormControlLabel
          control={<CheckboxStyle name="" disableRipple color="primary" />}
          onChange={(e) => toggleOther(e)}
          checked={showOther}
          label="Others"
          disabled={readOnly}
        />

        <div style={{ alignItems: "center" }}>
          {others.length > 0
            ? others.map((o, index) => {
                return (
                  <>
                    <br />
                    <TextField
                      required
                      placeholder=""
                      style={{ width: "20%" }}
                      variant="outlined"
                      size="small"
                      label="Title"
                      value={o}
                      onChange={(e) => otherFieldHandler(e, index)}
                      disabled={readOnly}
                    />

                    {others.length == index + 1 && (
                      <AddCircleIcon
                        style={{
                          fontSize: 34,
                          color: theme.palette.primary.main,
                          margin: "0px 8px 0px 8px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => addOthers()}
                      />
                    )}

                    {others.length > 1 && (
                      <CancelIcon
                        style={{
                          cursor: "pointer",
                          fontSize: 34,
                          margin: "0 8px",
                          color: theme.palette.error.main,
                        }}
                        onClick={(e) => removeOthers(index)}
                      />
                    )}
                    <br />
                  </>
                );
              })
            : ""}
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
              fontWeight: 700,
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
export default TherapeuticExpertise;
