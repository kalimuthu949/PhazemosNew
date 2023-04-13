import { Web, IWeb } from "@pnp/sp/webs";
import {
    SPHttpClient, SPHttpClientResponse
} from '@microsoft/sp-http';
import { sp } from "@pnp/sp/presets/all";



interface ICustomProperty {
    ID?: number;
    listName: any;
    context?: any;
    properties?: string;
    filter?: string;
    expand?: string;
    orderby?: string;
    orderbyAsc?: boolean;
    currentPage?: number;
    recordsPerPage?: number;
}


export default class CommonService {

    public webUrl: string = '';

    public insertIntoList = (customProperty: ICustomProperty, postData: any, callBack: any) => {
        sp.web.lists
            .getByTitle(customProperty.listName)
            .items
            .add(postData)
            .then((res: any) => {
                callBack(res);
            });
    };

    public updateList = (customProperty: ICustomProperty, postData: any, callBack?: any) => {
        sp.web.lists
            .getByTitle(customProperty.listName)
            .items
            .getById(customProperty.ID)
            .update(postData)
            .then((res: any) => {
                if (callBack) {
                    callBack(res);
                }
            });
    };

    public getList(customProperty: ICustomProperty, callBack: any) {
        var web: IWeb = Web(this.webUrl);

        ////Get List data with pagination
        if (!customProperty.properties) {
            customProperty.properties = '';
        }
        if (!customProperty.filter) {
            customProperty.filter = '';
        }
        if (!customProperty.expand) {
            customProperty.expand = '';
        }
        if (!customProperty.orderby) {
            customProperty.orderby = 'ID';
            customProperty.orderbyAsc = false;
        }
        if (!customProperty.orderbyAsc) {
            customProperty.orderbyAsc = false;
        }

        web.lists
            .getByTitle(customProperty.listName)
            .items.select(customProperty.properties)
            .expand(customProperty.expand)
            .filter(customProperty.filter)
            .orderBy(customProperty.orderby, customProperty.orderbyAsc)
            .top(5000)
            .get().then(res => {
                callBack(res);
            });
    }



    public getPagedList(customProperty: ICustomProperty, callBack: any) {
        var take = customProperty.recordsPerPage;
        var skip = (customProperty.currentPage * customProperty.recordsPerPage) - customProperty.recordsPerPage;
        var web: IWeb = Web(this.webUrl);

        ////Get count of the list
        var getUrl = customProperty.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('" + customProperty.listName + "')/ItemCount";

        if (customProperty.properties) {
            getUrl += "?$select=" + customProperty.properties;
        }
        if (customProperty.expand) {
            getUrl += "&$expand=" + customProperty.expand;
        }
        if (customProperty.filter) {
            getUrl += "&$filter=" + customProperty.filter;
        }

        customProperty.context.spHttpClient.get(getUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON != null && responseJSON.value != null) {
                            let itemCount: number = parseInt(responseJSON.value.toString());

                            ////Get List data with pagination
                            if (!customProperty.properties) {
                                customProperty.properties = '';
                            }
                            if (!customProperty.filter) {
                                customProperty.filter = '';
                            }
                            if (!customProperty.expand) {
                                customProperty.expand = '';
                            }

                            web.lists
                                .getByTitle(customProperty.listName)
                                .items.select(customProperty.properties)
                                .expand(customProperty.expand)
                                .filter(customProperty.filter)
                                .skip(skip)
                                .top(take)
                                .get().then(res => {
                                    callBack({
                                        count: itemCount,
                                        data: res
                                    });
                                });

                        }
                    });
                }
            });
    }


    bulkInsert(customProperty: ICustomProperty, postData: any[], callBack?: any) {
        let listName = sp.web.lists.getByTitle(customProperty.listName);
        try {
            listName.getListItemEntityTypeFullName().then((entityTypeFullName: any) => {
                let createBatchRequest = sp.web.createBatch();
                for (var i = 0; i < postData.length; i++) {
                    listName.items.inBatch(createBatchRequest)
                        .add(postData[i], entityTypeFullName);
                }
                createBatchRequest.execute().then((createdResponse: any) => {
                    if (callBack) {
                        callBack(createdResponse);
                    }
                    // console.log("All Item Added")
                }).catch((error) => {
                    console.log(error);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }


    bulkUpdate(customProperty: ICustomProperty, postData: any[], callBack?: any) {
        let listName = sp.web.lists.getByTitle(customProperty.listName);
        try {
            listName.getListItemEntityTypeFullName().then((entityTypeFullName: any) => {
                let createBatchRequest = sp.web.createBatch();
                for (var i = 0; i < postData.length; i++) {
                    let data = postData[i];
                    let id = postData[i].ID;
                    delete postData[i].ID;
                    listName.items.getById(id).inBatch(createBatchRequest)
                        .update(data, '*', entityTypeFullName);
                }
                createBatchRequest.execute().then((createdResponse: any) => {
                    if (callBack) {
                        callBack(createdResponse);
                    }
                    // console.log("All Item Updated")
                }).catch((error) => {
                    console.log(error);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    public formattedDate(date) {
        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
    }

}