import * as React from "react";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "@material-ui/core/Modal";
import classes from "./RegulatoryExpertise.module.scss";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import {
  createTheme,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import CommonService from "../services/CommonService";

import { CustomAlert } from "./CustomAlert";

export interface IRegulatoryExpertise {
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

// export const RegulatoryExpertise: React.FunctionComponent<
//   IRegulatoryExpertise
//   > = (props: IRegulatoryExpertise) => {

const RegulatoryExpertise = forwardRef((props: IRegulatoryExpertise, ref) => {
  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  var _commonService: any = {};
  const _regulatoryExpertise: string = "Regulatory Expertise";
  const _regulatoryExpertiseMap: string =
    "In House Regulatory Regime Experience Mapping";
  const _regulatoryExpertiseMaster: string =
    "In House Regulatory Regime Experience Master";

  const [regulatoryExpertises, setRegulatoryExpertises] = useState([]);

  const [selExpertises, setSelRegulatoryExpertises] = useState([]);
  const [editRegulatoryExpertises, setEditRegulatoryExpertises] = useState([]);

  const [showOther, setShowOther] = useState(false);
  const [others, setOthers] = useState([]);

  const [othersComment, setOthersComment] = useState({
    isChecked: false,
    comments: "",
  });

  const [companyRegulatoryExpertise, setcompanyRegulatoryExpertise] = useState({
    regulatoryExpertise: null,
    regimeExperienceMapping: [],
  });

  const [readOnly, setReadOnly] = useState(false);

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

  function init() {
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    setShowOther(false);
    setOthers([]);

    let customProperty = {
      listName: _regulatoryExpertise,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res && res.length > 0) {
        loadCompanyRegimeExperienceMapping(res[0]);
      } else {
        setRegulatoryExpertises([]);
        setOthersComment({
          isChecked: false,
          comments: "",
        });
        setcompanyRegulatoryExpertise({
          regulatoryExpertise: null,
          regimeExperienceMapping: [],
        });
        loadRegulatoryExpertise({
          regulatoryExpertise: null,
          regimeExperienceMapping: [],
        });
      }
    });
  }

  function loadCompanyRegimeExperienceMapping(res: any) {
    if (res.OtherComments) {
      let comment = othersComment;
      othersComment.comments = res.OtherComments;
      othersComment.isChecked = true;
      setOthersComment(comment);
    }
    let customProperty = {
      listName: _regulatoryExpertiseMap,
      filter: "RegulatoryExpertiseIDId eq '" + res.ID + "' and IsDeleted eq 0",
      expand: "InHouseRegulatoryRegimeExperienc",
      properties: "*,InHouseRegulatoryRegimeExperienc/Title",
    };
    _commonService.getList(customProperty, (mapres: any) => {
      let editData: any = {};
      editData.regulatoryExpertise = res;
      editData.regimeExperienceMapping = [...mapres];
      setcompanyRegulatoryExpertise(editData);
      loadRegulatoryExpertise(editData);
    });
  }

  function loadRegulatoryExpertise(editData: any) {
    let customProperty = {
      listName: _regulatoryExpertiseMaster,
      properties: "ID,Title,IsActive",
      // filter: "IsActive eq '1'",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let regulatoryExpertises: any[] = [];
      let editRegulatoryExpertises: any[] = [];
      for (let index = 0; index < res.length; index++) {
        let editMap = editData.regimeExperienceMapping.filter(
          (c) => c.InHouseRegulatoryRegimeExperiencId == res[index].Id
        );
        if (editMap.length || res[index].IsActive) {
          let data = {
            InHouseRegulatoryRegimeExperiencId: res[index].Id,
            Title: res[index].Title,
            IsChecked: false,
            RegulatoryExpertiseIDId: 0,
            RegulatoryExperienceMappingID: 0,
          };
          if (editMap.length) {
            data.RegulatoryExpertiseIDId = editMap[0].RegulatoryExpertiseIDId;
            data.RegulatoryExperienceMappingID = editMap[0].ID;
            data.IsChecked = true;
            editRegulatoryExpertises.push(data);
          }
          regulatoryExpertises.push(data);
        }
      }
      regulatoryExpertises = sortData(regulatoryExpertises);
      setRegulatoryExpertises([...regulatoryExpertises]);
      setSelRegulatoryExpertises([...editRegulatoryExpertises]);
      setEditRegulatoryExpertises([...editRegulatoryExpertises]);
    });
  }
  function sortData(Data) {
    Data.sort((a, b) => (a.Title > b.Title ? 1 : b.Title > a.Title ? -1 : 0));
    return Data;
  }
  function changeHandler(event: any): any {
    let comment = othersComment;
    comment.comments = event.target.value;
    setOthersComment({ ...comment });
    props.changefunction(true);
  }

  function submitData() {
    let checkedDatas = regulatoryExpertises.filter((d) => d.IsChecked == true);
    // if (checkedDatas.length == 0) {
    //   setAlert({
    //     open: true,
    //     severity: "warning",
    //     message: "Select any once expertise",
    //   });
    //   return;
    // }
    if (othersComment.isChecked) {
      if (!othersComment.comments) {
        setAlert({
          open: true,
          severity: "warning",
          message: "Please give comments",
        });
        return;
      }
    }
    // if (others.length) {
    //   for (let index = 0; index < others.length; index++) {
    //     if (!others[index]) {
    //       setAlert({
    //         open: true,
    //         severity: "warning",
    //         message: "Please enter the value",
    //       });
    //       return;
    //     }
    //   }
    // }
    if (!companyRegulatoryExpertise.regulatoryExpertise) {
      insertNewRegulatoryExpertise();
    } else {
      updateRegulatoryExpertise();
    }
  }

  function insertNewRegulatoryExpertise() {
    _commonService = new CommonService();
    let expertisePostData = {
      CompanyIDId: props.CompanyID,
      OtherComments: null as any,
    };
    if (othersComment.isChecked) {
      expertisePostData.OtherComments = othersComment.comments;
    }

    let allLocRegulatoryExpertises = selExpertises.slice();
    let locRegulatoryExpertises = allLocRegulatoryExpertises.filter(
      (c) => c.InHouseRegulatoryRegimeExperiencId != 0
    );

    _commonService.insertIntoList(
      {
        listName: _regulatoryExpertise,
      },
      expertisePostData,
      (res: any) => {
        let regulatoryExpertisePostData: any[] = [];
        locRegulatoryExpertises.forEach((regulatoryExpertise: any) => {
          let newMasterData = allLocRegulatoryExpertises.filter(
            (c) => c.InHouseRegulatoryRegimeExperiencId == 0
          );
          if (newMasterData.length || others.length) {
            for (let k = 0; k < others.length; k++) {
              if (others[k]) {
                newMasterData.push({
                  InHouseRegulatoryRegimeExperiencId: 0,
                  IsChecked: true,
                  RegulatoryExperienceMappingID: 0,
                  RegulatoryExpertiseIDId: 0,
                  Title: others[k],
                });
              }
            }
            insertNewInHouseRegulatoryMaster(0, res.data.Id, newMasterData);
          }

          if (regulatoryExpertise.IsChecked) {
            regulatoryExpertisePostData.push({
              RegulatoryExpertiseIDId: res.data.Id,
              InHouseRegulatoryRegimeExperiencId:
                regulatoryExpertise.InHouseRegulatoryRegimeExperiencId,
            });
          }
        });
        if (regulatoryExpertisePostData.length) {
          _commonService.bulkInsert(
            { listName: _regulatoryExpertiseMap },
            regulatoryExpertisePostData,
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
  }

  function updateRegulatoryExpertise() {
    _commonService = new CommonService();

    _commonService.updateList(
      {
        listName: _regulatoryExpertise,
        ID: companyRegulatoryExpertise.regulatoryExpertise.ID,
      },
      { OtherComments: othersComment.comments }
    );

    let allLocRegulatoryExpertises = selExpertises.slice();
    let locRegulatoryExpertises = allLocRegulatoryExpertises.filter(
      (c) => c.InHouseRegulatoryRegimeExperiencId != 0
    );

    let newMasterData = allLocRegulatoryExpertises.filter(
      (c) => c.InHouseRegulatoryRegimeExperiencId == 0
    );
    if (newMasterData.length || others.length) {
      for (let k = 0; k < others.length; k++) {
        if (others[k]) {
          newMasterData.push({
            InHouseRegulatoryRegimeExperiencId: 0,
            IsChecked: true,
            RegulatoryExperienceMappingID: 0,
            RegulatoryExpertiseIDId: 0,
            Title: others[k],
          });
        }
      }

      insertNewInHouseRegulatoryMaster(
        0,
        companyRegulatoryExpertise.regulatoryExpertise.ID,
        newMasterData
      );
    }

    let newRegulatoryExpertises = locRegulatoryExpertises.filter(
      (c) => c.RegulatoryExpertiseIDId == 0 && c.IsChecked == true
    );
    if (newRegulatoryExpertises.length) {
      newRegulatoryExpertises.forEach(function (v) {
        v.RegulatoryExpertiseIDId =
          companyRegulatoryExpertise.regulatoryExpertise.ID;
        delete v.Title;
        delete v.IsChecked;
        delete v.RegulatoryExperienceMappingID;
      });

      _commonService.bulkInsert(
        { listName: _regulatoryExpertiseMap },
        newRegulatoryExpertises,
        (bulkres: any) => {
          init();
          successAfterPageSave();
        }
      );
    }

    var removedRegulatoryExpertises = editRegulatoryExpertises.filter(
      (edit) =>
        !locRegulatoryExpertises.some(
          (loc) =>
            edit.RegulatoryExperienceMappingID ===
              loc.RegulatoryExperienceMappingID &&
            loc.RegulatoryExperienceMappingID != 0
        )
    );

    if (removedRegulatoryExpertises.length) {
      removedRegulatoryExpertises.forEach(function (v) {
        v.IsDeleted = true;
        v.ID = v.RegulatoryExperienceMappingID;
        delete v.Title;
        delete v.IsChecked;
        delete v.RegulatoryExperienceMappingID;
      });

      _commonService.bulkUpdate(
        { listName: _regulatoryExpertiseMap },
        removedRegulatoryExpertises,
        (bulkres: any) => {
          init();
          successAfterPageSave();
        }
      );
    }
    setAlert({
      open: true,
      severity: "success",
      message: "Updated successfully",
    });
  }

  function insertNewInHouseRegulatoryMaster(
    index: number,
    regulatoryRegimeExperienceID: any,
    newInHouseRegulatoryMaster: any[]
  ) {
    if (
      newInHouseRegulatoryMaster.length > 0 &&
      newInHouseRegulatoryMaster[index].Title
    ) {
      _commonService.insertIntoList(
        { listName: _regulatoryExpertiseMaster },
        { Title: newInHouseRegulatoryMaster[index].Title, IsActive: true },
        (res) => {
          var postData = {
            RegulatoryExpertiseIDId: regulatoryRegimeExperienceID,
            InHouseRegulatoryRegimeExperiencId: res.data.Id,
          };
          _commonService.insertIntoList(
            { listName: _regulatoryExpertiseMap },
            postData,
            (res) => {}
          );

          index++;
          if (index != newInHouseRegulatoryMaster.length) {
            insertNewInHouseRegulatoryMaster(
              index,
              regulatoryRegimeExperienceID,
              newInHouseRegulatoryMaster
            );
          } else {
            init();
          }
        }
      );
    } else {
      if (index != newInHouseRegulatoryMaster.length) {
        insertNewInHouseRegulatoryMaster(
          index,
          regulatoryRegimeExperienceID,
          newInHouseRegulatoryMaster
        );
      } else {
        init();
        successAfterPageSave();
      }
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
      {/* <h3 className={classes.headerTitle}>Expertise - Regulatory </h3> */}
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

      <div style={{ margin: "20px 0px" }}>
        <Autocomplete
          multiple
          style={{ width: "60%" }}
          freeSolo
          id="checkboxes-tags-demo"
          options={regulatoryExpertises}
          size="small"
          disableCloseOnSelect
          getOptionLabel={(option) => option.Title}
          value={selExpertises}
          onChange={(event: any, newValue: any[]) => {
            props.changefunction(true);
            let othersChecked = false;
            var datas = [];
            newValue.map((d) => {
              let data = {};
              if (!d.Title) {
                data = {
                  InHouseRegulatoryRegimeExperiencId: 0,
                  IsChecked: true,
                  RegulatoryExperienceMappingID: 0,
                  RegulatoryExpertiseIDId: 0,
                  Title: d,
                };
              } else {
                if (d.Title == "Other") {
                  othersChecked = true;
                }
                d.IsChecked = true;
                data = d;
              }
              datas.push(data);
            });
            let otherComment = {
              isChecked: othersChecked,
              comments: othersComment.comments,
            };
            if (!othersChecked) {
              otherComment.comments = null;
            }
            setOthersComment({ ...otherComment });
            setSelRegulatoryExpertises([...datas]);
          }}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <CheckboxStyle
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.Title}
            </React.Fragment>
          )}
          //   style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="In House Regulatory Regime Experience"
              placeholder=""
            />
          )}
          disabled={readOnly}
        />
      </div>

      {/* <div style={{ display: "flex" }}> */}
      <div>
        <FormControlLabel
          control={<CheckboxStyle name="" disableRipple />}
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

      {othersComment.isChecked && (
        <div className={classes.companyDetails}>
          <TextField
            required
            style={{ width: "40%", marginRight: 30 }}
            id="outlined-basic"
            label="Comments"
            variant="outlined"
            name="Comments"
            value={othersComment.comments}
            onChange={(e) => changeHandler(e)}
            disabled={readOnly}
          />
        </div>
      )}

      {!readOnly && (
        <div className={classes.bottomBtnSection}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgb(253, 204, 67)",
              color: "rgb(0,88,154) ",
            }}
            size="large"
            onClick={submitData}
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

export default RegulatoryExpertise;
