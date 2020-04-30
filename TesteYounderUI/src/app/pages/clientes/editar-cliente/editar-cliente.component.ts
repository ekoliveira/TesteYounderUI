import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClienteViewModel } from 'src/app/core/models/cliente-view-model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClienteService } from 'src/app/core/services/cliente/cliente.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit {

  @Input() cliente : ClienteViewModel;
  @Output() clienteEditado : EventEmitter<ClienteViewModel> = new EventEmitter();
  formCliente : FormGroup;

  constructor(
    private _clienteService : ClienteService,
    private formBuilder : FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    let cliente = new ClienteViewModel();
    this.formCliente = this.formBuilder.group({
      id : [cliente.id],
      nome : [cliente.nome],
      cpf : [cliente.cpf],
      rg : [cliente.rg],
      dataNascimento : [cliente.dataNascimento]
    })
    this.formCliente.controls.id.setValue(this.cliente.id);
    this.formCliente.controls.nome.setValue(this.cliente.nome);
    this.formCliente.controls.cpf.setValue(this.cliente.cpf);
    this.formCliente.controls.rg.setValue(this.cliente.rg);
    this.formCliente.controls.dataNascimento.setValue(this.dataFormatada(this.cliente.dataNascimento));
  }

  updateCliente(cliente : ClienteViewModel){
    cliente.cpf = cliente.cpf.replace(/\D/g, '')
    cliente.rg = cliente.rg.replace(/\D/g, '')
    this._clienteService.putCliente(cliente).subscribe((resp:any) => {
      this.clienteEditado.emit(cliente);
      this.activeModal.close();
    });
  }

  dataFormatada(data : Date) : string{
    var ano  = data.toString().substr(0,4);
    var mes  = data.toString().substr(5,2);
    var dia = data.toString().substr(8,2);    
    var dataFormatada = ano + "-" + mes + "-" + dia
    return dataFormatada;
  }

  disableSubmit(){
    if(this.formCliente.controls.nome.value == null || this.formCliente.controls.nome.value == ""){
      return true;
    }

    if(this.formCliente.controls.dataNascimento.value == null || this.formCliente.controls.dataNascimento.value == ""){
      return true;
    }

    if(this.formCliente.controls.cpf.value == null || this.formCliente.controls.cpf.value == "" && this.formCliente.controls.cpf.value.length < 11){
      return true;
    }

    if(this.formCliente.controls.rg.value == null || this.formCliente.controls.rg.value == "" && this.formCliente.controls.rg.value.length < 12){
      return true;
    }

    return false;
  }

}
