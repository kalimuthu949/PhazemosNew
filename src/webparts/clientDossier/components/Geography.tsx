import * as React from "react";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "@material-ui/core/Modal";
import classes from "./Geography.module.scss";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";
import {
  createTheme,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import comStyle from "./CommonStyle.module.scss";
import CommonService from "../services/CommonService";
import CancelIcon from "@material-ui/icons/Cancel";

import { CustomAlert } from "./CustomAlert";

export interface IGeography {
  CompanyName: string;
  CompanyID: string;
  CompanyCode: string;
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
      zIndex: 1,
      "&:after": {
        content: '""',
        left: 13,
        top: 12,
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
// export const Geography: React.FunctionComponent<IGeography> = (
//   props: IGeography
// ) => {
const Geography = forwardRef((props: IGeography, ref) => {
  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const _therapeuticAreaMaster: string = "Therapeutic Area Experience Master";
  const [therapeuticArea, setTherapeuticArea] = useState([]);
  const [selTherapeuticArea, setSelTherapeuticArea] = useState([]);

  var _commonService: any = {};
  const _geography: string = "Geographic";

  const [geographyDetails, setGeographyDetails] = useState([]);

  const [deleteGeographyDetails, setDeleteGeographyDetails] = useState([]);

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

    let customProperty = {
      listName: _geography,
      properties: "*,TherapaticExperience/Title,TherapaticExperience/ID",
      filter: "CompanyIDId eq '" + props.CompanyID + "' and IsDeleted eq '0'",
      expand: "TherapaticExperience",
      orderby: "ID",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any) => {
      setGeographyDetails([]);
      setDeleteGeographyDetails([]);
      if (res && res.length > 0) {
        loadGeographyDetails(res);
      } else {
        addGeographyDetails();
      }
    });

    loadActiveTherapeuticAreaExperience();
  }

  function loadGeographyDetails(companyData: any[]) {
    let geographyDetailsModel = [];
    var selectedAreas = [];
    for (let index = 0; index < companyData.length; index++) {
      selectedAreas = [];
      for (let i = 0; i < companyData[index].TherapaticExperience.length; i++) {
        selectedAreas.push({
          therapeuticAreaID: companyData[index].TherapaticExperience[i].ID,
          therapeuticAreaTitle:
            companyData[index].TherapaticExperience[i].Title,
        });
      }
      geographyDetailsModel.push({
        CompanyIDId: props.CompanyID,
        Title: companyData[index].Title,
        CountryofResidence: companyData[index].CountryofResidence,
        //Year: companyData[index].Year,
        Year: "N/A",
        CountriesWorked: companyData[index].CountriesWorked,
        IsDeleted: false,
        ID: companyData[index].ID,
        TherapaticExperienceId: selectedAreas,
      });
    }
    setGeographyDetails([...geographyDetailsModel]);
  }

  function addGeographyDetails() {
    let geographyDetailsModel = geographyDetails;
    geographyDetailsModel.push({
      CompanyIDId: props.CompanyID,
      Title: "",
      CountryofResidence: "",
      Year: "N/A",
      CountriesWorked: "",
      IsDeleted: false,
      ID: 0,
      TherapaticExperienceId: [],
    });
    setGeographyDetails([...geographyDetailsModel]);
  }

  function removeGeographyDetails(index: number) {
    let geographyDetailsModel = geographyDetails;
    let delData = deleteGeographyDetails;
    if (geographyDetails[index].ID != 0) {
      geographyDetails[index].IsDeleted = true;
      delData.push(geographyDetails[index]);
    }
    geographyDetailsModel.splice(index, 1);
    setGeographyDetails([...geographyDetailsModel]);
    setDeleteGeographyDetails([...deleteGeographyDetails]);
  }

  function submitData() {
    let formKeys = Object.keys(geographyDetails[0]);
    let isValidForm = true;
    for (let i = 0; i < geographyDetails.length; i++) {
      for (let index = 0; index < formKeys.length; index++) {
        if (
          formKeys[index] != "ID" &&
          formKeys[index] != "IsDeleted" &&
          !geographyDetails[i][formKeys[index]]
        ) {
          let currentField = formKeys[index];
          let label = currentField;
          if (currentField == "CountryofResidence") {
            label = "Country of Residence";
          } else if (currentField == "CountriesWorked") {
            label = "Countries Worked";
          }

          setAlert({
            open: true,
            severity: "warning",
            message: label + " is required",
          });

          isValidForm = false;
          break;
        }
      }
    }
    if (!isValidForm) {
      // setAlert({
      //   open: true,
      //   severity: "warning",
      //   message: "Invalid form",
      // });
      return;
    }

    _commonService = new CommonService();

    /* start for multiple area update */
    for (let i = 0; i < geographyDetails.length; i++) {
      let newValues = [];
      for (
        let j = 0;
        j < geographyDetails[i].TherapaticExperienceId.length;
        j++
      ) {
        newValues.push(
          geographyDetails[i].TherapaticExperienceId[j].therapeuticAreaID
        );
      }
      geographyDetails[i].TherapaticExperienceId = {
        results: newValues,
      };
    }
    /* end for multiple area update */

    let allData = geographyDetails.slice();
    let addData = allData.filter((c) => c.ID == 0);
    let editData = allData.filter((c) => c.ID != 0);

    let _editData = editData.concat(deleteGeographyDetails);

    if (allData && allData.length > 0) {
      if (_editData && _editData.length > 0) {
        _commonService.bulkUpdate(
          { listName: _geography },
          _editData,
          (updateRes: any) => {
            if (addData && addData.length > 0) {
              _commonService.bulkInsert(
                { listName: _geography },
                addData,
                (createRes: any) => {
                  setAlert({
                    open: true,
                    severity: "success",
                    message: "Updated successfully",
                  });
                  init();
                  successAfterPageSave();
                }
              );
            } else {
              setAlert({
                open: true,
                severity: "success",
                message: "Updated successfully",
              });
              init();
              successAfterPageSave();
            }
          }
        );
      } else {
        if (addData && addData.length > 0) {
          _commonService.bulkInsert(
            { listName: _geography },
            addData,
            (createRes: any) => {
              setAlert({
                open: true,
                severity: "success",
                message: "Inserted successfully",
              });
              init();
              successAfterPageSave();
            }
          );
        }
      }
    } else {
      setAlert({
        open: true,
        severity: "success",
        message: "Submitted successfully",
      });
      init();
      successAfterPageSave();
    }

    // updateGeographyDetails();
    // if (addData.length) {
    //   _commonService.bulkInsert(
    //     { listName: _geography },
    //     addData,
    //     (bulkres: any) => {
    //       if (editData.length == 0) {
    //         setAlert({
    //           open: true,
    //           severity: "success",
    //           message: "Inserted successfully",
    //         });
    //         setTimeout(() => {
    //           init();
    //         }, 1000);
    //       }
    //     }
    //   );
    // }
  }

  function updateGeographyDetails() {
    let allData = geographyDetails.slice();
    let editData = allData.filter((c) => c.ID != 0);
    editData = editData.concat(deleteGeographyDetails);
    if (editData.length > 0) {
      _commonService.bulkUpdate(
        { listName: _geography },
        editData,
        (bulkres: any) => {
          setAlert({
            open: true,
            severity: "success",
            message: "Updated successfully",
          });
          setTimeout(() => {
            init();
          }, 1000);
        }
      );
    }
  }

  function inputChangeHandler(event: any, index: number): any {
    let geographyDetailsModel = geographyDetails;
    geographyDetailsModel[index][event.target.name] = event.target.value;
    setGeographyDetails([...geographyDetailsModel]);
    props.changefunction(true);
  }

  function loadActiveTherapeuticAreaExperience() {
    let customProperty = {
      listName: _therapeuticAreaMaster,
      properties: "ID,Title,IsActive",
      orderby: "OrderNo",
      orderbyAsc: true,
    };
    _commonService.getList(customProperty, (res: any[]) => {
      let therapeuticAreas = [];
      for (let index = 0; index < res.length; index++) {
        therapeuticAreas.push({
          therapeuticAreaID: res[index].ID,
          therapeuticAreaTitle: res[index].Title,
        });
      }
      setTherapeuticArea([...therapeuticAreas]);
    });
  }

  useEffect((): any => {
    _commonService = new CommonService();
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <h3 className={classes.headerTitle}>Company Profile</h3> */}
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
      <div className={comStyle.Container}>
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
        <div>
          <h4 className={classes.headerTitle}>
            Number and Type of Resource by Geography
          </h4>

          {geographyDetails.map((details: any, index: number) => {
            return (
              <div className={classes.NumberTypeSection}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ width: "92%" }}>
                    <div style={{ width: "100%" }}>
                      <TextField
                        required
                        className={classes.NTITitle}
                        id="outlined-basic"
                        label="Employee Title"
                        size="small"
                        variant="outlined"
                        name="Title"
                        value={details.Title}
                        onChange={(e) => inputChangeHandler(e, index)}
                        disabled={readOnly}
                      />
                      <TextField
                        required
                        className={classes.NTICountry}
                        id="outlined-basic"
                        label="Country of Residence"
                        size="small"
                        variant="outlined"
                        name="CountryofResidence"
                        value={details.CountryofResidence}
                        onChange={(e) => inputChangeHandler(e, index)}
                        disabled={readOnly}
                      />
                      {/* <TextField
                        required
                        className={classes.NTINum}
                        id="outlined-basic"
                        label="#"
                        variant="outlined"
                        size="small"
                        name="Year"
                        value={"TestData"}
                        onChange={(e) => inputChangeHandler(e, index)}
                        disabled={readOnly}
                        style={{ display: "none" }}
                      /> */}

                      {/* <Autocomplete
                multiple
                disableCloseOnSelect
                id="free-solo-with-text-demo"
                size="small"
                options={therapeuticArea}
                style={{ width: "23%" }}
                freeSolo
                value={details.TherapaticExperienceId}
                getOptionLabel={(option) => option.therapeuticAreaTitle}
                onChange={(event: any, newValue: any[]) => {
                  props.changefunction(true);
                  let tmpGeographyDetails = geographyDetails;
                  tmpGeographyDetails[index].TherapaticExperienceId = newValue;
                  setGeographyDetails([...tmpGeographyDetails]);
                }}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      color="primary"
                    />
                    {option.therapeuticAreaTitle}
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Therapeutic Area Experience"
                    variant="outlined"
                  />
                )}
              /> */}

                      <TextField
                        required
                        className={classes.NTIWork}
                        id="outlined-basic"
                        label="Countries Worked"
                        variant="outlined"
                        size="small"
                        name="CountriesWorked"
                        value={details.CountriesWorked}
                        onChange={(e) => inputChangeHandler(e, index)}
                        disabled={readOnly}
                      />
                    </div>

                    <Autocomplete
                      multiple
                      disabled={readOnly}
                      disableCloseOnSelect
                      id="free-solo-with-text-demo"
                      size="small"
                      options={therapeuticArea}
                      style={{ width: "calc(100% - 20px)", marginLeft: 10 }}
                      freeSolo
                      value={details.TherapaticExperienceId}
                      getOptionLabel={(option) => option.therapeuticAreaTitle}
                      onChange={(event: any, newValue: any[]) => {
                        props.changefunction(true);
                        let tmpGeographyDetails = geographyDetails;
                        tmpGeographyDetails[index].TherapaticExperienceId =
                          newValue;
                        setGeographyDetails([...tmpGeographyDetails]);
                      }}
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <CheckboxStyle
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            color="primary"
                          />
                          {option.therapeuticAreaTitle}
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Therapeutic Area Experience"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>

                  {geographyDetails.length == index + 1 && !readOnly && (
                    <AddCircleIcon
                      onClick={(e) => addGeographyDetails()}
                      className={classes.addBtn}
                    />
                  )}

                  {geographyDetails.length > 1 && !readOnly && (
                    <CancelIcon
                      className={classes.cancelBtn}
                      onClick={(e) => removeGeographyDetails(index)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!readOnly && (
        <div className={classes.bottomBtnSection}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgb(253, 204, 67)",
              color: "rgb(0,88,154) ",
              fontWeight: 700,
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
export default Geography;
