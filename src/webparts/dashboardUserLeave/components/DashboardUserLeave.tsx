import * as React from 'react';
import type { IDashboardUserLeaveProps } from './IDashboardUserLeaveProps';
import { DatePicker, mergeStyles, PrimaryButton, values } from '@fluentui/react';
import { buttonClassNames, Dropdown ,Input,Option, OptionOnSelectData, SelectionEvents } from '@fluentui/react-components';
import {
  AttachRegular,
  DocumentArrowDown24Regular,
  EditOff24Regular,
} from "@fluentui/react-icons";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
} from "@fluentui/react-components";
import { spfi, SPFI, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { DeleteRegular,InfoRegular ,} from "@fluentui/react-icons";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
} from "@fluentui/react-components";




const dateClass = mergeStyles({
  backgroundColor:'white',
  maxWidth: "300px",
  height:"30px",
});





const wrapper = mergeStyles({
  display: "flex",
  gap: "20px",
});


const dialogSurface = mergeStyles({
  boxShadow: "0px 4px 10px rgba(0, 0, 45, 0.1)", // Customize shadow here if needed
  borderRadius: "8px", // Optional: for rounded corners
  backgroundColor:'white',
});

const backdrop = mergeStyles({
  backgroundColor: "rgba(0, 0, 0, 0.8)", // Full black background with slight opacity
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999, // Ensures the backdrop covers the whole screen
})







const dropdownClass = mergeStyles({
  justifyItems: "start",
  gap: "2px",
  width:'150px'
});


const confirmButtonClass = mergeStyles({
  display: 'flex',
  backgroundColor:'#F36A06',
  color:'white',
  marginLeft:'auto',
  marginTop:'10px',
  marginRight:'auto',
  borderRadius:'20px',
  height:'15px'
})




export default class DashboardUserLeave extends React.Component<IDashboardUserLeaveProps , {}> {
  public state={
    options:['choix1','choix2','choix3'],
    options1:['En cours','Acceptée','Rejetée'],
    columns:["Motif d'absence",'Date début','Date fin','Status','Action','Détails'],
    fetcheditem: [] as any,
    open: false,
    statut: '',
    startDate:'',
    filteredItems:[] as any,
    startdate_upd :"",
    enddate_upd : "",
    motif_upd:'',    
    endDate: ''
  };

  private sp: SPFI;

  public async componentDidMount(): Promise<void> {
    this.sp = spfi().using(SPFx(this.props.context));
    await this.getListItems();
  };


  private async getListItems(): Promise<void> {
    try {
      const items = await this.sp.web.lists.getByTitle("leaveList").items();
      const fetchedItem = items.filter(item => item.UserID === '45');
      console.log(items)
      console.log(fetchedItem)      
      this.setState({ fetcheditem: fetchedItem, filteredItems: fetchedItem });

    } catch (error) {
      console.error("Error fetching list items: ", error);
    }
  };




  private updateItem = async (item: any) => {
    console.log(item.ID)
    const id = item.ID;
    const updateFields: any = {
      UpdateDate: new Date(),
    };
    
    if (this.state.motif_upd) {
      updateFields.AbsenceReason = this.state.motif_upd;
    }
    if (this.state.startdate_upd) {
      updateFields.StartDate = new Date(this.state.startdate_upd);
    }
    if (this.state.enddate_upd) {
      updateFields.EndDate = new Date(this.state.enddate_upd);
    }
    
    await this.sp.web.lists.getByTitle("leaveList").items.getById(id).update(updateFields);
    console.log('set')
    this.getListItems();
  };



  private _deleteItem = async () => {
    await this.sp.web.lists.getByTitle("leaveList").items.getById(10).delete();
    this.getListItems();
  };
  

  handleChange = (event: SelectionEvents, data: OptionOnSelectData) => {
    this.setState({statut:data.optionValue});
  };

  setOpen = (value: boolean) => {
    this.setState({ open: value });
  };

  handeldelete=()=>{
    console.log('clicked')
    this._deleteItem();
  };


  selectdate=(date)=>{
    this.setState({startDate:String(date)});
  };


  selectdate_2=(date)=>{
    this.setState({endDate:String(date)});
  };


  


  private filterItems = () => {
    const { fetcheditem, statut, startDate,endDate } = this.state;
  
    const filtered = fetcheditem.filter((item) => {
      const matchesStatut = !statut || item.Status === statut;
      const matchesDate = !startDate || new Date(item.StartDate) >= new Date(startDate);
      const matchesDate2 = !endDate || new Date(item.EndDate) <= new Date(endDate);
      return matchesStatut && matchesDate && matchesDate2;
    });
  
    this.setState({ filteredItems: filtered });
  };

  handleabsChange = (event: SelectionEvents, data: OptionOnSelectData) => {
    this.setState({motif_upd:data.optionValue});
  };

  selectStart=(date)=>{
    this.setState({startdate_upd:String(date)});
  }
  selectEnd=(date)=>{
    this.setState({enddate_upd:String(date)});
  }

  handleattachmentFile = async (item: any) => {
    try {
      const itemData = await this.sp.web.lists
        .getByTitle("leaveList")
        .items.getById(item.ID)
        .select("AttachmentFiles")
        .expand("AttachmentFiles")();
  
      const attachmentFiles = itemData.AttachmentFiles;
  
      if (attachmentFiles.length > 0) {
        const attachmentUrl = attachmentFiles[0].ServerRelativeUrl;
        const currentURL = this.props.context.pageContext.web.absoluteUrl;
        const tenantUrl = currentURL.split("/sites/")[0];
        const absoluteUrl = `${tenantUrl}${attachmentUrl}`;
  
        window.open(absoluteUrl, "_blank");
      } else {
        console.warn("No attachments found for this item.");
      }
    } catch (error) {
      console.error("Error opening attachment:", error);
    }
  };




  public render(): React.ReactElement<IDashboardUserLeaveProps> {

    console.log(this.state)


    return (
      <div>

        <strong>Filtres</strong>
        <div style={{display:'flex',flexDirection:'row',gap:'20px',height:'35px'}}>
          <div style={{display:'flex',flexDirection:'row',gap:'0px'}} >
            <p style={{marginRight:'10px'}} >Statut </p>
            <div style={{height:'15px',marginTop:'11px'}}>
            <Dropdown className={dropdownClass} onOptionSelect={this.handleChange} placeholder="Choisir" >
              {this.state.options1.map((option) => (
                <Option style={{backgroundColor:'white'}} key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
            </div>
          </div>



          <div style={{display:'flex',flexDirection:'row',gap:'0px'}} >
            <p style={{marginRight:'10px'}}>Date début </p>
            <div style={{height:'15px',marginTop:'11px'}}>
            <DatePicker
              className={dateClass}
              placeholder="Select a date..."
              onSelectDate={this.selectdate}
            />
            </div>
          </div>



          <div style={{display:'flex',flexDirection:'row',gap:'0px'}} >
            <p style={{marginRight:'10px'}}>Date fin </p>
            <div style={{height:'15px',marginTop:'11px'}}>
            <DatePicker
              className={dateClass}
              placeholder="Select a date..."
              onSelectDate={this.selectdate_2}
            />
            </div>
          </div>





          <PrimaryButton onClick={this.filterItems} className={confirmButtonClass}>REFRAICHIR</PrimaryButton>
          <PrimaryButton className={confirmButtonClass}>CREER UNE DEMANDE</PrimaryButton>
        </div>




        <div style={{marginTop:'30px'}}>

        <Table arial-label="Default table" style={{ minWidth: "510px" }}>
          <TableHeader>
            <TableRow style={{backgroundColor:'#23365E'}}>
              {this.state.columns.map((column) => (
                <TableHeaderCell >
                  <strong style={{color:'white'}}>{column}</strong>
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.filteredItems.map((item) => (
              <TableRow>



                <TableCell>
                  <TableCellLayout>
                  {item.Attachments &&
                  <AttachRegular style={{cursor:'pointer'}} onClick={()=>this.handleattachmentFile(item)} />
                  }
                    {item.AbsenceReason}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  {item.StartDate}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  {item.EndDate}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  {item.Status}
                  </TableCellLayout>
                </TableCell>



                <TableCell>
                  <TableCellLayout>
                  <div style={{display:'flex',flexDirection:'row',gap:'12px'}}>

                  <div  style={{display:'flex',cursor:'pointer',}} className={wrapper}>
                    <Dialog>
                      <DialogTrigger disableButtonEnhancement>
                        <EditOff24Regular style={{width:'14px',height:'14px'}} />
                      </DialogTrigger>
                      <div className={backdrop}>
                      <DialogSurface className={dialogSurface}>
                        {item.Status==="En cours" ?
                        <DialogBody style={{marginLeft:'auto',marginRight:'auto'}}>
                          <DialogTitle><strong>MODIFIER:</strong></DialogTitle>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
                            
                            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Motif d'absence</label>
                            <div style={{ width: '100%' }}>
                              <Dropdown  
                                onOptionSelect={this.handleabsChange} 
                                placeholder="Choisir"
                              >
                                {this.state.options.map((option) => (
                                  <Option 
                                    key={option} 
                                    value={option} 
                                    style={{ backgroundColor: 'white' }}
                                  >
                                    {option}
                                  </Option>
                                ))}
                              </Dropdown>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Date de début</label>
                              <div style={{ width: '100%' }}>
                                <DatePicker
                                  style={{ width: '100%' }}
                                  placeholder="Select a date..."
                                  onSelectDate={this.selectStart}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Date fin</label>
                              <div style={{ width: '100%' }}>
                                <DatePicker
                                  style={{ width: '100%' }}
                                  placeholder="Select a date..."
                                  onSelectDate={this.selectEnd}
                                />
                              </div>
                            </div>

                            <PrimaryButton
                              onClick={() => { this.updateItem(item); }}
                              style={{
                                height: '24px',
                                backgroundColor: '#23365E',
                                borderRadius: '25px',
                                marginTop: '20px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: 'none'
                              }}
                            >
                              Confirmer
                            </PrimaryButton>

                          </div>

                        </DialogBody>
                        :
                        <DialogBody>
                          <p>you cant</p>
                        </DialogBody>
                      }
                      </DialogSurface>
                      </div>
                    </Dialog>
                  </div>


                  <div style={{display:'flex',cursor:'pointer'}} className={wrapper}>
                    <Dialog>
                      <DialogTrigger disableButtonEnhancement>
                        <DeleteRegular/>
                      </DialogTrigger>
                      <div className={backdrop}>
                      <DialogSurface className={dialogSurface}>
                        <DialogBody>
                          <DialogTitle><strong>Annulation de demande :</strong></DialogTitle>
                          <p>Voulez-vous vraiment annuler cette demande</p>
                          <PrimaryButton onClick={this.handeldelete} style={{height:'24px',backgroundColor:'#23365E' ,borderRadius:'25px',marginTop:'20px' }}>
                            Annuler la demande
                          </PrimaryButton>
                        </DialogBody>
                      </DialogSurface>
                      </div>
                    </Dialog>
                  </div>

                  </div>
                  </TableCellLayout>
                </TableCell>





                <TableCell>
                  <TableCellLayout>
                  <div style={{cursor:'pointer'}} className={wrapper}>
                    <Dialog>
                      <DialogTrigger disableButtonEnhancement>
                        <InfoRegular/>
                      </DialogTrigger>
                      <div className={backdrop}>
                      <DialogSurface className={dialogSurface}>
                        <DialogBody>
                          <DialogTitle style={{}}><strong>Détails</strong></DialogTitle>
                          <p><strong>Commentaire:</strong>{item.Comment}</p>
                          <p><strong>Nom du Manager:</strong>{item.IDManage1}</p>
                          <div style={{display:'flex'}}>
                          <DocumentArrowDown24Regular style={{marginTop:'20px'}} />
                          <PrimaryButton style={{height:'24px',backgroundColor:'#23365E' ,borderRadius:'25px',marginTop:'20px' }}>
                            Télecharger
                          </PrimaryButton>
                          </div>
                        </DialogBody>
                      </DialogSurface>
                      </div>
                    </Dialog>
                  </div>
                  </TableCellLayout>
                </TableCell>
              </TableRow>
             ))} 
          </TableBody>
        </Table>
        </div>
      </div>
    );
  }
}
