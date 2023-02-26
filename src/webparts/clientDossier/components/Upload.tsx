import * as React from "react";
import TextField from "@material-ui/core/TextField";
import classes from "./Upload.module.scss";
import Button from "@material-ui/core/Button";
import { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { CustomAlert } from "./CustomAlert";
import { CustomDialog } from "./CustomDialog";
import CommonService from "../services/CommonService";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";

export interface IUpload {
  CompanyName: string;
  CompanyID: string;
  CompanyCode: string;
  SiteUrl: string;
  Domain: any;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#00589A",
    },
    secondary: {
      main: "#64748B",
    },
  },
});

// table design
const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.primary.main,
    // color: theme.palette.common.white,
    background: "rgb(0,88,154) ",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
    minWidth: 150,
  },
  body: {
    fontSize: 15,
    color: "#303133",
    padding: "5px 15px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
    minWidth: 150,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export const Upload: React.FunctionComponent<IUpload> = (props: IUpload) => {
  const [cusalert, setAlert] = useState({
    open: false,
    message: "Success",
    severity: "error",
  });

  const [cusDialog, setCusDialog] = useState(false);

  const [deleteData, setDeleteData] = useState({
    index: 0,
    objectName: "",
  });

  const [readOnly, setReadOnly] = useState(false);

  const [open, setOpen] = useState(false);

  let _commonService: CommonService = new CommonService();

  const [allFile, setAllFile] = useState({
    experienceSpreadsheets: {
      title: "Experience spreadsheets",
      path: props.CompanyName + "/Experience spreadsheets",
      data: [],
      objectName: "experienceSpreadsheets",
    },
    // recentMarketingCollateral: {
    //   title: "Recent marketing collateral",
    //   path: props.CompanyName + "/Recent marketing collateral",
    //   data: [],
    //   objectName: "recentMarketingCollateral",
    // },
    recentWinningProposal: {
      title: "Recent winning proposal",
      path: props.CompanyName + "/Recent winning proposal",
      data: [],
      objectName: "recentWinningProposal",
    },
    clientTestimonials: {
      title: "Client testimonials",
      path: props.CompanyName + "/Client testimonials",
      data: [],
      objectName: "clientTestimonials",
    },
    lastcompleteRFIforaclient: {
      title: "Last complete RFI for a client",
      path: props.CompanyName + "/Last complete RFI for a client",
      data: [],
      objectName: "lastcompleteRFIforaclient",
    },
    anystrategicanalysesperformedtodate: {
      title: "Any strategic analyses performed to date",
      path: props.CompanyName + "/Any strategic analyses performed to date",
      data: [],
      objectName: "anystrategicanalysesperformedtodate",
    },
    others: {
      title: "Recent marketing collateral",
      path: props.CompanyName + "/Others",
      data: [],
      objectName: "others",
    },
  });

  const [loader, setLoader] = useState(false);

  const _otherUploadMetadata: string = "Other Upload Metadata";
  const [otherUploadMetadata, setOtherUploadMetadata] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteMeta, setDeleteMeta] = useState({});
  const [metadata, setMetadata] = useState({});

  const [metaDatatoSubmit, setMetaDatatoSubmit] = useState([]);

  const [masterData, setMasterData] = useState({
    expertiseTherapeutic: [],
    expertiseRegulatory: [],
    expertisePlatform: [],
    countryofResidence: [],
    countriesWorked: [],
  });

  const _therapeuticExpertise = "Therapeutic Expertise";
  const _therapeuticExpertiseMap = "Therapeutic Area Experience Mapping";

  const _regulatoryExpertise = "Regulatory Expertise";
  const _regulatoryExpertiseMap =
    "In House Regulatory Regime Experience Mapping";

  const _expertisePlatform = "ExpertisePlatform";
  const _expertisePlatformMap = "Expertise Platform Mapping";

  const _geographic = "Geographic";

  function loadExpertiseTherapeutic() {
    let customProperty = {
      listName: _therapeuticExpertise,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res.length) {
        let mapProperty = {
          listName: _therapeuticExpertiseMap,
          filter:
            "TherapeuticExpertiseIDId eq '" +
            res[0].ID +
            "'  and IsDeleted eq '0'",
          expand: "TherapeuticAreaExpMasterID",
          properties: "*,TherapeuticAreaExpMasterID/Title",
        };
        _commonService.getList(mapProperty, (mapres: any) => {
          let data = masterData;
          data.expertiseTherapeutic = [];
          for (let index = 0; index < mapres.length; index++) {
            if (mapres[index].TherapeuticAreaExpMasterID.Title) {
              data.expertiseTherapeutic.push({
                ID: mapres[index].TherapeuticAreaExpMasterIDId,
                Title: mapres[index].TherapeuticAreaExpMasterID.Title,
              });
            }
          }
          setMasterData({ ...data });
        });
      }
    });
  }

  function loadRegulatoryExpertise() {
    let customProperty = {
      listName: _regulatoryExpertise,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res.length) {
        let mapProperty = {
          listName: _regulatoryExpertiseMap,
          filter:
            "RegulatoryExpertiseIDId eq '" +
            res[0].ID +
            "'  and IsDeleted eq '0'",
          expand: "InHouseRegulatoryRegimeExperienc",
          properties: "*,InHouseRegulatoryRegimeExperienc/Title",
        };
        _commonService.getList(mapProperty, (mapres: any) => {
          let data = masterData;
          data.expertiseRegulatory = [];
          for (let index = 0; index < mapres.length; index++) {
            if (mapres[index].InHouseRegulatoryRegimeExperienc.Title) {
              data.expertiseRegulatory.push({
                ID: mapres[index].InHouseRegulatoryRegimeExperiencId,
                Title: mapres[index].InHouseRegulatoryRegimeExperienc.Title,
              });
            }
          }
          setMasterData({ ...data });
        });
      }
    });
  }

  function loadExpertisePlatform() {
    let customProperty = {
      listName: _expertisePlatform,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res.length) {
        let mapProperty = {
          listName: _expertisePlatformMap,
          filter:
            "ExpertisePlatformIDId eq '" +
            res[0].ID +
            "'  and IsDeleted eq '0'",
          expand: "ExpertisePlatformMasterID",
          properties: "*,ExpertisePlatformMasterID/Title",
        };
        _commonService.getList(mapProperty, (mapres: any) => {
          let data = masterData;
          data.expertisePlatform = [];
          for (let index = 0; index < mapres.length; index++) {
            if (mapres[index].ExpertisePlatformMasterID.Title) {
              data.expertisePlatform.push({
                ID: mapres[index].ExpertisePlatformMasterIDId,
                Title: mapres[index].ExpertisePlatformMasterID.Title,
              });
            }
          }
          setMasterData({ ...data });
        });
      }
    });
  }

  function loadGeographic() {
    let customProperty = {
      listName: _geographic,
      filter: "CompanyIDId eq '" + props.CompanyID + "'",
    };
    _commonService.getList(customProperty, (res: any) => {
      if (res.length) {
        let data = masterData;
        data.countryofResidence = [];
        data.countriesWorked = [];
        for (let index = 0; index < res.length; index++) {
          if (res[index].CountryofResidence) {
            data.countryofResidence.push({
              ID: res[index].ID,
              Title: res[index].CountryofResidence,
            });
          }
          if (res[index].CountriesWorked) {
            data.countriesWorked.push({
              ID: res[index].ID,
              Title: res[index].CountriesWorked,
            });
          }
        }
        setMasterData({ ...data });
      }
    });
  }

  function deleteConfirmation(index: number, objectName: string) {
    let objdelete = {
      index: index,
      objectName: objectName,
    };
    setDeleteData({ ...objdelete });
    setCusDialog(true);
  }

  function deleteFile() {
    _commonService = new CommonService();
    let objAllFile = allFile;
    let files = objAllFile[deleteData.objectName].data;
    if (files[deleteData.index]["UniqueId"]) {
      let filePath =
        allFile[deleteData.objectName].path +
        "/" +
        files[deleteData.index]["Name"];
      _commonService.deleteFile(filePath, (res) => {
        files.splice(deleteData.index, 1);
        setAllFile({ ...objAllFile });
        setAlert({
          open: true,
          severity: "success",
          message: "File delete Successfully",
        });
      });
    } else {
      let objAllFile = allFile;
      let files = objAllFile[deleteData.objectName].data;
      files.splice(deleteData.index, 1);
      setAllFile({ ...objAllFile });
    }
  }

  function submitFiles() {
    processMetaData();
    setLoader(true);
    _commonService = new CommonService();
    let objAllFile = allFile;
    let modules = Object.keys(objAllFile);
    modules.forEach((module) => {
      let newFiles = objAllFile[module].data.filter((c) => !c.UniqueId);
      for (let index = 0; index < newFiles.length; index++) {
        _commonService.fileUpload(
          objAllFile[module].path,
          newFiles[index].name,
          newFiles[index]
        );
      }
    });

    setTimeout(() => {
      setLoader(false);
      init();
      setAlert({
        open: true,
        severity: "success",
        message: "File Uploaded Successfully",
      });
    }, 4000);
  }

  function loadFiles(module: any) {
    let objAllFile = allFile;
    _commonService.getFiles(objAllFile[module].path, (res) => {
      if (res.length) {
        objAllFile[module].data = res;
      } else {
        objAllFile[module].data = [];
      }
      setAllFile({ ...objAllFile });
    });
  }

  function init() {
    setDeleteMeta({});
    setMetadata({});
    setMetaDatatoSubmit([]);
    setMasterData({
      expertiseTherapeutic: [],
      expertiseRegulatory: [],
      expertisePlatform: [],
      countryofResidence: [],
      countriesWorked: [],
    });

    loadMasterData();
    loadOtherUploadMetadata();

    if (localStorage.getItem("_IsReadOnly_")) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }
    _commonService = new CommonService();
    let modules = Object.keys(allFile);
    modules.forEach((module) => {
      loadFiles(module);
    });
  }

  function openFile(file) {
    if (file.ServerRelativeUrl) {
      window.open(props.Domain + file.ServerRelativeUrl, "_blank");
    }
  }

  function selHandleChange(event: any) {
    let data = metadata;
    data[event.target.name] = event.target.value;
    setMetadata({ ...data });
  }

  function editMetadata(obj) {
    let data = metadata;
    data["ID"] = obj.ID;
    data["Title"] = obj.Title;
    data["ExpertiseTherapeutic"] = obj.ExpertiseTherapeutic;
    data["ExpertiseRegulatory"] = obj.ExpertiseRegulatory;
    data["ExpertisePlatform"] = obj.ExpertisePlatform;
    data["CountryofResidence"] = obj.CountryofResidence;
    data["CountriesWorked"] = obj.CountriesWorked;
    data["CompanyIDId"] = props.CompanyID;
    setMetadata({ ...data });
    setOpen(true);
  }

  const handleFileChange = (e: any, objectName: string) => {
    let objAllFile = allFile;
    const files = e.target.files;
    for (let index = 0; index < files.length; index++) {
      objAllFile[objectName].data.push(files[index]);
    }
    setAllFile({ ...objAllFile });
    if (objectName == "others") {
      setOpen(true);
      let data = metadata;
      data = {};
      data["Title"] = files[0].name;
      data["ExpertiseTherapeutic"] = "";
      data["ExpertiseRegulatory"] = "";
      data["ExpertisePlatform"] = "";
      data["CountryofResidence"] = "";
      data["CountriesWorked"] = "";
      data["CompanyIDId"] = props.CompanyID;
      setMetadata({ ...data });
    }
  };

  function loadMasterData() {
    loadExpertiseTherapeutic();
    loadRegulatoryExpertise();
    loadExpertisePlatform();
    loadGeographic();
  }

  function loadOtherUploadMetadata() {
    let customProperty = {
      listName: _otherUploadMetadata,
      filter: "CompanyIDId eq '" + props.CompanyID + "'  and IsDeleted eq '0'",
    };
    _commonService.getList(customProperty, (res: any[]) => {
      setOtherUploadMetadata([...res]);
    });
  }

  function showDeleteDialog(metadata) {
    setDeleteMeta({ ...metadata });
    setDeleteDialog(true);
  }

  function deleteMetadata() {
    _commonService = new CommonService();
    if (deleteMeta["ID"]) {
      deleteMeta["IsDeleted"] = true;
      _commonService.updateList(
        {
          listName: _otherUploadMetadata,
          ID: deleteMeta["ID"],
        },
        deleteMeta,
        (res: any) => {
          loadOtherUploadMetadata();
          setAlert({
            open: true,
            severity: "success",
            message: "Deleted successfully",
          });
          let delData = deleteMeta;
          delData = {};
          setDeleteMeta({ ...delData });
          setDeleteDialog(false);
        }
      );
    } else {
      let index = -1;
      for (let k = 0; k < otherUploadMetadata.length; k++) {
        if (
          !otherUploadMetadata[k].ID &&
          otherUploadMetadata[k].Title == deleteMeta["Title"]
        ) {
          index = k;
          break;
        }
      }
      let alldata = otherUploadMetadata;
      alldata.splice(index, 1);
      setOtherUploadMetadata([...alldata]);
      setDeleteDialog(false);
    }
  }

  function submitMetadata() {
    let index = -1;
    for (let k = 0; k < otherUploadMetadata.length; k++) {
      if (
        !otherUploadMetadata[k].ID &&
        otherUploadMetadata[k].Title == metadata["Title"]
      ) {
        index = k;
        break;
      }
    }

    let editindex = -1;

    for (let l = 0; l < otherUploadMetadata.length; l++) {
      if (
        otherUploadMetadata[l].ID > 0 &&
        otherUploadMetadata[l].Title == metadata["Title"]
      ) {
        editindex = l;
        break;
      }
    }

    let alldata = otherUploadMetadata;
    let postData = metadata;
    postData["CompanyIDId"] = props.CompanyID;
    if (index >= 0) {
      alldata[index]["ExpertiseTherapeutic"] = postData["ExpertiseTherapeutic"];
      alldata[index]["ExpertiseRegulatory"] = postData["ExpertiseRegulatory"];
      alldata[index]["ExpertisePlatform"] = postData["ExpertisePlatform"];
      alldata[index]["CountryofResidence"] = postData["CountryofResidence"];
      alldata[index]["CountriesWorked"] = postData["CountriesWorked"];
      alldata[index]["CompanyIDId"] = props.CompanyID;
      setOtherUploadMetadata([...alldata]);
    } else if (editindex >= 0) {
      alldata[editindex]["ExpertiseTherapeutic"] =
        postData["ExpertiseTherapeutic"];
      alldata[editindex]["ExpertiseRegulatory"] =
        postData["ExpertiseRegulatory"];
      alldata[editindex]["ExpertisePlatform"] = postData["ExpertisePlatform"];
      alldata[editindex]["CountryofResidence"] = postData["CountryofResidence"];
      alldata[editindex]["CountriesWorked"] = postData["CountriesWorked"];
      alldata[editindex]["CompanyIDId"] = props.CompanyID;
      setOtherUploadMetadata([...alldata]);
    } else {
      alldata.push(postData);
      setOtherUploadMetadata([...alldata]);
    }

    if (index > 0) {
      let sdata = metaDatatoSubmit;
      let j = -1;
      for (let l = 0; l < sdata.length; l++) {
        if (!sdata[l].ID && sdata[l].Title == metadata["Title"]) {
          j = l;
          break;
        }
      }
      sdata[j] = postData;
      setMetaDatatoSubmit([...sdata]);
    } else {
      let sdata = metaDatatoSubmit;
      sdata.push(postData);
      setMetaDatatoSubmit([...sdata]);
    }

    setOpen(false);

    // if (!postData["ID"]) {
    //   _commonService.insertIntoList(
    //     {
    //       listName: _otherUploadMetadata,
    //     },
    //     metadata,
    //     (res: any) => {
    //       setAlert({
    //         open: true,
    //         severity: "success",
    //         message: "Saved Successfully",
    //       });
    //       loadOtherUploadMetadata();
    //       setOpen(false);
    //     }
    //   );
    // } else {
    //   _commonService.updateList(
    //     {
    //       listName: _otherUploadMetadata,
    //       ID: postData["ID"],
    //     },
    //     postData,
    //     (res: any) => {
    //       setAlert({
    //         open: true,
    //         severity: "success",
    //         message: "Updated Successfully",
    //       });
    //       loadOtherUploadMetadata();
    //       setOpen(false);
    //     }
    //   );
    // }
  }

  function processMetaData() {
    let newMetadata = [];
    let updateMetadata = [];
    for (let index = 0; index < metaDatatoSubmit.length; index++) {
      let data = metaDatatoSubmit[index];
      delete data.Created;
      if (data.ID) {
        updateMetadata.push(data);
      } else {
        newMetadata.push(data);
      }
    }
    if (newMetadata.length) {
      _commonService.bulkInsert(
        {
          listName: _otherUploadMetadata,
        },
        newMetadata,
        (res) => {
          init();
        }
      );
    }
    if (updateMetadata.length) {
      _commonService.bulkUpdate(
        {
          listName: _otherUploadMetadata,
        },
        updateMetadata,
        (res) => {
          init();
        }
      );
    }
  }

  useEffect((): any => {
    _commonService = new CommonService();
    // console.log("Loaded");
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <h3 className={classes.headerTitle}>Uploads</h3> */}
      <div className={`${classes.companyDetails} disableInput`}>
        <TextField
          style={{ width: "38%", marginRight: 32 }}
          id="outlined-basic"
          label="Company Name"
          variant="outlined"
          size="small"
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
      <div className={classes.uploadSection}>
        <p className={classes.infoTitleSection}>
          Please upload any of the following (pdf, xls, doc, ppt)
        </p>
        {/* <div className={classes.uploadSection}> */}
        <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
          {Object.keys(allFile).map((module) => {
            return (
              <div className={classes.upload} style={{ width: "25%" }}>
                <p>{allFile[module].title}</p>
                <div className={classes.uploadItem}>
                  <label htmlFor={module}>
                    <input
                      style={{ display: "none" }}
                      id={module}
                      name={module}
                      type="file"
                      // multiple
                      onChange={(e) => {
                        handleFileChange(e, allFile[module].objectName);
                      }}
                      disabled={readOnly}
                    />
                    <Button
                      color="secondary"
                      variant="contained"
                      component="span"
                      disabled={readOnly}
                    >
                      Upload File
                    </Button>
                  </label>

                  {allFile[module].data.map((file: any, index: number) => {
                    return (
                      <div className={classes.SelectedFiles}>
                        <div>
                          <span className={classes.File}>
                            <span
                              className="link"
                              onClick={(e) => {
                                openFile(file);
                              }}
                            >
                              {file.Name ? file.Name : file.name}
                            </span>

                            {!readOnly && (
                              <span
                                className={classes.fileDelete}
                                onClick={(e) =>
                                  deleteConfirmation(
                                    index,
                                    allFile[module].objectName
                                  )
                                }
                              >
                                x
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal design */}
      <Modal
        open={open}
        // onClose={()=>[<
        //   setOpen(false);
        // ]}
      >
        <div className={classes.modalContainer}>
          <div></div>
          <div className={classes.modalSize}>
            {/* header section */}
            <div>
              <div className={classes.header}>
                <h3
                  style={{
                    margin: "0px 5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Meta Data Mapping
                </h3>
                <IconButton>
                  <CloseIcon
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                </IconButton>
              </div>
            </div>

            <div style={{ padding: 20 }}>
              {/* Dropdown Section starts*/}
              {/* Expertise Therapeutic */}
              <div className={classes.section}>
                <h3>Expertise Therapeutic</h3>
                <div>
                  <FormControl
                    variant="outlined"
                    size="small"
                    style={{ width: "100%", margin: "10px 0 6px 0" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Expertise Therapeutic
                    </InputLabel>
                    <Select
                      disabled={readOnly}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      label="Expertise Therapeutic"
                      name="ExpertiseTherapeutic"
                      value={metadata["ExpertiseTherapeutic"]}
                      onChange={(e) => selHandleChange(e)}
                    >
                      {masterData.expertiseTherapeutic.map((m) => {
                        return <MenuItem value={m.Title}>{m.Title}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Regulatory section */}
              <div className={classes.section}>
                <h3>Regulatory</h3>
                <div>
                  <FormControl
                    size="small"
                    variant="outlined"
                    style={{ width: "100%", margin: "10px 0px 6px 0" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Regulatory
                    </InputLabel>
                    <Select
                      disabled={readOnly}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      label=" Regulatory"
                      name="ExpertiseRegulatory"
                      value={metadata["ExpertiseRegulatory"]}
                      onChange={(e) => selHandleChange(e)}
                    >
                      {masterData.expertiseRegulatory.map((m) => {
                        return <MenuItem value={m.Title}>{m.Title}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Platform section */}
              <div className={classes.section}>
                <h3>Platform</h3>
                <div>
                  <FormControl
                    size="small"
                    variant="outlined"
                    style={{ width: "100%", margin: "10px 0px 6px 0" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Platform
                    </InputLabel>
                    <Select
                      disabled={readOnly}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      label="Category"
                      name="ExpertisePlatform"
                      value={metadata["ExpertisePlatform"]}
                      onChange={(e) => selHandleChange(e)}
                    >
                      {masterData.expertisePlatform.map((m) => {
                        return <MenuItem value={m.Title}>{m.Title}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* geography section */}
              <h3 style={{ color: "#00589A", marginTop: 8, fontSize: 16 }}>
                Geography
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "5px 0 6px 0",
                }}
              >
                <div
                  className={classes.section}
                  style={{ width: "50%", marginRight: 10 }}
                >
                  {/* <h3>Country of Residence</h3> */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FormControl
                      size="small"
                      variant="outlined"
                      style={{ width: "100%", margin: "6px 0px" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Country of Residence
                      </InputLabel>
                      <Select
                        disabled={readOnly}
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        label="Country of Residence"
                        name="CountryofResidence"
                        value={metadata["CountryofResidence"]}
                        onChange={(e) => selHandleChange(e)}
                      >
                        {masterData.countryofResidence.map((m) => {
                          return <MenuItem value={m.Title}>{m.Title}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div className={classes.section} style={{ width: "50%" }}>
                  {/* <h3>Countries Worked</h3> */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FormControl
                      size="small"
                      variant="outlined"
                      style={{ width: "100%", margin: "6px 0px" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Countries Worked
                      </InputLabel>
                      <Select
                        disabled={readOnly}
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        label="Countries Worked"
                        name="CountriesWorked"
                        value={metadata["CountriesWorked"]}
                        onChange={(e) => selHandleChange(e)}
                      >
                        {masterData.countriesWorked.map((m) => {
                          return <MenuItem value={m.Title}>{m.Title}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Dropdown section ends */}

              <div className={classes.footerSection}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(253, 204, 67)",
                    color: "rgb(0,88,154) ",
                  }}
                  size="large"
                  onClick={(e) => submitMetadata()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {!readOnly && (
        <div className={classes.bottomBtnSection}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgb(253, 204, 67)",
              color: "rgb(0,88,154) ",
            }}
            size="large"
            onClick={(e) => submitFiles()}
          >
            Submit
          </Button>
          {loader && <CircularProgress />}
        </div>
      )}

      {otherUploadMetadata.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Document Name
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Expertise-Therapeutic
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Regulatory
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Platform
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Country of Residence
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Countries Worked
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Created On
                </StyledTableCell>
                <StyledTableCell className={classes.HeaderBottomBorder}>
                  Action
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {otherUploadMetadata.map((res) => {
                return (
                  <StyledTableRow>
                    <StyledTableCell>{res.Title}</StyledTableCell>
                    <StyledTableCell>
                      {res.ExpertiseTherapeutic}
                    </StyledTableCell>
                    <StyledTableCell>{res.ExpertiseRegulatory}</StyledTableCell>
                    <StyledTableCell>{res.ExpertisePlatform}</StyledTableCell>
                    <StyledTableCell>{res.CountryofResidence}</StyledTableCell>
                    <StyledTableCell>{res.CountriesWorked}</StyledTableCell>

                    <StyledTableCell>
                      {_commonService.formattedDate(new Date(res.Created))}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button disableRipple className={classes.iconBtnStyle}>
                        <EditIcon
                          color="primary"
                          style={{ margin: 0 }}
                          onClick={(e) => editMetadata(res)}
                        />
                        <DeleteIcon
                          color="error"
                          onClick={(e) => showDeleteDialog(res)}
                        />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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

      <CustomDialog
        open={cusDialog}
        message={
          "Are you sure? Do you want to delete this file from " +
          props.CompanyName +
          " document library?"
        }
        title="Delete"
        closeDialog={(e) => {
          setCusDialog(false);
        }}
        disagree={(e) => {
          let delData = {
            index: 0,
            objectName: "",
          };
          setDeleteData({ ...delData });
          setCusDialog(false);
        }}
        agree={(e) => {
          deleteFile();
          setCusDialog(false);
        }}
      ></CustomDialog>

      <CustomDialog
        open={deleteDialog}
        message={"Are you sure? Do you want to delete this meta data?"}
        title="Delete"
        closeDialog={(e) => {
          setDeleteDialog(false);
        }}
        disagree={(e) => {
          let delData = metadata;
          delData = {};
          setDeleteMeta({ ...delData });
          setDeleteDialog(false);
        }}
        agree={(e) => {
          deleteMetadata();
        }}
      ></CustomDialog>
    </ThemeProvider>
  );
};
