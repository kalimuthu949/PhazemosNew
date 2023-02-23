import * as React from "react";
import { useEffect, useState } from "react";
import classes from "./Geography.module.scss";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import CommonService from "../services/CommonService";
import CancelIcon from "@material-ui/icons/Cancel";

import { CustomAlert } from "./CustomAlert";

export interface IGeography {
  CompanyName: string;
  CompanyID: string;
  CompanyCode: string;
}
const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
  },
});
export const Geography: React.FunctionComponent<IGeography> = (
  props: IGeography
) => {
  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  var _commonService: any = {};
  const _geography: string = "Geographic";

  const [geographyDetails, setGeographyDetails] = useState([]);

  const [deleteGeographyDetails, setDeleteGeographyDetails] = useState([]);

  const [readOnly, setReadOnly] = useState(false);

  function init() {
    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }

    let customProperty = {
      listName: _geography,
      filter: "CompanyIDId eq '" + props.CompanyID + "' and IsDeleted eq '0'",
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
  }

  function loadGeographyDetails(companyData: any[]) {
    let geographyDetailsModel = [];
    for (let index = 0; index < companyData.length; index++) {
      geographyDetailsModel.push({
        CompanyIDId: props.CompanyID,
        Title: companyData[index].Title,
        CountryofResidence: companyData[index].CountryofResidence,
        Year: companyData[index].Year,
        CountriesWorked: companyData[index].CountriesWorked,
        IsDeleted: false,
        ID: companyData[index].ID,
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
      Year: "",
      CountriesWorked: "",
      IsDeleted: false,
      ID: 0,
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
          // console.log(label + " is required");

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
                }
              );
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
  }

  useEffect((): any => {
    _commonService = new CommonService();
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <h3 className={classes.headerTitle}>Company Profile</h3> */}
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
              <TextField
                required
                className={classes.NTINum}
                id="outlined-basic"
                label="#"
                variant="outlined"
                size="small"
                name="Year"
                value={details.Year}
                onChange={(e) => inputChangeHandler(e, index)}
                disabled={readOnly}
              />
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
          );
        })}
      </div>

      {!readOnly && (
        <div className={classes.bottomBtnSection}>
          <Button
            variant="contained"
            color="primary"
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
};
