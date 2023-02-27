import * as React from "react";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modal from "@material-ui/core/Modal";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Button } from "@material-ui/core";
import classes from "./ProjectWork.module.scss";
import AddIcon from "@material-ui/icons/Add";

import CommonService from "../services/CommonService";
import CancelIcon from "@material-ui/icons/Cancel";

import { CustomAlert } from "./CustomAlert";

export interface IPrimaryServicesOffered {
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
// export const PrimaryServicesOffered: React.FunctionComponent<
//   IPrimaryServicesOffered
//   > = (props: IPrimaryServicesOffered) => {
const PrimaryServicesOffered = forwardRef(
  (props: IPrimaryServicesOffered, ref) => {
    const [cusalert, setAlert] = useState({
      open: false,
      message: "Success",
      severity: "error",
    });

    const [allTicketSizes, setAllTicketSizes] = useState([]);
    const [allPrimaryServicesOffers, setAllPrimaryServicesOffers] = useState(
      []
    );
    const [newOffer, setNewOffer] = useState({});

    const [readOnly, setReadOnly] = useState(false);

    var _commonService: CommonService;

    const _projectWorkTicketDetails: string = "Project Work Ticket Details";
    const _primaryServicesOfferedMaster: string =
      "Primary Services Offered Master";

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

    function loadCompanyProjectServicesOfferedMaster(editData: any) {
      let customProperty = {
        listName: _primaryServicesOfferedMaster,
        properties: "ID,Title,IsActive",
        orderby: "OrderNo",
        orderbyAsc: true,
      };
      _commonService.getList(customProperty, (res: any) => {
        let ticketSizes = [];
        let allOffers = [];
        for (let index = 0; index < res.length; index++) {
          let editMap = editData.projectServicesOfferedMapping.filter(
            (c) => c.PrimaryServicesMasterIDId == res[index].Id
          );
          if (editMap.length || res[index].IsActive) {
            let data = {
              ID: 0,
              CompanyIDId: props.CompanyID,
              PrimaryServicesMasterIDId: res[index].Id,
              Title: res[index].Title,
              Year: "",
              Size: "",
            };
            if (editMap.length) {
              data.ID = editMap[0].ID;
              data.Year = editMap[0].Year;
              data.Size = editMap[0].Size;
              ticketSizes.push(data);
            } else {
              allOffers.push(data);
            }
          }
        }
        setAllTicketSizes([...ticketSizes]);
        setAllPrimaryServicesOffers([...allOffers]);
      });
    }

    function loadCompanyProjectServicesOfferedMapping() {
      let customProperty = {
        listName: _projectWorkTicketDetails,
        filter:
          "CompanyIDId eq '" + props.CompanyID + "'  and IsDeleted eq '0'",
      };
      _commonService.getList(customProperty, (res: any) => {
        if (res && res.length > 0) {
          loadCompanyProjectServicesOfferedMaster({
            projectServicesOfferedMapping: res,
          });
        } else {
          loadCompanyProjectServicesOfferedMaster({
            projectServicesOfferedMapping: [],
          });
        }
      });
    }

    function init() {
      if (localStorage.getItem("_IsReadOnly_")) {
        setReadOnly(true);
      } else {
        setReadOnly(false);
      }

      _commonService = new CommonService();

      loadCompanyProjectServicesOfferedMapping();
    }

    function inputChangeHandler(event: any, index: number): any {
      let tickets = allTicketSizes;
      tickets[index][event.target.name] = event.target.value;
      setAllTicketSizes([...tickets]);
      props.changefunction(true);
    }

    function submitData() {
      let isValidForm = true;
      if (!isValidForm) {
        setAlert({
          open: true,
          severity: "warning",
          message: "Invalid form",
        });
        return;
      }

      _commonService = new CommonService();
      insertOrUpdateProjectWorkMapping();
      setAlert({
        open: true,
        severity: "success",
        message: "Inserted successfully",
      });
    }

    function insertOrUpdateProjectWorkMapping() {
      let locTicketSizes = allTicketSizes.slice();
      let addData = locTicketSizes.filter((c) => c.ID == 0);
      let editData = locTicketSizes.filter((c) => c.ID != 0);
      addData.forEach((data) => {
        data.CompanyIDId = props.CompanyID;
        delete data.ID;
        delete data.Title;
      });

      editData.forEach((data) => {
        delete data.Title;
      });

      if (addData.length) {
        _commonService.bulkInsert(
          { listName: _projectWorkTicketDetails },
          addData,
          (res) => {
            init();
            successAfterPageSave();
          }
        );
      }

      if (editData.length) {
        _commonService.bulkUpdate(
          { listName: _projectWorkTicketDetails },
          editData,
          (res) => {
            init();
            successAfterPageSave();
          }
        );
      }
    }

    const selHandleChange = (event) => {
      setNewOffer(event.target.value);
    };

    const addNewOffer = (event) => {
      if (!newOffer["Title"]) return;
      let allTickets = allTicketSizes;
      let exists = allTickets.filter((c) => c.Title == newOffer["Title"]);
      if (exists.length == 0) {
        allTickets.push(newOffer);
        setAllTicketSizes([...allTickets]);
      } else {
        setAlert({
          open: true,
          severity: "warning",
          message: "Already added",
        });
      }
    };

    useEffect((): any => {
      init();
    }, []);

    return (
      <ThemeProvider theme={theme}>
        {" "}
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
                    Please click submit before moving to another tab or your
                    work will be lost
                  </span>
                </div>
                <div className={classes.popupBtn}>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    No
                  </Button>
                  <Button
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
        <div className={classes.NoAndSizeSection}>
          {allTicketSizes.length == 0 ? (
            <div>
              <strong>Note :</strong> No primary services offered selected in
              company profile
            </div>
          ) : (
            allTicketSizes.map((ticket: any, index: number) => {
              return (
                <div className={classes.NoAndSizeItem}>
                  <p>{ticket.Title}</p>
                  <div className={classes.InputSection}>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      label="#"
                      variant="outlined"
                      className={classes.TextInput}
                      value={ticket.Year}
                      name="Year"
                      onChange={(e) => inputChangeHandler(e, index)}
                      disabled={readOnly}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Size"
                      size="small"
                      variant="outlined"
                      className={ticket.Size}
                      style={{ width: "24%" }}
                      value={ticket.Size}
                      name="Size"
                      onChange={(e) => inputChangeHandler(e, index)}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
        {!readOnly && (
          <div className={classes.bottomBtnSection}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgb(253, 204, 67)",
                color: "rgb(0,88,154) ",
              }}
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
  }
);
export default PrimaryServicesOffered;
