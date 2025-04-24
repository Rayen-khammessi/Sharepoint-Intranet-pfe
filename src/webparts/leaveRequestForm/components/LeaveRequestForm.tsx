import * as React from 'react';
import styles from './LeaveRequestForm.module.scss';
import type { ILeaveRequestFormProps } from './ILeaveRequestFormProps';
import { FontSizes, FontWeights, mergeStyles, PrimaryButton } from '@fluentui/react';
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { Field } from "@fluentui/react-components";
import { useId, Input, Label } from "@fluentui/react-components";
import type { InputProps, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {Dropdown,makeStyles,Option} from "@fluentui/react-components";
import type { DropdownProps } from "@fluentui/react-components";




const titleClass = mergeStyles({
  fontSize: 'var(--fontSizeHero900)',
  fontWeight: 'var(--fontWeightBold)',
  lineHeight: 'var(--lineHeightHero900)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop:'12px'
});

const textfieldsClass = mergeStyles({
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  FontSizes: "16px",
  FontWeights: "bold",
  color: "#323130",
});

const confirmButtonClass = mergeStyles({
  display: 'flex',
  backgroundColor:'#F36A06',
  color:'white',
  marginLeft:'auto',
  marginTop:'10px',
  marginRight:'auto',
  borderRadius:'20px'
})

const dateClass = mergeStyles({
  backgroundColor:'white',
  maxWidth: "300px",
  height:"30px",
});

const inputClass = mergeStyles({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

const dropdownClass = mergeStyles({
  display: "grid",
  gridTemplateRows: "repeat(1fr)",
  justifyItems: "start",
  gap: "2px",
  maxWidth: "400px",
});




export default class LeaveRequestForm extends React.Component<ILeaveRequestFormProps ,  {}> {

  public state = {
    title: "",
    MyList :{},
    items: {
      "Nom de l'employé": "",
      "Adresse email de l'organisation": "",
      "Matricule employé": "",
      "Entité professionelle": "",
      "Post": ""
    },
    startDate :"",
    endDate : "",
    nbDays:0,
    motif:'',
    comment:'',
    remplacant:'',
    options :["choix 1" ,"choix 2" ,"choix 3"],
    SoldeConge:0,
  }
  private sp: SPFI;

  public async componentDidMount(): Promise<void> {
    this.sp = spfi().using(SPFx(this.props.context));
    await this.getListItems();
  }  





  private async getListItems(): Promise<void> {
    try {
      const items = await this.sp.web.lists.getByTitle("UsersList").items();
      const fetchedItem = items[1];
      this.setState({ items: {
        "Nom de l'employé": fetchedItem.UserLastName,
        "Adresse email de l'organisation": fetchedItem.EmailAdresse,
        "Matricule employé": fetchedItem.Matricule,
        "Entité professionnelle": fetchedItem.Establishment,
        "Post": fetchedItem.Job,
      },});
      this.setState({SoldeConge: fetchedItem.SoldConge})
      this.setState({MyList:fetchedItem})

    } catch (error) {
      console.error("Error fetching list items: ", error);
    }
  };
 



  private async setListItem(): Promise<void> {
    console.log('clicked')
    try {
      const newItem = await this.sp.web.lists.getByTitle("leaveList").items.add({
        StartDate: new Date(this.state.startDate) ,
        EndDate: new Date (this.state.endDate),
        NB_days: this.state.nbDays,
        AbsenceReason: this.state.motif,
        Comment:this.state.comment,
        substituteID: String(this.state.remplacant),
        Solde: (this.state.MyList as any).SoldConge,
        Etablissement:(this.state.MyList as any).Establishment,
        UserID: (this.state.MyList as any).UserID
      });
  
      console.log("Item added:", newItem);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error submitting request.");
    }
  }
  
  

  selectStart=(date)=>{
    this.setState({startDate:String(date)});
  }
  selectEnd=(date)=>{
    this.setState({endDate:String(date)});
  }
  calculateWeekdaysDifference = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
      const temp = startDate;
      startDate.setTime(endDate.getTime());
      endDate.setTime(temp.getTime());
    }
  
    let dayCount = 0;
  
    while (startDate <= endDate) {
      const dayOfWeek = startDate.getDay(); 
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        dayCount++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  
    return dayCount;
  };
  calculateDays=()=>{
    if (!this.state.endDate || !this.state.startDate){
      console.log('Add a date')
    }
    else {
      const start = new Date(this.state.startDate);
      const end = new Date(this.state.endDate);
      const weekdaysDifference = this.calculateWeekdaysDifference(start, end);
      this.setState({nbDays:weekdaysDifference});
    }
  }

  handleChange = (event: SelectionEvents, data: OptionOnSelectData) => {
    this.setState({motif:data.optionValue});
    console.log("Selected:", data.optionValue);
  };

  handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({comment : e.target.value});
  };
  handleChangeRemplacant = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({remplacant : e.target.value});
  };


  public render(): React.ReactElement<ILeaveRequestFormProps> {
    console.log(this.state.MyList)


    return (
      <div style={{backgroundColor:"#f4f3f3",borderRadius:'15px'}}>
      {/* TITLE */}

        <h1 className={titleClass}>DEMANDE DE CONGÉ</h1>

      {/* TITLE */}





      {/* CONTACT DETAILS */}
        <div style={{marginLeft:'30px'}} >
        <div>
          {Object.entries(this.state.items).map(([key, value], index) => (
            <p  key={index}>
              {key}: <strong>{value}</strong>
            </p>
          ))}
        </div>

      {/* CONTACT DETAILS */}




      {/* ABSENCE REASON */}
        <p>* Indique un champ obligatoire</p>
        </div>
        <div style={{display:'flex', flexDirection: "row",marginLeft:'30px'}}>
        <div className={dropdownClass}>
          <label><strong>*Motif d'absence</strong></label>
            <Dropdown  onOptionSelect={this.handleChange} placeholder="Choisir" >
              {this.state.options.map((option) => (
                <Option style={{backgroundColor:'white'}} key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </div>
        {/* ABSENCE REASON */}




        {/* DATE */}
          <Field style={{marginLeft:"20px"}}>
            <label><strong>*Date de début</strong></label>
            <DatePicker
              className={dateClass}
              placeholder="Select a date..."
              onSelectDate={this.selectStart}
            />
          </Field>
          <Field style={{marginLeft:"20px"}} >
            <label><strong>*Date fin</strong></label>
            <DatePicker
              className={dateClass}
              placeholder="Select a date..."
              onSelectDate={this.selectEnd}
            />
          </Field>
          {/* DATE */}




          {/* ELEMENT */}
          <Field style={{marginLeft:"20px"}}>
            <label><strong>Attacher un élément justificatif</strong></label>
            <PrimaryButton style={{height:'30px',width:'190px', backgroundColor:'#23365E' ,borderRadius:'25px' }}  > Choisir un élément </PrimaryButton>
          </Field>
          </div>
          {/* ELEMENT */}




          {/* DAYS NUMBER */}
          <div style={{marginTop:"20px", display:'flex', flexDirection: "row", marginLeft:'30px'}} >
          <Field >
            <label><strong>Jours</strong></label>
            <p style={{color:'black'}}>{this.state.nbDays}</p>
          </Field>
          <Field style={{marginLeft:"20px"}} label="">
            <PrimaryButton style={{height:'20px',width:'150px', backgroundColor:'#23365E' ,borderRadius:'25px',marginTop:'20px' }}  
            onClick={this.calculateDays}
            > Calculer la durée </PrimaryButton>
          </Field>
          </div>
          {/* DAYS NUMBER */}





          {/* SUBSTITUTE */}
          <div style={{marginLeft:'30px'}} >
          <Field>
            <label><strong>Remplacé par</strong></label>
            <div className={inputClass}>
              <Input style={{maxWidth:'400px'}} 
              // type="text" 
              value={this.state.remplacant} 
              onChange={this.handleChangeRemplacant}
              placeholder='employé ...' 
              />
            </div>
          </Field>
          </div>

          {/* SUBSTITUE */}




          {/* COMMENT */}
          <div style={{marginLeft:'30px'}}>
          <Field>
            <label><strong>Commentaire</strong></label>
            <div className={inputClass}>
              <Input style={{width:'100%',height:'80px'}} 
              type="text" 
              value={this.state.comment} 
              onChange={this.handleChangeComment}
              placeholder=' ...' 
              />
            </div>
          </Field>
          </div>
          {/* COMMENT */}




          {/* OTHER DETAILS */}
          <div style={{marginLeft:'30px'}}>
          <div style={{ display:'flex', backgroundColor:'#23365E',color:'white',width:'100%',height:'30px',alignItems:'center',marginTop:'10px'}}>
            <p style={{marginLeft:'10px'}}><b>Autres détails</b></p>
          </div>
          <div style={{display:'flex',alignItems:'center',border: "1px solid black",height:'45px'}}>
            <p style={{marginLeft:'10px'}}>Solde de congées | {this.state.SoldeConge}</p>
          </div>
          </div>
          <PrimaryButton className={confirmButtonClass} onClick={()=>this.setListItem()}><strong>Soumettre la demande</strong></PrimaryButton>
          {/* OTHER DETAILS */}




      </div>
    );
  } 
}




