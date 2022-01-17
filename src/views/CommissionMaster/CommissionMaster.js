
import React, { useEffect, useState } from "react";
// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import MasterComForm from '../../components/Forms/MasterCommissionForm/MasterCommissionForm'
import GridItem from "../../components/Grid/GridItem.js";
import BigDataGrid from '../../components/BigDataGrid/BigDataGrid.js'
import * as dataCollection from '../../dataCollection/dataCollections'
import socket from "../../socket";
import axios from "axios";

export default function CommissionMaterComp() {
  
  const [commissionList, setCommissionList] = useState([])

  const getCommissionList = async () => {
    const response = await axios.get("https://xnesdeskserver.herokuapp.com/api/commission", { mode: 'cors' });
    const commissionListData = response.data;
   
    const sorted = await commissionListData.sort(function (a, b) { return (b.id - a.id); })
    // console.log(sorted)
    await setCommissionList(sorted)
  }

  useEffect(async () => {
    await getCommissionList();
    socket.on("commission-request-added", async () => {
      await getCommissionList();
    })
    socket.on("commission-request-responded", async () => {
      await getCommissionList();
    })
  }, []);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <MasterComForm />
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <BigDataGrid
            rows={commissionList}
            colum={dataCollection.commissionColumn}
            header={'Commission Requests List'} />
        </GridItem>
      </GridContainer>
    </div>
  );
}