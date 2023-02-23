// import { Web, IWeb } from "@pnp/sp/webs";
// import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import {
//   SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions
// } from '@microsoft/sp-http';

import { sp } from "@pnp/sp/presets/all";

import "@pnp/sp/items/list";

export default class CompanyProfileService {

    private _primaryMap: string = "Primary Services Offered Mapping";
    private _primaryMaster: string = "Primary Services Offered Master";

    getCompanyDetails = (companyID: number) => {
        sp.web.lists
            .getByTitle(this._primaryMap)
            .items
            .select("*,PrimaryServicesMasterID/Title,CompanyID/CompanyName")
            .filter("CompanyID/ID eq '" + companyID + "'")
            .expand("PrimaryServicesMasterID,CompanyID")
            .get()
            .then((res: any) => {
                // debugger;
            });
    };

    getAllPrimaryService = () => {
        sp.web.lists
            .getByTitle(this._primaryMaster)
            .items
            .filter("IsActive eq '1'")
            .get()
            .then((res: any) => {
                // debugger;
            });
    };

    createCompanyDetails = (companyDetail: any) => {
        sp.web.lists
            .getByTitle(this._primaryMap)
            .items
            .add({

            })
            .then((res: any) => {
                // debugger;
            });
    };

    createPrimaryServiceMapping(companyId: number, companyDetails: any[]) {
        let batch = sp.web.createBatch();
        var promises = [];
        for (var i = 0; i < 10; i++) {
            promises.push(sp.web.lists.getByTitle(this._primaryMap).items.inBatch(batch)
                .add({
                    CompanyID: companyId,
                    PrimaryServicesMasterID: 3
                }));
        }
        Promise.all(promises).then(function () {
            alert("Batch items creation is completed");
        });

        batch.execute();
    }

}