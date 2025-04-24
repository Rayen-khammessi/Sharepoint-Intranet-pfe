import * as React from 'react';
import type { IDashboardUserLeaveProps } from './IDashboardUserLeaveProps';
import { mergeStyles, PrimaryButton } from '@fluentui/react';
import { Dropdown ,Option, OptionOnSelectData, SelectionEvents } from '@fluentui/react-components';
import {
  FolderRegular,
  EditRegular,
  OpenRegular,
  DocumentRegular,
  PeopleRegular,
  DocumentPdfRegular,
  VideoRegular,
} from "@fluentui/react-icons";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  PresenceBadgeStatus,
  Avatar,
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




const wrapper = mergeStyles({
  display: "flex",
  gap: "20px",
});


const dialogSurface = mergeStyles({
  boxShadow: "0px 4px 10px rgba(0, 0, 45, 0.1)", // Customize shadow here if needed
  borderRadius: "8px", // Optional: for rounded corners
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
  gridTemplateRows: "repeat(1fr)",
  justifyItems: "start",
  gap: "2px",
  maxWidth: "400px",
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
    options1:['choix1','choix2','choix3'],
    filtre1:'',
    columns:["Motif d'absence",'Date début','Date fin','Status','Action','Détails'],
    fetcheditem: [] as any,
    open: false 
  };

  private sp: SPFI;

  public async componentDidMount(): Promise<void> {
    this.sp = spfi().using(SPFx(this.props.context));
    await this.getListItems();
  };


  private async getListItems(): Promise<void> {
    try {
      const items = await this.sp.web.lists.getByTitle("leaveList").items();
      const fetchedItem = items[1];
      this.setState({fetcheditem: fetchedItem})

    } catch (error) {
      console.error("Error fetching list items: ", error);
    }
  };


  handleChange = (event: SelectionEvents, data: OptionOnSelectData) => {
    this.setState({filtre1:data.optionValue});
  };

  setOpen = (value: boolean) => {
    this.setState({ open: value });
  };




  public render(): React.ReactElement<IDashboardUserLeaveProps> {

    console.log(this.state)
    return (
      <div>
        <strong>Filtres</strong>
        <div style={{display:'flex',flexDirection:'row',gap:'20px',height:'35px'}}>
          <div style={{display:'flex',flexDirection:'row',gap:'0px'}} >
            <p>filtre 1</p>
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
            <p>filtre 2</p>
            <div style={{height:'15px',marginTop:'11px'}}>
            <Dropdown className={dropdownClass} onOptionSelect={this.handleChange} placeholder="Choisir" >
              {this.state.options.map((option) => (
                <Option style={{backgroundColor:'white'}} key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
            </div>
          </div>




          <PrimaryButton className={confirmButtonClass}>REFRAICHIR</PrimaryButton>
          <PrimaryButton className={confirmButtonClass}>CREER UNE DEMANDE</PrimaryButton>
          <PrimaryButton className={confirmButtonClass} style={{marginLeft:'30px'}}>CHOISIR UN REMPLACANT</PrimaryButton>
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
            {/* {items.map((item) => ( */}
              <TableRow>
                <TableCell>
                  <TableCellLayout>
                    {this.state.fetcheditem.AbsenceReason}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  {this.state.fetcheditem.StartDate}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  {this.state.fetcheditem.EndDate}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  {this.state.fetcheditem.Status}
                  </TableCellLayout>
                </TableCell>

                <TableCell>
                  <TableCellLayout>
                  <DeleteRegular/>
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
                          <DialogTitle>Here is the content</DialogTitle>
                        </DialogBody>
                      </DialogSurface>
                      </div>
                    </Dialog>
                  </div>
                  </TableCellLayout>
                </TableCell>

              </TableRow>
            {/* ))} */}
          </TableBody>
        </Table>
        </div>
      </div>
    );
  }
}
